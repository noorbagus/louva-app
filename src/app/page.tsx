'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { PointsDisplay } from '@/components/customer/PointsDisplay'
import { ServiceGrid } from '@/components/customer/ServiceGrid'
import { Badge } from '@/components/shared/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DEFAULT_SERVICES, SERVICE_CATEGORIES } from '@/lib/constants'
import type { Customer, Transaction } from '@/lib/types'

// Mock data for prototype
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

const mockTransactions: Transaction[] = [
  {
    transaction_id: 'txn-001',
    customer_id: 'cust-001',
    service_id: 'svc-001',
    payment_method: 'gopay',
    total_amount: 50000,
    points_earned: 50,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    transaction_id: 'txn-002',
    customer_id: 'cust-001',
    service_id: 'svc-003',
    payment_method: 'cash',
    total_amount: 100000,
    points_earned: 100,
    created_at: '2024-01-18T10:15:00Z',
    updated_at: '2024-01-18T10:15:00Z'
  }
]

export default function CustomerHomePage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Simulate API call
    setCustomer(mockCustomer)
    setRecentTransactions(mockTransactions.slice(0, 3))
  }, [])

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dark-100">
                Halo, {customer.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-sm text-dark-400">
                {formatDate(customer.last_visit || customer.created_at)}
              </p>
            </div>
            <Link href="/customer/account">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Points Display */}
        <PointsDisplay customer={customer} />

        {/* Quick Actions */}
        <Card variant="glass" className="bg-[#243442]/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-dark-100">Aksi Cepat</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/customer/qr">
              <Button variant="primary" className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200">
                <span className="text-xl">📱</span>
                <span className="text-sm font-medium">QR Saya</span>
              </Button>
            </Link>
            <Link href="/customer/services">
              <Button variant="secondary" className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-dark-700 hover:bg-dark-600 transform hover:scale-105 transition-all duration-200">
                <span className="text-xl">💇</span>
                <span className="text-sm font-medium">Layanan</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Featured Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-dark-100">Layanan Populer</h2>
            <Link href="/customer/services">
              <span className="text-primary-400 text-sm hover:text-primary-300">Lihat semua →</span>
            </Link>
          </div>
          <ServiceGrid
            services={DEFAULT_SERVICES.map((service, index) => ({
              service_id: `svc-${String(index + 1).padStart(3, '0')}`,
              name: service.name,
              category: service.category,
              price: service.price,
              point_multiplier: service.pointMultiplier,
              description: service.description,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })).slice(0, 4)}
          />
        </div>

        {/* Recent Transactions */}
        <Card variant="dark" className="bg-[#1a2832]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-100">Transaksi Terakhir</h2>
              <Link href="/customer/account">
                <span className="text-primary-400 text-sm hover:text-primary-300">Lihat semua →</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.transaction_id} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
                <div className="flex-1">
                  <p className="text-dark-200 text-sm font-medium">
                    {DEFAULT_SERVICES.find(s => s.name.toLowerCase().includes('haircut'))?.name || 'Haircut'}
                  </p>
                  <p className="text-dark-400 text-xs">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-dark-100 text-sm font-medium">
                    {formatCurrency(transaction.total_amount)}
                  </p>
                  <Badge variant="success" size="sm">
                    +{transaction.points_earned} poin
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Membership Promotion */}
        {customer.membership_level === 'Bronze' && (
          <Card variant="glass" className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
            <CardContent className="text-center py-4">
              <p className="text-amber-400 text-sm font-medium mb-1">
                🌟 Upgrade ke Silver!
              </p>
              <p className="text-dark-300 text-xs">
                Dapatkan {500 - customer.total_points} poin lagi untuk nikmati 1.2x poin multiplier
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}