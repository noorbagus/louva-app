'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { formatDate, formatDateTime, formatCurrency, getMembershipLevel } from '@/lib/utils'
import { MEMBERSHIP_LEVELS } from '@/lib/constants'
import type { Customer, Transaction } from '@/lib/types'
import { Camera, Edit, LogOut, Settings, ChevronRight } from 'lucide-react'

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
  },
  {
    transaction_id: 'txn-003',
    customer_id: 'cust-001',
    service_id: 'svc-005',
    payment_method: 'ovo',
    total_amount: 80000,
    points_earned: 80,
    created_at: '2024-01-15T16:45:00Z',
    updated_at: '2024-01-15T16:45:00Z'
  }
]

export default function CustomerAccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [activeTab, setActiveTab] = useState<'info' | 'transactions'>('info')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomer(mockCustomer)
      setTransactions(mockTransactions)
      setEditForm({
        name: mockCustomer.name,
        phone: mockCustomer.phone,
        email: mockCustomer.email
      })
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSaveProfile = () => {
    if (!customer) return

    // Simulate API call to update profile
    setCustomer({
      ...customer,
      ...editForm
    })
    setIsEditModalOpen(false)
  }

  const membership = customer ? getMembershipLevel(customer.total_points) : null
  const membershipConfig = membership
    ? MEMBERSHIP_LEVELS[membership.level.toUpperCase() as keyof typeof MEMBERSHIP_LEVELS]
    : null

  const totalSpent = transactions.reduce((sum, t) => sum + t.total_amount, 0)
  const totalPointsEarned = transactions.reduce((sum, t) => sum + t.points_earned, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="bg-dark-800/50 backdrop-blur-lg border-b border-dark-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/customer" className="text-dark-300 hover:text-dark-100">
              ←
            </a>
            <h1 className="text-xl font-semibold text-dark-100">Akun Saya</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card variant="glass">
          <CardContent className="text-center py-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-3xl">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-dark-100 mb-2">{customer.name}</h2>
            <Badge variant="secondary" className="mb-2">
              {membershipConfig?.name} Member
            </Badge>
            <p className="text-dark-400 text-sm">{customer.email}</p>
            <p className="text-dark-400 text-sm">{customer.phone}</p>
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="dark" className="text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-primary-400">{customer.total_points}</p>
              <p className="text-xs text-dark-400">Total Poin</p>
            </CardContent>
          </Card>
          <Card variant="dark" className="text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-dark-100">{transactions.length}</p>
              <p className="text-xs text-dark-400">Transaksi</p>
            </CardContent>
          </Card>
          <Card variant="dark" className="text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-success-400">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-dark-400">Total Belanja</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex bg-dark-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-primary-500 text-white'
                : 'text-dark-300 hover:text-dark-100'
            }`}
          >
            Informasi
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-primary-500 text-white'
                : 'text-dark-300 hover:text-dark-100'
            }`}
          >
            Transaksi
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Membership Info */}
            <Card variant="dark">
              <CardHeader>
                <h3 className="text-lg font-semibold text-dark-100">Keanggotaan</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Status Member</span>
                  <Badge variant="secondary">{membershipConfig?.name}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Bergabung Sejak</span>
                  <span className="text-dark-100">{formatDate(customer.created_at)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Kunjungan Terakhir</span>
                  <span className="text-dark-100">{formatDate(customer.last_visit || customer.created_at)}</span>
                </div>
                {membership && membership.level !== 'Gold' && (
                  <div className="mt-4 p-3 bg-primary-500/10 rounded-lg">
                    <p className="text-primary-400 text-sm font-medium mb-1">
                      {membership.level === 'Bronze' ? '500' : '1500'} poin lagi menuju {membership.level === 'Bronze' ? 'Silver' : 'Gold'}
                    </p>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
                        style={{
                          width: `${((customer.total_points - (membership.level === 'Silver' ? 500 : 0)) / (membership.level === 'Bronze' ? 500 : 1500)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card variant="dark">
              <CardHeader>
                <h3 className="text-lg font-semibold text-dark-100">Pengaturan</h3>
              </CardHeader>
              <CardContent className="space-y-1">
                <button className="w-full flex items-center justify-between p-3 hover:bg-dark-700/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-dark-400" />
                    <span className="text-dark-300">Preferensi Akun</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-dark-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-dark-700/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-dark-400" />
                    <span className="text-dark-300">Keluar</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-dark-500" />
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Card key={transaction.transaction_id} variant="dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-dark-100 font-medium">Haircut & Treatment</p>
                        <p className="text-dark-400 text-sm">
                          {formatDateTime(transaction.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-dark-100 font-medium">
                          {formatCurrency(transaction.total_amount)}
                        </p>
                        <Badge variant="success" size="sm">
                          +{transaction.points_earned} poin
                        </Badge>
                      </div>
                    </div>
                    <p className="text-dark-400 text-xs">
                      Metode: {transaction.payment_method}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card variant="dark">
                <CardContent className="text-center py-8">
                  <p className="text-dark-400">Belum ada transaksi</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-dark-500 text-xs">
            Louva Salon v1.0.0
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">
              No. Telepon
            </label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="Masukkan nomor telepon"
            />
          </div>
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">
              Email
            </label>
            <Input
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Masukkan email"
              type="email"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              className="flex-1"
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}