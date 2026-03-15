import { execSync, exec } from 'child_process'
import os from 'os'
import { promisify } from 'util'
import net from 'net'
import dns from 'dns'

const execAsync = promisify(exec)

export interface ScannedDevice {
  ip: string
  hostname: string
  mac?: string
  vendor?: string
  status: 'online' | 'scanning'
}

export class NetworkScanner {
  private localIP: string = ''
  private subnet: string = ''
  private netmask: string = ''

  constructor() {
    this.detectLocalNetwork()
  }

  private detectLocalNetwork(): void {
    const interfaces = os.networkInterfaces()
    for (const [, addrs] of Object.entries(interfaces)) {
      if (addrs) {
        for (const addr of addrs as Array<{ family: string; address: string; internal: boolean; netmask?: string }>) {
          if (addr.family === 'IPv4' && !addr.internal) {
            this.localIP = addr.address
            this.netmask = addr.netmask || '255.255.255.0'
            
            // Calculate subnet based on IP and netmask
            const ipParts = this.localIP.split('.').map(Number)
            const maskParts = this.netmask.split('.').map(Number)
            
            const subnetParts = ipParts.map((ip, i) => ip & maskParts[i])
            this.subnet = subnetParts.join('.')
            
            return
          }
        }
      }
    }
  }

  private isInSubnet(ip: string): boolean {
    const ipParts = ip.split('.').map(Number)
    const maskParts = this.netmask.split('.').map(Number)
    const subnetParts = this.subnet.split('.').map(Number)
    
    // Check if IP is in the same subnet
    for (let i = 0; i < 4; i++) {
      if ((ipParts[i] & maskParts[i]) !== subnetParts[i]) {
        return false
      }
    }
    return true
  }

  private isValidDeviceIP(ip: string): boolean {
    const parts = ip.split('.').map(Number)
    
    // Skip invalid IPs
    if (parts.length !== 4) return false
    if (parts.some(p => p < 0 || p > 255)) return false
    
    // Skip localhost
    if (ip === '127.0.0.1' || ip === '0.0.0.0') return false
    
    // Skip broadcasting addresses (last octet is 0 or 255 for most subnets)
    if (parts[3] === 0 || parts[3] === 255) return false
    
    // Skip if not in current subnet
    if (!this.isInSubnet(ip)) return false
    
    // Skip the gateway (usually .1)
    if (parts[3] === 1 && ip !== this.localIP) return false
    
    return true
  }

  async scanNetwork(): Promise<ScannedDevice[]> {
    const devices: ScannedDevice[] = []
    const platform = process.platform

    try {
      if (platform === 'win32') {
        return await this.scanWindowsNetwork()
      } else if (platform === 'linux' || platform === 'darwin') {
        return await this.scanUnixNetwork()
      }
    } catch (error) {
      console.error('Network scan error:', error)
    }

    return devices
  }

  private async scanWindowsNetwork(): Promise<ScannedDevice[]> {
    const devices: ScannedDevice[] = []

    try {
      // First: Ping devices on the subnet to discover new ones
      console.log('[Scanner] Starting device discovery...')
      await this.pingSubnet()

      // Wait a moment for ARP to update
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Try two methods to get ARP entries
      let arpDevices: Map<string, { ip: string; mac: string }> = await this.getARPEntries()

      // If first method returns few devices, also try PowerShell Get-NetNeighbor
      if (arpDevices.size < 2) {
        console.log('[Scanner] Limited results with cmd arp, trying PowerShell Get-NetNeighbor...')
        const psArpDevices = await this.getPowerShellNetNeighbor()
        if (psArpDevices.size > arpDevices.size) {
          arpDevices = psArpDevices
        }
      }

      console.log(`[Scanner] Found ${arpDevices.size} devices on subnet ${this.subnet}`)

      // Resolve hostnames in parallel
      const resolvedDevices = await Promise.all(
        Array.from(arpDevices.values()).map(async (device) => {
          let hostname = device.ip
          try {
            const resolved = await this.resolveHostname(device.ip)
            if (resolved) {
              hostname = resolved
            }
          } catch (e) {
            // Keep IP as hostname if resolution fails
          }

          return {
            ip: device.ip,
            hostname,
            mac: device.mac,
            status: 'online' as const,
          }
        })
      )

      devices.push(...resolvedDevices)
    } catch (error) {
      console.error('Windows network scan error:', error)
    }

    return devices
  }

  private async getARPEntries(): Promise<Map<string, { ip: string; mac: string }>> {
    const devices: Map<string, { ip: string; mac: string }> = new Map()

    try {
      const { stdout } = await execAsync('arp -a')
      const lines = stdout.split('\n')

      for (const line of lines) {
        const match = line.match(/([0-9.]+)\s+([0-9a-f\-]+)/i)
        if (match) {
          const ip = match[1]
          const mac = match[2].replace(/-/g, ':')

          if (this.isValidDeviceIP(ip)) {
            devices.set(ip, { ip, mac })
          }
        }
      }
    } catch (error) {
      console.error('[Scanner] Error getting ARP entries from cmd:', error)
    }

    return devices
  }

