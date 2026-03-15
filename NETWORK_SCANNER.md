# Network Scanner Setup Guide

## Overview
The Network Scanner is a powerful tool integrated into the Blackbox AI project that discovers and monitors all devices connected to your local network. It displays device names, IP addresses, MAC addresses, and online status in a beautiful, real-time web interface.

## Features
- ✅ Real-time device discovery on local network
- ✅ Displays hostname, IP address, and MAC address
- ✅ Shows device online/scanning status
- ✅ Cross-platform support (Windows, Linux, macOS)
- ✅ Beautiful, responsive UI
- ✅ Network information display (Local IP, Subnet)
- ✅ Device statistics and scanning status

## Architecture

### Backend (Node.js + Express)
- **Service**: `backend/src/services/NetworkScanner.ts`
  - Detects local network configuration
  - Scans network using platform-specific methods
  - Windows: Uses ARP table (`arp -a` command)
  - Linux/macOS: Uses `arp-scan` or `arp` command
  - Resolves device hostnames via DNS and connection attempts

- **API Route**: `backend/src/routes/network.ts`
  - Endpoint: `GET /api/network`
  - Returns: List of discovered devices, local IP, and subnet

### Frontend (Next.js + React)
- **Component**: `frontend/app/components/NetworkScanner.tsx`
  - Reusable UI component
  - Displays devices in card grid layout
  - Shows network statistics
  - Real-time device status

- **Page**: `frontend/app/scanner/page.tsx`
  - Main network scanner page
  - Handles API calls to backend
  - Manages scanning state

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Both backend and frontend installed with dependencies

### Step 1: Install Dependencies
If you haven't already:

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables

#### Backend (.env.local)
Create `backend/.env.local`:
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 3: Start the Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

### Step 4: Access the Network Scanner
1. Open `http://localhost:3000` in your browser
2. Navigate to "Network Scanner" from the navigation menu
3. Or directly visit `http://localhost:3000/scanner`
4. Click "Scan Network" button to discover devices

## How It Works

### Windows Network Scanning
- Uses the ARP (Address Resolution Protocol) table
- Retrieves all currently known devices on the network
- Attempts to resolve hostnames via DNS
- Returns device IP, MAC address, and status

### Linux/macOS Network Scanning
- Uses `arp-scan` command (if available)
- Falls back to standard `arp` command
- Performs active network scanning
- Resolves hostnames via DNS

### Device Discovery Process
1. Detects local IP address and subnet
2. Scans ARP table for active devices
3. Resolves hostname for each device (async)
4. Filters and returns device list
5. Marks all responding devices as "online"

## API Reference

### Get Network Devices
```
GET /api/network
```

**Response:**
```json
{
  "success": true,
  "devices": [
    {
      "ip": "192.168.1.100",
      "hostname": "my-laptop",
      "mac": "aa:bb:cc:dd:ee:ff",
      "status": "online"
    }
  ],
  "localIP": "192.168.1.50",
  "subnet": "192.168.1"
}
```

## Troubleshooting

### No devices are being discovered
- Make sure the backend is running on port 3001
- Check that CORS is properly configured
- On Windows, try running terminal as Administrator
- Ensure you're connected to the network

### Hostname resolution not working
- Some devices don't respond to DNS queries
- Some network configurations block reverse DNS
- The IP address will still be displayed even if hostname fails

### Backend connection error
- Verify backend is running: `http://localhost:3001/api/network`
- Check CORS_ORIGIN setting in backend .env.local
- Ensure frontend API_URL matches backend port

### Insufficient permissions on Linux/macOS
- `arp-scan` may require sudo privileges
- Try running with: `sudo npm run dev`
- Or install arp-scan: `sudo apt-get install arp-scan`

## Performance Tips

- First scan may take 10-30 seconds to resolve all hostnames
- Subsequent scans are faster as devices are cached
- Disable hostname resolution if only IP addresses are needed
- Large networks (100+ devices) may take longer to scan

## Limitations

- Only shows devices currently connected to the local network
- Cannot scan across different subnets
- Some devices may not respond to network discovery
- Requires network access (won't work on isolated networks)

## Future Enhancements

Potential features for future versions:
- Real-time monitoring with periodic auto-scans
- Device filtering and search
- Ping and port scanning
- Device categorization (phones, laptops, IoT devices)
- Network bandwidth monitoring
- Device wake-on-LAN functionality
- Export scan results (CSV, JSON)
- Save network snapshots for history
- Alert system for new/lost devices

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Windows  | ✅ Supported | Uses ARP table |
| Linux    | ✅ Supported | Uses arp-scan or arp |
| macOS    | ✅ Supported | Uses arp command |

## Security Notes

- The network scanner only reads ARP tables (passive scanning)
- No packets are sent unless explicitly needed for hostname resolution
- All operations are local to your network
- Data is not sent to external servers
- The web interface should be accessed over HTTPS in production

## Integration with Blackbox AI

The Network Scanner is now part of the Blackbox AI Alternative project and can be accessed:
- Through the main navigation menu
- Via direct URL `/scanner` route
- Featured in the main features list on the homepage

Network scanner data can be integrated with other Blackbox AI features for:
- AI analysis of network topology
- Code generation for network management tools
- Real-time collaboration across team devices
- Device monitoring and logging

---

**Need Help?** Check the main README.md or create an issue on the project repository.
