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
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-dark-100 mb-2">Show this to our staff</h3>
          <p className="text-dark-300 mb-2">
            Scan to earn points with your purchase
          </p>
          <p className="text-xs text-dark-500">
            QR code refreshes every 5 minutes for security
          </p>
        </div>

        <div className="qr-container p-6 bg-white rounded-lg">
          <canvas
            ref={canvasRef}
            className="mx-auto"
          />
        </div>

        <div className="w-full bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <span className="text-primary-400 font-semibold text-sm">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-dark-100 font-medium">{customer.name}</p>
              <p className="text-primary-400 text-sm">{customer.membership_level} Member</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Current Points:</span>
              <strong className="text-dark-100">{customer.total_points.toLocaleString('id-ID')}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Valid until:</span>
              <strong className="text-dark-100">Dec 31, 2025</strong>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
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
    </Modal>
  )
}