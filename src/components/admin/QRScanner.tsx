'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react'
import { parseQRData, isQRValid, formatDate } from '@/lib/utils'
import type { Customer } from '@/lib/types'

interface QRScannerProps {
  onScanSuccess?: (customer: Customer) => void
  className?: string
}

export function QRScanner({ onScanSuccess, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [lastResult, setLastResult] = useState<{
    type: 'success' | 'error'
    message: string
    customer?: Customer
  } | null>(null)
  const [scannedData, setScannedData] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock customer data for prototype
  const mockCustomer: Customer = {
    customer_id: 'cust-001',
    name: 'Sari Dewi',
    phone: '+628123456789',
    email: 'sari.dewi@email.com',
    total_points: 750,
    membership_level: 'Silver',
    created_at: '2024-01-15T10:00:00Z',
    last_visit: '2024-01-20T14:30:00Z'
  }

  useEffect(() => {
    if (isScanning && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isScanning])

  const handleScan = (data: string) => {
    setScannedData(data)

    // Parse QR data
    const parsed = parseQRData(data)

    if (!parsed) {
      setLastResult({
        type: 'error',
        message: 'Invalid QR code format'
      })
      setIsScanning(false)
      return
    }

    // Check if QR is valid
    if (!isQRValid(parsed.timestamp)) {
      setLastResult({
        type: 'error',
        message: 'QR code has expired. Please generate a new one.'
      })
      setIsScanning(false)
      return
    }

    // Simulate API call to get customer data
    // In real app, this would call the API with parsed.customerId
    if (parsed.customerId === mockCustomer.customer_id) {
      setLastResult({
        type: 'success',
        message: 'Customer found successfully!',
        customer: mockCustomer
      })
      onScanSuccess?.(mockCustomer)
    } else {
      setLastResult({
        type: 'error',
        message: 'Customer not found'
      })
    }

    setIsScanning(false)
  }

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const qrInput = formData.get('qrInput') as string
    if (qrInput) {
      handleScan(qrInput)
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setLastResult(null)
    setScannedData('')
  }

  const stopScanning = () => {
    setIsScanning(false)
    setScannedData('')
  }

  return (
    <div className={className}>
      {isScanning ? (
        <Card variant="dark">
          <CardContent className="p-6">
            <div className="text-center">
              {/* Scanner Frame */}
              <div className="relative w-64 h-64 mx-auto mb-4">
                <div className="absolute inset-0 bg-[#1a2832] rounded-lg border-2 border-[#93BEE1]">
                  {/* Animated Scan Line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#93BEE1] to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>

                  {/* Corner Markers */}
                  <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#93BEE1]"></div>
                  <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#93BEE1]"></div>
                  <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#93BEE1]"></div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#93BEE1]"></div>

                  <Camera className="absolute inset-0 m-auto w-16 h-16 text-[#6b7785]" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">Scanning QR Code...</h3>
              <p className="text-[#b0b8c1] text-sm mb-4">
                Position the QR code within the frame
              </p>

              {/* Manual Input for Testing */}
              <form onSubmit={handleManualInput} className="mb-4">
                <input
                  ref={inputRef}
                  name="qrInput"
                  type="text"
                  placeholder="Enter QR data manually (for testing)"
                  className="w-full bg-[#0a1620] border border-[#2d3748] rounded-lg px-4 py-2 text-white placeholder-[#6b7785] text-sm"
                />
                <p className="text-xs text-[#6b7785] mt-1">
                  Test data: LOUVAcust-0012024-01-20T12:00:00.000Zloyalty
                </p>
              </form>

              <Button
                variant="secondary"
                onClick={stopScanning}
                className="w-full"
              >
                Cancel Scanning
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="glass">
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-[#93BEE1]/20 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-[#93BEE1]" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              QR Code Scanner
            </h3>
            <p className="text-[#b0b8c1] text-sm mb-6">
              Scan customer QR code to process transactions
            </p>

            <Button
              variant="primary"
              onClick={startScanning}
              className="w-full bg-gradient-to-r from-[#93BEE1] to-[#7ba6d3] hover:from-[#7ba6d3] hover:to-[#93BEE1]"
            >
              Start Scanning
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Result Display */}
      {lastResult && (
        <Card variant={lastResult.type === 'success' ? 'glass' : 'glass'}
              className={`mt-4 ${lastResult.type === 'error' ? 'bg-red-500/10 border-red-500/20' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {lastResult.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium mb-1 ${
                  lastResult.type === 'success' ? 'text-white' : 'text-red-400'
                }`}>
                  {lastResult.type === 'success' ? 'Success' : 'Error'}
                </h4>
                <p className={`text-sm ${
                  lastResult.type === 'success' ? 'text-[#b0b8c1]' : 'text-red-300'
                }`}>
                  {lastResult.message}
                </p>

                {lastResult.customer && (
                  <div className="mt-3 p-3 bg-[#0a1620]/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#93BEE1]/20 flex items-center justify-center">
                        <span className="text-[#93BEE1] font-semibold">
                          {lastResult.customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium">{lastResult.customer.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" size="sm" className="bg-[#ffa726]/20 text-[#ffa726] border-[#ffa726]/30">
                            {lastResult.customer.membership_level}
                          </Badge>
                          <span className="text-[#b0b8c1] text-xs">
                            {lastResult.customer.total_points} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setLastResult(null)}
                className="text-[#6b7785] hover:text-[#b0b8c1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}