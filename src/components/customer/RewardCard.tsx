'use client'

import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'

interface RewardCardProps {
  reward: {
    id: string
    title: string
    description: string
    points_required: number
    category: 'service' | 'product' | 'discount' | 'voucher'
    image_url?: string
    is_available: boolean
    is_redeemed?: boolean
    expiry_date?: string
    value?: number
    value_type?: 'percentage' | 'fixed'
    popular?: boolean
    new?: boolean
  }
  userPoints?: number
  onClick?: () => void
}

export function RewardCard({ reward, userPoints = 0, onClick }: RewardCardProps) {
  const canAfford = userPoints >= reward.points_required
  const isRedeemed = reward.is_redeemed
  const isExpired = reward.expiry_date && new Date() > new Date(reward.expiry_date)

  const getCategoryIcon = () => {
    switch (reward.category) {
      case 'service': return 'spa'
      case 'product': return 'shopping_bag'
      case 'discount': return 'local_offer'
      case 'voucher': return 'confirmation_number'
      default: return 'card_giftcard'
    }
  }

  const getStatusColor = () => {
    if (isRedeemed) return 'bg-gray-500/20 border-gray-500/30 opacity-75'
    if (isExpired) return 'bg-red-500/20 border-red-500/30 opacity-75'
    if (canAfford) return 'bg-[var(--surface-light)] border-[var(--border)]'
    return 'bg-[var(--surface-light)] border-[var(--border)]'
  }

  const getStatusText = () => {
    if (isRedeemed) return 'Redeemed'
    if (isExpired) return 'Expired'
    if (!canAfford) return `${reward.points_required - userPoints} pts needed`
    return 'Available'
  }

  const getValueDisplay = () => {
    if (!reward.value) return ''
    if (reward.value_type === 'percentage') return `${reward.value}% OFF`
    return `Rp ${reward.value.toLocaleString()} OFF`
  }

  const neededPoints = Math.max(0, reward.points_required - userPoints)
  const progressPercent = userPoints > 0 ? Math.min((userPoints / reward.points_required) * 100, 100) : 0

  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow bg-[var(--surface-light)] border-[var(--border)] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center">
            <span className="material-icons text-[var(--accent)] text-xl">
              {getCategoryIcon()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[var(--text-primary)]">{reward.title}</h3>
              {reward.popular && (
                <span className="inline-flex items-center px-1 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
                  <span className="material-icons text-xs mr-0.5" style={{ fontSize: '10px' }}>local_fire_department</span>
                  <span style={{ fontSize: '10px' }}>Popular</span>
                </span>
              )}
              {reward.new && (
                <span className="inline-flex items-center px-1 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                  <span className="material-icons text-xs mr-0.5" style={{ fontSize: '10px' }}>new_releases</span>
                  <span style={{ fontSize: '10px' }}>New</span>
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
              {reward.description}
            </p>
            {reward.value && (
              <div className="text-sm font-medium text-[var(--success)] mt-1">
                {getValueDisplay()}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-0.5 mb-1">
            <span className="material-icons text-[var(--accent)] text-xs">stars</span>
            <span className="font-bold text-[var(--text-primary)] text-sm">
              {reward.points_required.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {isRedeemed ? 'Redeemed' :
             isExpired ? 'Expired' :
             !canAfford ? `Need ${neededPoints} more` :
             canAfford ? 'Available' : ''}
          </div>
          {/* Progress indicator */}
          {!isRedeemed && !isExpired && userPoints > 0 && userPoints < reward.points_required && (
            <div className="w-16 bg-[var(--surface)] rounded-full h-1 mt-2">
              <div
                className="h-1 rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}