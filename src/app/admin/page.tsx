'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils'
import { Scan, Users, TrendingUp, Settings, ChevronRight, Plus } from 'lucide-react'
import type { Transaction, Customer, Service } from '@/lib/types'

// Mock data for prototype
const mockStats = {
  totalCustomers: 156,
  todayRevenue: 2500000,
  monthlyRevenue: 35000000,
  totalRewardsRedeemed: 47
}

const mockRecentTransactions: Transaction[] = [
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
    customer_id: 'cust-002',
    service_id: 'svc-003',
    payment_method: 'cash',
    total_amount: 100000,
    points_earned: 100,
    created_at: '2024-01-20T13:15:00Z',
    updated_at: '2024-01-20T13:15:00Z'
  },
  {
    transaction_id: 'txn-003',
    customer_id: 'cust-003',
    service_id: 'svc-005',
    payment_method: 'ovo',
    total_amount: 80000,
    points_earned: 80,
    created_at: '2024-01-20T11:45:00Z',
    updated_at: '2024-01-20T11:45:00Z'
  }
]

const mockTopCustomers: Customer[] = [
  {
    customer_id: 'cust-001',
    name: 'Sari Dewi',
    phone: '+628123456789',
    email: 'sari.dewi@email.com',
    total_points: 750,
    membership_level: 'Silver',
    created_at: '2024-01-15T10:00:00Z',
    last_visit: '2024-01-20T14:30:00Z'
  },
  {
    customer_id: 'cust-002',
    name: 'Rina Susanti',
    phone: '+628987654321',
    email: 'rina.susanti@email.com',
    total_points: 1200,
    membership_level: 'Gold',
    created_at: '2024-01-10T08:00:00Z',
    last_visit: '2024-01-19T16:20:00Z'
  }
]

const mockPopularServices: (Service & { count: number })[] = [
  {
    service_id: 'svc-001',
    name: 'Haircut',
    category: 'Hair',
    price: 50000,
    point_multiplier: 1,
    description: 'Potongan rambut basic dengan styling',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    count: 45
  },
  {
    service_id: 'svc-003',
    name: 'Hair Treatment',
    category: 'Hair',
    price: 100000,
    point_multiplier: 1.1,
    description: 'Perawatan rambut deep conditioning',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    count: 32
  }
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [topCustomers, setTopCustomers] = useState<Customer[]>([])
  const [popularServices, setPopularServices] = useState<(Service & { count: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentTransactions(mockRecentTransactions)
      setTopCustomers(mockTopCustomers)
      setPopularServices(mockPopularServices)
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Memuat dashboard...</p>
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
              <h1 className="text-xl font-semibold text-dark-100">Dashboard</h1>
              <p className="text-sm text-dark-400">{formatDate(new Date())}</p>
            </div>
            <Link href="/admin/settings">
              <Settings className="w-6 h-6 text-dark-400 hover:text-dark-100 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-lg font-semibold text-dark-100">Quick Actions</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/admin/scanner">
              <Button variant="primary" className="w-full h-12 flex items-center justify-center gap-2">
                <Scan className="w-4 h-4" />
                <span>Scan QR</span>
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button variant="secondary" className="w-full h-12 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span>New Customer</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-100">Recent Transactions</h2>
              <Link href="/admin/transactions">
                <span className="text-primary-400 text-sm hover:text-primary-300">View all →</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.transaction_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-dark-200 text-sm font-medium">Hair Service</p>
                  <p className="text-dark-400 text-xs">
                    {formatDateTime(transaction.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-dark-100 text-sm font-medium">
                    {formatCurrency(transaction.total_amount)}
                  </p>
                  <Badge variant="success" size="sm">
                    +{transaction.points_earned} pts
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-100">Top Customers</h2>
              <Link href="/admin/customers">
                <span className="text-primary-400 text-sm hover:text-primary-300">View all →</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCustomers.map((customer) => (
              <div key={customer.customer_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-dark-200 text-sm font-medium">{customer.name}</p>
                    <p className="text-dark-400 text-xs">{customer.membership_level} Member</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-dark-100 text-sm font-medium">{customer.total_points} pts</p>
                  <p className="text-dark-400 text-xs">{formatDate(customer.last_visit)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card variant="dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-100">Popular Services</h2>
              <Link href="/admin/services">
                <span className="text-primary-400 text-sm hover:text-primary-300">View all →</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularServices.map((service) => (
              <div key={service.service_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-dark-200 text-sm font-medium">{service.name}</p>
                  <p className="text-dark-400 text-xs">{service.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-dark-100 text-sm font-medium">{service.count} bookings</p>
                  <p className="text-dark-400 text-xs">{formatCurrency(service.price)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analytics Link */}
        <Card variant="glass" className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20">
          <CardContent>
            <Link href="/admin/reports" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <div>
                  <h3 className="text-dark-100 font-medium">View Analytics</h3>
                  <p className="text-dark-400 text-sm">Detailed reports and insights</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}