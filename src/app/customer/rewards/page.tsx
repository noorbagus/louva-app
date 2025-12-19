'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { formatDate } from '@/lib/utils'
import type { Customer, Reward, Redemption } from '@/lib/types'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export default function CustomerRewardsPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState(false)

  useEffect(() => {
    fetchCustomerAndRewardsData()
  }, [])

  const fetchCustomerAndRewardsData = async () => {
    try {
      setIsLoading(true)
      // Fetch customer profile, points, and rewards
      const profileResponse = await fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
      const pointsResponse = await fetch(`/api/user/points?userId=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
      const rewardsResponse = await fetch('/api/rewards')

      if (profileResponse.ok && pointsResponse.ok) {
        const profileData = await profileResponse.json()
        const pointsData = await pointsResponse.json()

        setCustomer({
          id: FIXED_CUSTOMER_ID,
          customer_id: FIXED_CUSTOMER_ID,
          name: profileData.full_name || 'Sari Dewi',
          phone: profileData.phone || '+628123456789',
          email: profileData.email || 'sari.dewi@example.com',
          total_points: profileData.total_points || pointsData.current_points || 0,
          membership_level: profileData.membership_level || pointsData.membership_level || 'Bronze',
          created_at: profileData.created_at || new Date().toISOString(),
          last_visit: profileData.updated_at || new Date().toISOString()
        })
      }

      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json()
        setRewards(rewardsData.filter((r: Reward) => r.is_active))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set fallback data
      setCustomer({
        id: FIXED_CUSTOMER_ID,
        customer_id: FIXED_CUSTOMER_ID,
        name: 'Sari Dewi',
        phone: '+628123456789',
        email: 'sari.dewi@example.com',
        total_points: 0,
        membership_level: 'Bronze',
        created_at: new Date().toISOString(),
        last_visit: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mission activation handler - auto redirect to QR card with delay
  const handleActivateMission = () => {
    // Store activation state in localStorage to trigger auto QR open
    localStorage.setItem('auto_open_qr', 'true')

    // Add 300ms delay for smoother transition
    setTimeout(() => {
      router.push('/customer/qr')
    }, 300)
  }

  // Handle reward redemption
  const handleRedeemReward = (reward: Reward) => {
    if (!customer) return
    setSelectedReward(reward)
    setShowRedeemModal(true)
  }

  // Process redemption
  const processRedemption = async () => {
    if (!selectedReward || !customer) return

    setIsRedeeming(true)

    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: customer.id,
          reward_id: selectedReward.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Success notification with voucher code
        const voucherCode = data.voucher_code || 'N/A'
        const message = `🎉 Redemption successful!\n\n📱 Voucher Code: ${voucherCode}\n🎁 Reward: ${selectedReward.name}\n💰 Points Used: ${selectedReward.points_required}\n💳 New Balance: ${data.new_points_balance} points\n\n⚠️ Please show this voucher code at the salon to use your reward. Valid for 30 days.`

        // Show detailed success modal
        if (confirm(message + '\n\nClick OK to view your voucher codes.')) {
          // Redirect to redemption history
          router.push('/customer/rewards/history')
        }

        // Update customer points
        setCustomer(prev => prev ? {
          ...prev,
          total_points: data.new_points_balance,
          membership_level: data.membership_level
        } : null)

        // Close modal
        setShowRedeemModal(false)
        setSelectedReward(null)

        // Refresh data
        fetchCustomerAndRewardsData()
      } else {
        alert(`Redemption failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Redemption error:', error)
      alert('Failed to process redemption. Please try again.')
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header - Always render immediately with sticky class */}
      <div className="sticky-header text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">
        <div className="max-w-md mx-auto px-5 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="text-white">
              <i className="material-icons text-xl">arrow_back</i>
            </button>
            <h1 className="text-xl font-semibold">Rewards</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        {/* Points Balance */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl backdrop-blur-lg">
          <div className="text-center py-4">
            <p className="text-[var(--text-muted)] text-sm mb-1">Poin Tersedia</p>
            <p className="text-3xl font-bold text-[var(--primary)]">
              {customer?.total_points?.toLocaleString('id-ID') || '0'}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-1">
              {customer?.membership_level || 'Bronze'} Member
            </p>
          </div>
        </div>

        {/* Mission Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-light)]/10 border border-[var(--primary)]/20 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                <i className="material-icons text-2xl text-[var(--primary)]">flag</i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Daily Mission</h3>
                <p className="text-sm text-[var(--text-secondary)]">Kunjungi salon hari ini dan dapatkan bonus poin</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-[var(--success)]/20 text-[var(--success)] text-xs px-2 py-1 rounded-full font-medium">
                    +50 Bonus Points
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">• Valid today</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleActivateMission}
              size="lg"
              className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] shadow-lg hover:shadow-xl"
            >
              <i className="material-icons text-lg mr-2">play_arrow</i>
              Activate Mission
            </Button>
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Available Rewards</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {rewards.map((reward) => {
              const canAfford = customer && customer.total_points >= reward.points_required
              const getIcon = (name: string) => {
                if (name.toLowerCase().includes('voucher') || name.toLowerCase().includes('discount')) return 'local_offer'
                if (name.toLowerCase().includes('hair') || name.toLowerCase().includes('cut')) return 'content_cut'
                if (name.toLowerCase().includes('manicure') || name.toLowerCase().includes('pedicure')) return 'spa'
                if (name.toLowerCase().includes('treatment')) return 'shower'
                if (name.toLowerCase().includes('package') || name.toLowerCase().includes('vip')) return 'card_giftcard'
                return 'redeem'
              }

              return (
                <div
                  key={reward.id}
                  onClick={() => canAfford && handleRedeemReward(reward)}
                  className={`bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[140px] flex flex-col justify-center ${
                    canAfford
                      ? 'hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)]'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300 ${canAfford ? '' : 'hidden'}`}>
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>
                  <i className={`material-icons text-3xl mb-3 transition-all duration-300 ${
                    canAfford
                      ? 'text-[var(--success)] hover:text-[var(--primary-light)] hover:scale-110'
                      : 'text-[var(--text-muted)]'
                  }`}>
                    {getIcon(reward.name)}
                  </i>
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">{reward.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">{reward.description}</div>
                  <div className={`text-sm font-semibold ${canAfford ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {reward.points_required.toLocaleString('id-ID')} points
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Redemption Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <Modal
          isOpen={showRedeemModal}
          onClose={() => {
            setShowRedeemModal(false)
            setSelectedReward(null)
          }}
        >
          <div className="text-center">
            {/* Icon with better contrast */}
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary-dark)]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/30">
              <i className="material-icons text-4xl text-white shadow-lg">redeem</i>
            </div>

            {/* Title with better visibility */}
            <h3 className="text-2xl font-bold text-white mb-2">Confirm Redemption</h3>
            <p className="text-[var(--text-secondary)] mb-6">Are you sure you want to redeem this reward?</p>

            {/* Reward Details Card */}
            <div className="bg-[var(--surface-light)]/80 backdrop-blur-sm border border-[var(--border)] rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 rounded-xl flex items-center justify-center">
                  <i className="material-icons text-2xl text-[var(--accent)]">card_giftcard</i>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold text-white">{selectedReward.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedReward.description}</p>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <p className="text-xl font-bold text-[var(--accent)]">
                  {selectedReward.points_required.toLocaleString('id-ID')} points
                </p>
              </div>
            </div>

            {/* Points Balance Warning */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <i className="material-icons text-yellow-400 text-xl">warning</i>
                <div className="flex-1 text-left">
                  <p className="text-yellow-300 font-medium">Points After Redemption</p>
                  <p className="text-white text-lg font-semibold">
                    {(customer!.total_points - selectedReward.points_required).toLocaleString('id-ID')} points
                  </p>
                  <p className="text-yellow-200/80 text-sm">
                    Your current balance: {customer!.total_points.toLocaleString('id-ID')} points
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRedeemModal(false)
                  setSelectedReward(null)
                }}
                disabled={isRedeeming}
                className="flex-1 py-3 px-6 bg-[var(--surface-lighter)]/80 backdrop-blur-sm text-white font-medium rounded-xl border border-[var(--border)] hover:bg-[var(--surface-lighter)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={processRedemption}
                disabled={isRedeeming}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[var(--success)] to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-[var(--success)]/90 hover:to-emerald-600/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <>
                    <i className="material-icons animate-spin">refresh</i>
                    <span>Redeeming...</span>
                  </>
                ) : (
                  <>
                    <i className="material-icons">check_circle</i>
                    <span>Redeem Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}