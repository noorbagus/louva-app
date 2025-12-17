'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { QRScanner } from '@/components/admin/QRScanner'
import { TransactionForm } from '@/components/admin/TransactionForm'
import { DEFAULT_SERVICES } from '@/lib/constants'
import type { Customer, Service } from '@/lib/types'

// Mock data
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

const mockServices: Service[] = DEFAULT_SERVICES.map((service, index) => ({
  service_id: `svc-${String(index + 1).padStart(3, '0')}`,
  name: service.name,
  category: service.category,
  price: service.price,
  point_multiplier: service.pointMultiplier,
  description: service.description,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}))

export default function AdminScannerPage() {
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null)
  const [showTransaction, setShowTransaction] = useState(false)

  const handleScanSuccess = (customer: Customer) => {
    setScannedCustomer(customer)
    // Auto transition to transaction after scan
    setTimeout(() => {
      setShowTransaction(true)
    }, 1500)
  }

  const handleTransactionComplete = (transactionData: any) => {
    console.log('Transaction completed:', transactionData)
    // Reset after successful transaction
    setScannedCustomer(null)
    setShowTransaction(false)
  }

  const handleNewScan = () => {
    setScannedCustomer(null)
    setShowTransaction(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A8BC2] to-[#5A9BD4] sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white hover:text-[#93BEE1]">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-white">Scan Customer QR</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {!showTransaction ? (
          <>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              className="mb-6"
            />

            {/* Instructions */}
            <Card variant="glass" className="bg-[#243442]/50">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-2">How to Scan</h3>
                <ol className="space-y-2 text-[#b0b8c1] text-sm">
                  <li className="flex gap-2">
                    <span className="text-[#93BEE1]">1.</span>
                    <span>Ask customer to open their loyalty card</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93BEE1]">2.</span>
                    <span>Position QR code within the scanner frame</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93BEE1]">3.</span>
                    <span>Wait for automatic detection</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93BEE1]">4.</span>
                    <span>Proceed with transaction</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Customer Info Header */}
            <div className="bg-gradient-to-r from-[#4A8BC2] to-[#5A9BD4] -mx-4 px-4 py-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    New Transaction
                  </h2>
                  <p className="text-[#93BEE1] text-sm">
                    {scannedCustomer?.name}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNewScan}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  Scan Another
                </Button>
              </div>
            </div>

            {scannedCustomer && (
              <TransactionForm
                customer={scannedCustomer}
                services={mockServices}
                onTransactionComplete={handleTransactionComplete}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}