'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RewardData {
  totalRedemptions: number
  pointsRedeemed: number
  activeVouchers: number
  mostPopularReward: string
  valueGiven: number
  redemptionHistory: Array<{
    id: string
    voucher_code: string
    customer_name: string
    reward_name: string
    points_used: number
    status: string
    redeemed_at: string
    used_at?: string
    expiry_date: string
  }>
  popularRewards: Array<{
    reward_name: string
    count: number
    points_used: number
    value: number
  }>
}

export function RewardAnalytics() {
  const [data, setData] = useState<RewardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'history' | 'popular' | 'validator'>('overview')
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherStatus, setVoucherStatus] = useState<any>(null)
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    fetchRewardData()
  }, [])

  const fetchRewardData = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockData: RewardData = {
        totalRedemptions: 245,
        pointsRedeemed: 122500,
        activeVouchers: 18,
        mostPopularReward: 'Free Haircut',
        valueGiven: 12250000,
        redemptionHistory: [
          {
            id: '1',
            voucher_code: 'LOUVA-ABC123',
            customer_name: 'Sari Dewi',
            reward_name: 'Free Haircut',
            points_used: 500,
            status: 'active',
            redeemed_at: '2025-12-18T10:00:00Z',
            expiry_date: '2025-01-17T23:59:59Z'
          },
          {
            id: '2',
            voucher_code: 'LOUVA-DEF456',
            customer_name: 'Maya Putri',
            reward_name: '20% Discount',
            points_used: 800,
            status: 'used',
            redeemed_at: '2025-12-17T15:30:00Z',
            used_at: '2025-12-20T14:00:00Z',
            expiry_date: '2026-01-16T23:59:59Z'
          }
        ],
        popularRewards: [
          { reward_name: 'Free Haircut', count: 89, points_used: 44500, value: 4450000 },
          { reward_name: '20% Discount', count: 67, points_used: 53600, value: 5360000 },
          { reward_name: 'Manicure & Pedicure', count: 45, points_used: 27000, value: 2700000 }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error fetching reward data:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateVoucher = async () => {
    if (!voucherCode.trim()) return

    setValidating(true)
    try {
      // Mock validation - replace with actual API
      const mockResponse = {
        valid: true,
        reward_name: 'Free Haircut',
        customer_name: 'Sari Dewi',
        points_used: 500,
        status: 'active',
        expiry_date: '2025-01-17T23:59:59Z',
        redeemed_at: '2025-12-18T10:00:00Z'
      }
      setVoucherStatus(mockResponse)
    } catch (error) {
      setVoucherStatus({ valid: false, error: 'Voucher not found' })
    } finally {
      setValidating(false)
    }
  }

  const markAsUsed = async () => {
    // Mock mark as used - replace with actual API
    setVoucherStatus({
      ...voucherStatus,
      status: 'used',
      used_at: new Date().toISOString()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'history', label: 'History' },
          { id: 'popular', label: 'Popular' },
          { id: 'validator', label: 'Validate' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSubTab === tab.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface-light)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && data && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-[var(--surface-light)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-[var(--success)]">redeem</span>
                <span className="text-sm text-[var(--text-muted)]">Total Redemptions</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{data.totalRedemptions}</div>
            </Card>

            <Card className="p-4 bg-[var(--surface-light)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-[var(--primary)]">stars</span>
                <span className="text-sm text-[var(--text-muted)]">Points Redeemed</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{data.pointsRedeemed.toLocaleString('id-ID')}</div>
            </Card>

            <Card className="p-4 bg-[var(--surface-light)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-purple-400">local_activity</span>
                <span className="text-sm text-[var(--text-muted)]">Active Vouchers</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{data.activeVouchers}</div>
            </Card>

            <Card className="p-4 bg-[var(--surface-light)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-yellow-400">trending_up</span>
                <span className="text-sm text-[var(--text-muted)]">Value Given</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(data.valueGiven)}
              </div>
            </Card>
          </div>

          {/* Most Popular */}
          <Card className="p-4 bg-[var(--surface-light)]">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Most Popular Reward</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-[var(--text-primary)]">{data.mostPopularReward}</p>
                <p className="text-sm text-[var(--text-muted)]">89 redemptions this month</p>
              </div>
              <span className="material-icons text-3xl text-[var(--success)]">emoji_events</span>
            </div>
          </Card>
        </>
      )}

      {/* History Tab */}
      {activeSubTab === 'history' && data && (
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Redemption History</h3>
          <div className="space-y-3">
            {data.redemptionHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--text-primary)]">{item.customer_name}</span>
                    <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{item.reward_name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Code: {item.voucher_code} • {item.points_used} pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-secondary)]">{formatDate(item.redeemed_at)}</p>
                  {item.used_at && (
                    <p className="text-xs text-green-400">Used: {formatDate(item.used_at)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Popular Rewards Tab */}
      {activeSubTab === 'popular' && data && (
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Popular Rewards</h3>
          <div className="space-y-3">
            {data.popularRewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{reward.reward_name}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {reward.count} redemptions • {reward.points_used.toLocaleString('id-ID')} pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--primary)]">{formatCurrency(reward.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Validator Tab */}
      {activeSubTab === 'validator' && (
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Voucher Validator</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Enter voucher code (e.g., LOUVA-ABC123)"
                className="flex-1 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
              <Button
                onClick={validateVoucher}
                disabled={validating || !voucherCode.trim()}
                variant="primary"
              >
                {validating ? 'Validating...' : 'Validate'}
              </Button>
            </div>

            {voucherStatus && (
              <div className={`p-4 rounded-xl ${
                voucherStatus.valid
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {voucherStatus.valid ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-icons text-green-400">check_circle</span>
                      <span className="font-semibold text-green-400">Valid Voucher</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--text-secondary)]">Reward:</span> {voucherStatus.reward_name}</p>
                      <p><span className="text-[var(--text-secondary)]">Customer:</span> {voucherStatus.customer_name}</p>
                      <p><span className="text-[var(--text-secondary)]">Points Used:</span> {voucherStatus.points_used} pts</p>
                      <p><span className="text-[var(--text-secondary)]">Status:</span>
                        <Badge variant={voucherStatus.status === 'active' ? 'success' : 'default'}>
                          {voucherStatus.status}
                        </Badge>
                      </p>
                      <p><span className="text-[var(--text-secondary)]">Valid Until:</span> {formatDate(voucherStatus.expiry_date)}</p>
                    </div>
                    {voucherStatus.status === 'active' && (
                      <div className="mt-3">
                        <Button onClick={markAsUsed} variant="primary" size="sm">
                          Mark as Used
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-red-400">error</span>
                    <span className="text-red-400">{voucherStatus.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}