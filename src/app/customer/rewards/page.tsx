'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Customer, Reward, Redemption } from '@/lib/types'

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

const mockRewards: Reward[] = [
  {
    reward_id: 'rew-001',
    name: 'Gratis Haircut',
    description: 'Dapatkan potongan rambut gratis untuk semua jenis model',
    points_required: 500,
    image_url: '/rewards/haircut.jpg',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    reward_id: 'rew-002',
    name: 'Diskon 20% Hair Treatment',
    description: 'Diskon 20% untuk semua treatment rambut premium',
    points_required: 300,
    image_url: '/rewards/treatment.jpg',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    reward_id: 'rew-003',
    name: 'Gratis Manicure & Pedicure',
    description: 'Nikmati manicure dan pedicure gratis dengan produk premium',
    points_required: 800,
    image_url: '/rewards/manicure.jpg',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    reward_id: 'rew-004',
    name: 'Voucher Rp 50.000',
    description: 'Voucher potongan Rp 50.000 untuk semua layanan',
    points_required: 250,
    image_url: '/rewards/voucher.jpg',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    reward_id: 'rew-005',
    name: 'Package VIP Treatment',
    description: 'Paket lengkap treatment premium termasuk hair spa, facial, dan massage',
    points_required: 1500,
    image_url: '/rewards/vip.jpg',
    is_active: true,
    expiry_date: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockRedemptions: Redemption[] = [
  {
    redemption_id: 'red-001',
    customer_id: 'cust-001',
    reward_id: 'rew-002',
    points_used: 300,
    status: 'claimed',
    redemption_date: '2024-01-18T10:00:00Z',
    claimed_date: '2024-01-20T14:30:00Z',
    notes: 'Sudah digunakan untuk hair treatment'
  }
]

export default function CustomerRewardsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomer(mockCustomer)
      setRewards(mockRewards)
      setRedemptions(mockRedemptions)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleRedeemReward = (reward: Reward) => {
    if (!customer || customer.total_points < reward.points_required) return
    setSelectedReward(reward)
    setIsConfirmModalOpen(true)
  }

  const confirmRedemption = () => {
    if (!selectedReward || !customer) return

    // Simulate API call for redemption
    const newRedemption: Redemption = {
      redemption_id: `red-${Date.now()}`,
      customer_id: customer.customer_id,
      reward_id: selectedReward.reward_id,
      points_used: selectedReward.points_required,
      status: 'pending',
      redemption_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days expiry
    }

    setRedemptions([newRedemption, ...redemptions])
    setCustomer({
      ...customer,
      total_points: customer.total_points - selectedReward.points_required
    })

    setIsConfirmModalOpen(false)
    setSelectedReward(null)
  }

  const getStatusBadge = (status: Redemption['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, text: 'Menunggu' },
      claimed: { variant: 'success' as const, text: 'Di Klaim' },
      expired: { variant: 'error' as const, text: 'Kadaluarsa' }
    }
    return variants[status]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Memuat reward...</p>
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
            <h1 className="text-xl font-semibold text-dark-100">Rewards</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Points Balance */}
        <Card variant="glass">
          <CardContent className="text-center py-4">
            <p className="text-dark-400 text-sm mb-1">Poin Tersedia</p>
            <p className="text-3xl font-bold text-primary-400">
              {customer.total_points.toLocaleString('id-ID')}
            </p>
            <p className="text-dark-400 text-xs mt-1">
              {customer.membership_level} Member
            </p>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div>
          <h2 className="text-lg font-semibold text-dark-100 mb-3">Reward Tersedia</h2>
          <div className="space-y-3">
            {rewards.map((reward) => {
              const canRedeem = customer.total_points >= reward.points_required
              const isExpired = reward.expiry_date && new Date(reward.expiry_date) < new Date()

              return (
                <Card key={reward.reward_id} variant="dark" className={!canRedeem || isExpired ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-dark-100 font-semibold mb-1">{reward.name}</h3>
                        <p className="text-dark-400 text-sm mb-2">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {reward.points_required.toLocaleString('id-ID')} poin
                            </Badge>
                            {isExpired && <Badge variant="error" size="sm">Kadaluarsa</Badge>}
                          </div>
                          <Button
                            variant={canRedeem && !isExpired ? "primary" : "secondary"}
                            size="sm"
                            disabled={!canRedeem || isExpired}
                            onClick={() => handleRedeemReward(reward)}
                          >
                            {isExpired ? 'Kadaluarsa' : canRedeem ? 'Tukar' : 'Poin Kurang'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* My Redemptions */}
        {redemptions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-dark-100 mb-3">Riwayat Penukaran</h2>
            <div className="space-y-3">
              {redemptions.map((redemption) => {
                const reward = rewards.find(r => r.reward_id === redemption.reward_id)
                const status = getStatusBadge(redemption.status)

                return (
                  <Card key={redemption.redemption_id} variant="glass">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-dark-100 font-medium">{reward?.name}</h3>
                        <Badge variant={status.variant} size="sm">
                          {status.text}
                        </Badge>
                      </div>
                      <p className="text-dark-400 text-sm mb-2">
                        {redemption.points_used.toLocaleString('id-ID')} poin • {formatDate(redemption.redemption_date)}
                      </p>
                      {redemption.expiry_date && redemption.status === 'pending' && (
                        <p className="text-dark-400 text-xs">
                          Berlaku hingga: {formatDate(redemption.expiry_date)}
                        </p>
                      )}
                      {redemption.notes && (
                        <p className="text-dark-300 text-xs mt-2">{redemption.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card variant="glass" className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-dark-100 font-medium mb-1">Tips Reward</h3>
                <p className="text-dark-300 text-sm">
                  Reward yang sudah ditukar berlaku selama 30 hari. Segera gunakan reward Anda sebelum kadaluarsa!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Konfirmasi Penukaran"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-warning-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎁</span>
          </div>
          <h3 className="text-lg font-semibold text-dark-100 mb-2">
            Tukar {selectedReward?.name}?
          </h3>
          <p className="text-dark-400 mb-4">
            {selectedReward?.points_required.toLocaleString('id-ID')} poin akan digunakan dari saldo Anda
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsConfirmModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={confirmRedemption}
              className="flex-1"
            >
              Ya, Tukar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}