import { useState, useEffect } from 'react'

export interface ScannedDevice {
  ip: string
  hostname: string
  mac?: string
  vendor?: string
  status: 'online' | 'scanning'
}

interface NetworkScannerProps {
  devices: ScannedDevice[]
  isScanning: boolean
  localIP: string
  subnet: string
  onScan: () => void
}

export function NetworkScannerUI({
  devices,
  isScanning,
  localIP,
  subnet,
  onScan,
}: NetworkScannerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 border-green-500/50'
      case 'scanning':
        return 'bg-yellow-500/20 border-yellow-500/50'
      default:
        return 'bg-gray-500/20 border-gray-500/50'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="px-2 py-1 text-xs font-semibold text-green-400 bg-green-500/20 rounded-full border border-green-500/50">
            Online
          </span>
        )
      case 'scanning':
        return (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-400 bg-yellow-500/20 rounded-full border border-yellow-500/50 animate-pulse">
            Scanning
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">WiFi Network Scanner</h1>
        <p className="text-gray-400">Discover and monitor all connected WiFi devices on your network</p>
      </div>

      {/* Network Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Your IP Address</p>
          <p className="text-2xl font-mono font-bold text-blue-400">{localIP || 'Detecting...'}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Subnet</p>
          <p className="text-2xl font-mono font-bold text-purple-400">{subnet || 'Detecting...'}.0/24</p>
        </div>
      </div>

      {/* Scan Button */}
      <div className="mb-8">
        <button
          onClick={onScan}
          disabled={isScanning}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isScanning
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {isScanning ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Scanning Network...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Scan Network
            </span>
          )}
        </button>
      </div>

      {/* Devices List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            Discovered Devices ({devices.length})
          </h2>
        </div>

        {devices.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400">No devices discovered yet. Click "Scan Network" to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${getStatusColor(
                  device.status
                )}`}
              >
                {/* Device Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg break-all">{device.hostname}</h3>
                    <p className="text-gray-400 text-sm font-mono">{device.ip}</p>
                  </div>
                  {getStatusBadge(device.status)}
                </div>

                {/* Device Details */}
                <div className="space-y-2 border-t border-gray-600/30 pt-3">
                  {device.mac && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">MAC Address</p>
                      <p className="text-sm text-gray-300 font-mono">{device.mac}</p>
                    </div>
                  )}
                  {device.vendor && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Vendor</p>
                      <p className="text-sm text-gray-300">{device.vendor}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {devices.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Total Devices</p>
              <p className="text-3xl font-bold text-white">{devices.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Online Devices</p>
              <p className="text-3xl font-bold text-green-400">{devices.filter(d => d.status === 'online').length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Scan Status</p>
              <p className="text-lg font-bold text-blue-400">{isScanning ? 'Scanning' : 'Complete'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="text-sm font-mono text-gray-300">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
