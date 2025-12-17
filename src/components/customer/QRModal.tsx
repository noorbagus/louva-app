'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/shared/Button'
import { Customer } from '@/lib/types'
import { generateQRData } from '@/lib/utils'
import { Download, RefreshCw } from 'lucide-react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer
}

export function QRModal({ isOpen, onClose, customer }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQR()
    }
  }, [isOpen, customer])

  const generateQR = async () => {
    if (!canvasRef.current) return

    const qrData = generateQRData(customer.customer_id)

    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const downloadQR = () => {
    if (!canvasRef.current) return

    const url = canvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `louva-qr-${customer.customer_id}.png`
    link.click()
  }

  const refreshQR = () => {
    generateQR()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Loyalty QR Code" size="md">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-dark-300 mb-2">
            Show this QR code to the salon staff to earn points
          </p>
          <p className="text-xs text-dark-500">
            QR code refreshes every 5 minutes for security
          </p>
        </div>

        <div className="qr-container p-4">
          <canvas
            ref={canvasRef}
            className="rounded-lg"
          />
        </div>

        <div className="w-full space-y-3">
          <div className="text-center p-3 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-dark-300">Member</p>
            <p className="text-lg font-semibold text-dark-100">{customer.name}</p>
            <p className="text-sm text-primary-400">{customer.membership_level} Member</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={refreshQR}
              className="flex-1"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Download className="w-4 h-4" />}
              onClick={downloadQR}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}