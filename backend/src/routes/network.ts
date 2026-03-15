import express, { Router, Request, Response } from 'express'
import { networkScanner, ScannedDevice } from '../services/NetworkScanner.js'

const router: Router = express.Router()

interface ScanResponse {
  success: boolean
  devices?: ScannedDevice[]
  localIP?: string
  subnet?: string
  error?: string
}

router.get('/network', async (req: Request, res: Response) => {
  try {
    const devices = await networkScanner.scanNetwork()
    const localIP = networkScanner.getLocalIP()
    const subnet = networkScanner.getSubnet()

    res.json({
      success: true,
      devices,
      localIP,
      subnet,
    } as ScanResponse)
  } catch (error) {
    console.error('Network scan error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to scan network',
    } as ScanResponse)
  }
})

export default router
