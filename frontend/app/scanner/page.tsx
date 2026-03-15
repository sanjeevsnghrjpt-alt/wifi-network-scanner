'use client'

import { useState, useEffect } from 'react'
import { NetworkScannerUI, ScannedDevice } from '../components/NetworkScanner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function WiFiNetworkScannerPage() {
  const [devices, setDevices] = useState<ScannedDevice[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [localIP, setLocalIP] = useState('')
  const [subnet, setSubnet] = useState('')

  useEffect(() => {
    // Fetch initial network info
    fetchNetworkInfo()
  }, [])

  const fetchNetworkInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/network`)
      if (response.ok) {
        const data = await response.json()
        setLocalIP(data.localIP)
        setSubnet(data.subnet)
      }
    } catch (error) {
      console.error('Failed to fetch network info:', error)
    }
  }

  const handleScan = async () => {
    setIsScanning(true)
    setDevices([])

    try {
      const response = await fetch(`${API_URL}/network`)

      if (!response.ok) {
        throw new Error('Network scan failed')
      }

      const data = await response.json()

      if (data.success && data.devices) {
        setDevices(data.devices)
        setLocalIP(data.localIP)
        setSubnet(data.subnet)
      } else {
        console.error('Scan error:', data.error)
      }
    } catch (error) {
      console.error('Network scan error:', error)
      alert('Failed to scan network. Make sure the backend is running.')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <NetworkScannerUI
        devices={devices}
        isScanning={isScanning}
        localIP={localIP}
        subnet={subnet}
        onScan={handleScan}
      />
    </div>
  )
}
