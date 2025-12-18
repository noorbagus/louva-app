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

  // Mission activation handler - auto redirect to QR card
  const handleActivateMission = () => {
    // Store activation state in localStorage to trigger auto QR open
    localStorage.setItem('auto_open_qr', 'true')
    
    // Navigate to QR card page
    router.push('/customer/qr')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Memuat reward...</p>
        </div>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white sticky top-0 z-10">
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
              {customer.total_points.toLocaleString('id-ID')}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-1">
              {customer.membership_level} Member
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
    </div>
  )
}