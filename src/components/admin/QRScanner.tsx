'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BrowserMultiFormatReader } from '@zxing/library'
import { supabase } from '@/lib/supabase-frontend'

export function QRScanner({ onScanSuccess }: { onScanSuccess: (customerData: any) => void }) {
  const [isScanning, setIsScanning] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    // Check camera availability and start scanning on mount
    initializeScanner()

    return () => {
      // Cleanup function
      if (codeReader.current) {
        codeReader.current.reset()
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const initializeScanner = async () => {
    try {
      // Check camera availability first
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')

      if (cameras.length === 0) {
        setHasCamera(false)
        setError('No camera found on this device')
        return
      }

      setHasCamera(true)
      setIsStarting(true)
      setError(null)

      // Get video stream directly first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsScanning(true)
          setIsStarting(false)
        }
      }

      // Initialize code reader for QR detection
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader()
      }

      // Start QR detection using the video stream
      codeReader.current.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result && result.getText()) {
          handleScanResult(result.getText())
        }
      })

    } catch (error) {
      console.error('Camera initialization error:', error)
      setHasCamera(false)
      setError('Failed to access camera. Please check camera permissions.')
      setIsStarting(false)
      setIsScanning(false)
    }
  }

  const stopScan = () => {
    // Stop code reader
    if (codeReader.current) {
      codeReader.current.reset()
    }

    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  const handleScanResult = async (qrCode: string) => {
    try {
      stopScan()

      // Verify QR code and get customer
      const response = await fetch('/api/scan/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode })
      })

      const data = await response.json()

      if (data.success && data.customer) {
        setCustomer(data.customer)
        onScanSuccess(data.customer)

        // Auto-redirect to transaction after showing customer briefly
        setTimeout(() => {
          router.push('/admin/transaction')
        }, 1500)
      } else {
        setError(data.error || 'Invalid QR code or customer not found')
      }
    } catch (error) {
      setError('Failed to verify QR code')
      console.error('Verification error:', error)
    }
  }

  const simulateScan = async () => {
    // Fallback for demo/testing
    await handleScanResult('LOUVA_SD001_2024')
  }

  return (
    <div className="flex flex-col items-center">
      {customer ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 w-full">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-green-300">
              <img
                src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                alt={customer.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">{customer.full_name}</h3>
              <div className="bg-green-100 px-2 py-1 rounded-full text-xs font-medium text-green-800">
                {customer.membership_level} Member • {customer.total_points.toLocaleString()} pts
              </div>
            </div>
          </div>
          <p className="text-green-700">
            Redirecting to transaction...
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            {isStarting ? 'Starting camera...' : isScanning ? 'Position QR code in frame' : 'Initializing scanner...'}
          </h3>
          <p className="text-[var(--text-muted)] mb-8">
            {isStarting ? 'Please wait while we access your camera' : 'Ask customer to show their loyalty card QR code'}
          </p>
        </>
      )}

      {/* Scanner Frame */}
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 border-4 border-[var(--accent)] rounded-2xl bg-[var(--surface-lighter)] overflow-hidden">
          {/* Always show video element when camera is available */}
          {hasCamera ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{
                  transform: 'scaleX(-1)', // Mirror effect for better UX
                  display: 'block'
                }}
                autoPlay
                playsInline
                muted
                controls={false}
              />
              {/* Fallback overlay for video initialization */}
              {isStarting && (
                <div className="absolute inset-0 bg-[var(--surface-lighter)]/80 flex items-center justify-center">
                  <span className="material-icons text-[var(--accent)] text-4xl animate-pulse">videocam</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-icons text-6xl text-[var(--text-muted)] opacity-30">camera_alt_off</span>
            </div>
          )}

          {/* Animated scan line - show when scanning or starting */}
          {(isScanning || isStarting) && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent animate-pulse"></div>
          )}

          {/* Corner markers */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-[var(--accent)] rounded-tl-lg pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-[var(--accent)] rounded-tr-lg pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-[var(--accent)] rounded-bl-lg pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-[var(--accent)] rounded-br-lg pointer-events-none"></div>

          {/* Loading indicator */}
          {isStarting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons text-white text-4xl animate-spin mb-2">refresh</span>
                <p className="text-white text-sm">Accessing camera...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 w-full">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!customer && !error && (
        <p className="text-[var(--text-muted)] text-sm mb-8">
          Camera is automatically detecting QR codes...
        </p>
      )}

      {!hasCamera && !customer && (
        <button
          onClick={simulateScan}
          className="w-full py-4 px-6 rounded-2xl font-semibold transition-all bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] text-white hover:shadow-lg hover:shadow-[var(--secondary)]/25"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-icons">qr_code_2</span>
            Demo Scan
          </span>
        </button>
      )}
    </div>
  )
}