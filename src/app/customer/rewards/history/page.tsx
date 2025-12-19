'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { formatDateTime } from '@/lib/utils'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

interface RedemptionHistory {
  id: string
  voucher_code: string
  reward_name: string
  reward_description: string
  points_used: number
  status: string
  redeemed_at: string
  expiry_date?: string
  used_at?: string
}

export default function RedemptionHistoryPage() {
  const router = useRouter()
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRedemptionHistory()
  }, [])

  const fetchRedemptionHistory = async () => {
    try {
      const response = await fetch('/api/rewards/history')

      if (response.ok) {
        const data = await response.json()
        setRedemptions(data)
      }
    } catch (error) {
      console.error('Error fetching redemption history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'expired':
        return <Badge variant="danger">Expired</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="sticky-header text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">
        <div className="max-w-md mx-auto px-5 py-6">
          <div className="flex items-center gap-4">
            <Link href="/customer/account">
              <button className="text-white">
                <i className="material-icons text-xl">arrow_back</i>
              </button>
            </Link>
            <h1 className="text-xl font-semibold">Redemption History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent mx-auto mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading redemption history...</p>
          </div>
        ) : redemptions.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="material-icons text-3xl text-[var(--primary)]">history</i>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Redemptions Yet</h3>
            <p className="text-[var(--text-muted)] mb-6">
              You haven't redeemed any rewards yet. Start earning points and redeem amazing rewards!
            </p>
            <Link href="/customer/rewards">
              <button className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-xl font-medium">
                Browse Rewards
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {redemptions.map((redemption) => (
              <Card key={redemption.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {/* Voucher Code */}
                    <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-light)]/10 border border-[var(--primary)]/30 rounded-xl p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] mb-1">Voucher Code</p>
                          <p className="text-lg font-bold text-[var(--primary)] font-mono">
                            {redemption.voucher_code}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(redemption.voucher_code)
                            alert('Voucher code copied!')
                          }}
                          className="p-2 bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 rounded-lg transition-colors"
                          disabled={redemption.status === 'used' || redemption.status === 'expired'}
                        >
                          <i className="material-icons text-sm text-[var(--primary)]">
                            {redemption.status === 'used' || redemption.status === 'expired' ? 'block' : 'content_copy'}
                          </i>
                        </button>
                      </div>
                    </div>

                    {/* Reward Details */}
                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                      {redemption.reward_name}
                    </h4>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                      {redemption.reward_description}
                    </p>

                    {/* Status Badge */}
                    <div className="mb-3">
                      {getStatusBadge(redemption.status)}
                    </div>

                    {/* Dates & Points */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[var(--text-secondary)]">Redeemed</p>
                        <p className="text-[var(--text-primary)] font-medium">
                          {formatDateTime(redemption.redeemed_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-secondary)]">Points Used</p>
                        <p className="text-[var(--primary)] font-semibold">
                          {redemption.points_used.toLocaleString('id-ID')} pts
                        </p>
                      </div>
                      {redemption.used_at && (
                        <div>
                          <p className="text-[var(--text-secondary)]">Used On</p>
                          <p className="text-green-400 font-medium">
                            {formatDateTime(redemption.used_at)}
                          </p>
                        </div>
                      )}
                      {redemption.expiry_date && (
                        <div>
                          <p className="text-[var(--text-secondary)]">Valid Until</p>
                          <p className={`${isExpired(redemption.expiry_date) ? 'text-red-400' : 'text-yellow-400'} font-medium`}>
                            {formatDateTime(redemption.expiry_date)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Account Button */}
        <div className="mt-8">
          <Link href="/customer/account">
            <button className="w-full py-3 border border-[var(--border)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--surface-light)] transition-colors">
              Back to Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}