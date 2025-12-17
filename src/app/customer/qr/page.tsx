'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { QRModal } from '@/components/customer/QRModal'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { formatDateTime } from '@/lib/utils'
import type { Customer } from '@/lib/types'

// Mock data for prototype
const mockCustomer: Customer = {
  id: 'cust-001',
  customer_id: 'cust-001',
  name: 'Sari Dewi',
  phone: '+628123456789',
  email: 'sari.dewi@email.com',
  total_points: 750,
  membership_level: 'Silver',
  created_at: '2024-01-15T10:00:00Z',
  last_visit: '2024-01-20T14:30:00Z'
}

export default function CustomerQRPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [lastQRTime, setLastQRTime] = useState<Date | null>(null)

  useEffect(() => {
    // Simulate API call
    setCustomer(mockCustomer)
  }, [])

  const handleOpenQR = () => {
    setIsQRModalOpen(true)
    setLastQRTime(new Date())
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="bg-dark-800/50 backdrop-blur-lg border-b border-dark-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/customer" className="text-dark-300 hover:text-dark-100">
              ←
            </a>
            <h1 className="text-xl font-semibold text-dark-100">QR Code Saya</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Customer Info Card */}
        <Card variant="glass">
          <CardContent className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-xl font-semibold text-dark-100 mb-1">{customer.name}</h2>
            <Badge variant="secondary" className="mb-3">
              {customer.membership_level} Member
            </Badge>
            <p className="text-dark-400 text-sm">{customer.phone}</p>
            <p className="text-dark-400 text-sm">{customer.email}</p>
          </CardContent>
        </Card>

        {/* QR Display Section */}
        <Card variant="dark">
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto bg-dark-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-6xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">
                Tampilkan QR Code Anda
              </h3>
              <p className="text-dark-400 text-sm mb-4">
                Tunjukkan QR code ini ke staff salon untuk mendapatkan poin
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenQR}
              className="w-full"
            >
              Buka QR Code
            </Button>

            {lastQRTime && (
              <p className="text-xs text-dark-500 mt-3">
                Terakhir diperbarui: {formatDateTime(lastQRTime)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card variant="glass">
          <CardContent className="py-4">
            <h3 className="text-dark-100 font-medium mb-3">Cara Penggunaan</h3>
            <ol className="space-y-2 text-dark-300 text-sm">
              <li className="flex gap-2">
                <span className="text-primary-400">1.</span>
                <span>Klik tombol "Buka QR Code" di atas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-400">2.</span>
                <span>Tunjukkan QR code ke staff salon</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-400">3.</span>
                <span>Staff akan memindai QR code untuk transaksi</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-400">4.</span>
                <span>Poin akan otomatis ditambahkan ke akun Anda</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card variant="glass" className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="text-dark-100 font-medium mb-1">Keamanan</h4>
                <p className="text-dark-300 text-sm">
                  QR code akan otomatis refresh setiap 5 menit untuk menjaga keamanan akun Anda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        customer={customer}
      />
    </div>
  )
}