  private async getPowerShellNetNeighbor(): Promise<Map<string, { ip: string; mac: string }>> {
    const devices: Map<string, { ip: string; mac: string }> = new Map()

    try {
      const cmd = `Get-NetNeighbor -AddressFamily IPv4 -State Reachable 2>$null | Select-Object IPAddress,LinkLayerAddress | ConvertTo-Csv -NoTypeInformation`
      const { stdout } = await execAsync(`powershell -NoProfile -Command "${cmd}"`)
      
      const lines = stdout.split('\n')
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          // Parse CSV format: "192.168.1.1","aa-bb-cc-dd-ee-ff"
          const match = line.match(/"([^"]+)","([^"]+)"/)
          if (match) {
            const ip = match[1]
            const mac = match[2].replace(/-/g, ':')

            if (this.isValidDeviceIP(ip)) {
              devices.set(ip, { ip, mac })
            }
          }
        }
      }
    } catch (error) {
      console.log('[Scanner] PowerShell Get-NetNeighbor method not available or failed')
    }

    return devices
  }

  private async pingSubnet(): Promise<void> {
    const subnetParts = this.subnet.split('.')
    const baseIP = subnetParts.slice(0, 3).join('.')

    try {
      console.log(`[Scanner] Scanning subnet ${baseIP}.0/24...`)
      
      // Fire off ping commands quickly without waiting for each
      // This populates the ARP cache as devices respond
      const pingPromises = []
      
      for (let i = 1; i <= 254; i++) {
        const ip = `${baseIP}.${i}`
        // Non-blocking ping - don't wait for it to complete
        const promise = execAsync(`ping -n 1 -w 50 ${ip} >nul 2>&1`).catch(() => {
          // Ignore errors
        })
        pingPromises.push(promise)
        
        // Batch them to avoid too many simultaneous processes
        if (i % 50 === 0) {
          await Promise.all(pingPromises)
          pingPromises.length = 0
        }
      }
      
      // Wait for remaining pings
      await Promise.all(pingPromises)
      console.log('[Scanner] Subnet scan completed')
    } catch (error) {
      console.log('[Scanner] Subnet scan completed (with errors)')
    }
  }

  private async scanUnixNetwork(): Promise<ScannedDevice[]> {
    const devices: ScannedDevice[] = []

    try {
      // Try arp-scan if available
      const { stdout } = await execAsync(`arp-scan -l 2>/dev/null || arp -a`)
      const lines = stdout.split('\n')

      for (const line of lines) {
        if (line.includes('bytes from') || line.includes('Reply')) {
          const ipMatch = line.match(/([0-9.]+)/)
          if (ipMatch) {
            const ip = ipMatch[1]
            const hostname = await this.resolveHostname(ip)

            devices.push({
              ip,
              hostname: hostname || ip,
              status: 'online',
            })
          }
        }
      }
    } catch (error) {
      console.error('Unix network scan error:', error)
    }

    return devices
  }

  private async resolveHostname(ip: string): Promise<string | null> {
    // Method 1: PowerShell DNS (fastest)
    try {
      const dnsResult = await execAsync(
        `powershell -NoProfile -Command "[System.Net.Dns]::GetHostByAddress('${ip}').HostName" 2>$null`
      )
      const hostname = dnsResult.stdout.trim().split('.')[0]
      if (hostname && hostname.length > 0) {
        console.log(`[Hostname] ${ip} -> ${hostname} (PowerShell DNS)`)
        return hostname
      }
    } catch (e) {
      // Continue to next method
    }

    // Method 2: nbtstat (NetBIOS lookup)
    try {
      const nbtResult = await execAsync(`nbtstat -A ${ip} 2>nul`)
      const lines = nbtResult.stdout.split('\n')
      for (const line of lines) {
        // Look for <20> UNIQUE entries (computer name)
        const match = line.match(/^([A-Z0-9\-_]{1,15})\s+<20>\s+UNIQUE/i)
        if (match) {
          const hostname = match[1].trim()
          if (hostname && hostname.length > 0) {
            console.log(`[Hostname] ${ip} -> ${hostname} (nbtstat)`)
            return hostname
          }
        }
      }
    } catch (e) {
      // Continue to next method
    }

    // Method 3: WMI Query (for domain-joined computers)
    try {
      const wmiResult = await execAsync(
        `powershell -NoProfile -Command "Get-WmiObject Win32_ComputerSystem -ComputerName ${ip} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name" 2>$null`,
        { timeout: 5000 }
      )
      const hostname = wmiResult.stdout.trim()
      if (hostname && hostname.length > 0) {
        console.log(`[Hostname] ${ip} -> ${hostname} (WMI)`)
        return hostname
      }
    } catch (e) {
      // WMI might not be available
    }

    // Method 4: Reverse DNS with Resolve-DnsName
    try {
      const resolveResult = await execAsync(
        `powershell -NoProfile -Command "Resolve-DnsName -Name ${ip} -Type PTR -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameHost" 2>$null`,
        { timeout: 3000 }
      )
      const hostname = resolveResult.stdout.trim().split('.')[0]
      if (hostname && hostname.length > 0) {
        console.log(`[Hostname] ${ip} -> ${hostname} (Resolve-DnsName)`)
        return hostname
      }
    } catch (e) {
      // Continue
    }

    // Method 5: Node.js DNS reverse lookup
    return new Promise((resolve) => {
      dns.reverse(ip, (err: Error | null, hostnames?: string[]) => {
        if (!err && hostnames && hostnames.length > 0) {
          try {
            const hostname = hostnames[0].split('.')[0]
            if (hostname && hostname !== ip && hostname.length > 0) {
              console.log(`[Hostname] ${ip} -> ${hostname} (Node DNS)`)
              resolve(hostname)
              return
            }
          } catch (e) {
            // Fall through
          }
        }
        console.log(`[Hostname] ${ip} -> (unresolved)`)
        resolve(null)
      })
    })
  }

  getLocalIP(): string {
    return this.localIP
  }

  getSubnet(): string {
    return this.subnet
  }
}

export const networkScanner = new NetworkScanner()
