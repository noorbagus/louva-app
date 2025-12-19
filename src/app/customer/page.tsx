'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Customer } from '@/lib/types'
import { MissionCard } from '@/components/customer/MissionCard'
import { ChallengeCard } from '@/components/customer/ChallengeCard'
import { RewardCard } from '@/components/customer/RewardCard'
import { Card } from '@/components/shared/Card'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

// Banner data
const banners = [
  {
    title: 'Weekend Special',
    subtitle: 'Double points untuk semua hair treatments setiap weekend',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Hair Color Promo',
    subtitle: 'Gratis konsultasi warna untuk semua layanan hair color',
    image: 'https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Nail Art Special', 
    subtitle: 'Diskon 30% untuk semua nail art design premium',
    image: 'https://images.pexels.com/photos/887352/pexels-photo-887352.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
]

export default function CustomerHomePage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [activeMissions, setActiveMissions] = useState<any[]>([])
  const [availableMissions, setAvailableMissions] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [featuredRewards, setFeaturedRewards] = useState<any[]>([])

  // Load missions and challenges data
  const loadMissionsData = async () => {
    try {
      // Load missions
      const missionsResponse = await fetch(`/api/missions?user_id=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
      if (missionsResponse.ok) {
        const missionsData = await missionsResponse.json()
        const missions = missionsData.missions || []
        setActiveMissions(missions.filter((m: any) => m.user_status === 'active') || [])
        setAvailableMissions(missions.filter((m: any) => m.user_status === 'available') || [])
      }

      // Load challenges (mock data for now)
      setChallenges([
        {
          id: '1',
          title: 'Weekend Warrior',
          description: 'Complete 3 services this weekend',
          reward_points: 150,
          progress: 2,
          target: 3,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          difficulty: 'medium'
        },
        {
          id: '2',
          title: 'Service Explorer',
          description: 'Try 3 different service categories',
          reward_points: 200,
          progress: 1,
          target: 3,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          difficulty: 'easy'
        }
      ])

      // Load featured rewards (mock data for now)
      setFeaturedRewards([
        {
          id: '1',
          title: 'Free Hair Treatment',
          description: 'Premium hair treatment session',
          points_required: 500,
          category: 'service',
          is_available: true,
          popular: true
        },
        {
          id: '2',
          title: '20% Off Next Service',
          description: 'Get 20% discount on any service',
          points_required: 300,
          category: 'discount',
          value: 20,
          value_type: 'percentage',
          is_available: true,
          new: true
        }
      ])
    } catch (error) {
      console.error('Error loading missions data:', error)
    }
  }

  // Initial load effect
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true)

        // Fetch customer profile and points
        const profileResponse = await fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
        const pointsResponse = await fetch(`/api/user/points?userId=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()

          // Get points data if available
          let pointsData: any = {}
          if (pointsResponse.ok) {
            pointsData = await pointsResponse.json()
          }

          const newPoints = profileData.total_points || (pointsData as any)?.current_points || 0
          const newMembershipLevel = profileData.membership_level || (pointsData as any)?.membership_level ||
            (newPoints >= 1000 ? 'Gold' : newPoints >= 500 ? 'Silver' : 'Bronze')

          const mappedCustomer: Customer = {
            id: FIXED_CUSTOMER_ID,
            customer_id: FIXED_CUSTOMER_ID,
            name: profileData.full_name || 'Sari Dewi',
            phone: profileData.phone || '081234567890',
            email: profileData.email || 'sari.dewi@example.com',
            total_points: newPoints,
            lifetime_points: profileData.lifetime_points || newPoints,
            membership_level: newMembershipLevel,
            total_visits: profileData.total_visits || (pointsData as any)?.total_visits || 0,
            total_spent: profileData.total_spent || (pointsData as any)?.total_spent || 0,
            qr_code: profileData.qr_code || `LOUVA_${FIXED_CUSTOMER_ID}_${new Date().toISOString()}`,
            created_at: profileData.created_at || new Date().toISOString(),
            updated_at: profileData.updated_at || new Date().toISOString(),
            last_visit: profileData.updated_at || new Date().toISOString()
          }

          setCustomer(mappedCustomer)
        } else {
          // Set fallback data
          const fallbackCustomer: Customer = {
            id: FIXED_CUSTOMER_ID,
            customer_id: FIXED_CUSTOMER_ID,
            name: 'Sari Dewi',
            phone: '081234567890',
            email: 'sari.dewi@example.com',
            total_points: 0,
            lifetime_points: 0,
            membership_level: 'Bronze',
            total_visits: 0,
            total_spent: 0,
            qr_code: `LOUVA_${FIXED_CUSTOMER_ID}_${new Date().toISOString()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_visit: new Date().toISOString()
          }
          setCustomer(fallbackCustomer)
        }
      } catch (err) {
        console.error('Error loading customer data:', err)
        // Set fallback data
        const fallbackCustomer: Customer = {
          id: FIXED_CUSTOMER_ID,
          customer_id: FIXED_CUSTOMER_ID,
          name: 'Sari Dewi',
          phone: '081234567890',
          email: 'sari.dewi@example.com',
          total_points: 0,
          lifetime_points: 0,
          membership_level: 'Bronze',
          total_visits: 0,
          total_spent: 0,
          qr_code: `LOUVA_${FIXED_CUSTOMER_ID}_${new Date().toISOString()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_visit: new Date().toISOString()
        }
        setCustomer(fallbackCustomer)
      } finally {
        setLoading(false)
      }
    }

    loadCustomerData()

    // Load missions and rewards data
    loadMissionsData()

    // Set up background refresh - much less frequent
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        // Silent background refresh without loading state
        fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
          .then(res => {
            if (res.ok) {
              return res.json()
            }
            throw new Error('Failed to fetch')
          })
          .then(profileData => {
            const newPoints = profileData.total_points || 0
            const newMembershipLevel = profileData.membership_level ||
              (newPoints >= 1000 ? 'Gold' : newPoints >= 500 ? 'Silver' : 'Bronze')

            setCustomer(prev => prev ? {
              ...prev,
              total_points: newPoints,
              membership_level: newMembershipLevel,
              total_visits: profileData.total_visits || prev.total_visits,
              total_spent: profileData.total_spent || prev.total_spent,
              updated_at: profileData.updated_at || prev.updated_at,
              last_visit: profileData.updated_at || prev.last_visit
            } : prev)
          })
          .catch(err => console.error('Background refresh error:', err))
      }
    }, 60000) // Every minute only

    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header - Always render immediately with sticky class */}
      <div className="sticky-header text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">
        <div className="absolute top-0 right-[-50px] w-[120px] h-[120px] bg-white/10 rounded-full transform translate-x-5 -translate-y-5"></div>

        <div className="max-w-md mx-auto px-5 py-6 relative z-10">
          {loading || !customer ? (
            // Skeleton state during loading
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border-2 border-white/30"></div>
                  <div>
                    <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-20"></div>
                  </div>
                </div>
                <div className="w-20 h-12 bg-white/20 rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-8 bg-white/20 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-12"></div>
                </div>
                <div className="h-10 bg-white/20 rounded-full w-24"></div>
              </div>
              <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/20">
                <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
                <div className="h-2 bg-white/20 rounded-full w-full"></div>
              </div>
            </div>
          ) : (
            // Full header content when data is loaded
            <>
              {/* User Info */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 backdrop-blur-lg">
                    <img
                      src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{customer.name}</h3>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-lg">
                      {customer.membership_level} Member
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/images/louva-putih.png"
                    alt="Louva Logo"
                    width={82}
                    height={54}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Points Section */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold block mb-1">{customer.total_points.toLocaleString('id-ID')}</span>
                  <span className="text-s opacity-90 font-medium"><b>Points</b></span>
                </div>
                <Link href="/customer/services">
                  <button className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg">
                    Services
                  </button>
                </Link>
              </div>

              {/* Membership Progress Bar */}
              <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{customer.membership_level} Member</span>
                  <span className="text-xs opacity-90">
                    {(() => {
                      const lifetimePoints = customer.lifetime_points || customer.total_points
                      if (customer.membership_level === 'Bronze') {
                        return `${Math.max(0, 500 - lifetimePoints)} pts to Silver`
                      } else if (customer.membership_level === 'Silver') {
                        return `${Math.max(0, 1000 - lifetimePoints)} pts to Gold`
                      } else {
                        return 'Gold Status'
                      }
                    })()}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-white/80 to-white/60 transition-all duration-700"
                    style={{
                      width: `${
                        (() => {
                          const lifetimePoints = customer.lifetime_points || customer.total_points
                          if (customer.membership_level === 'Bronze') {
                            return Math.min((lifetimePoints / 500) * 100, 100)
                          } else if (customer.membership_level === 'Silver') {
                            return Math.min(((lifetimePoints - 500) / 500) * 100, 100)
                          } else {
                            return 100
                          }
                        })()
                      }%`
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        {loading ? (
          // Loading state for content only
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl h-40"></div>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl h-24"></div>
              <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl h-24"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Rotating Promo Banners */}
            <div className="relative">
          <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl overflow-hidden relative">
            <div 
              className="h-40 bg-cover bg-center relative transition-all duration-700"
              style={{
                backgroundImage: `url(${banners[currentBanner].image})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
              
              {/* Content */}
              <div className="relative z-10 p-5 h-full flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-lg transition-all duration-500">
                  {banners[currentBanner].title}
                </h3>
                <p className="text-sm text-white/90 drop-shadow-md transition-all duration-500">
                  {banners[currentBanner].subtitle}
                </p>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBanner 
                      ? 'bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Missions Section */}
        {activeMissions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className="material-icons text-[var(--accent)]">flag</span>
                Active Missions
              </h2>
              <Link href="/customer/missions" className="text-sm text-[var(--accent)] hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {activeMissions.slice(0, 2).map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClick={() => window.location.href = '/customer/missions'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Missions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <span className="material-icons text-purple-400">emoji_events</span>
              Missions
            </h2>
            <Link href="/customer/missions" className="text-sm text-purple-400 hover:underline">
              View all →
            </Link>
          </div>

          <Card
            className="relative p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border-purple-500/30"
            onClick={() => window.location.href = '/customer/missions'}
          >
            {/* Notification Badge - Edge Kanan Atas Card */}
            <div className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <span className="material-icons text-red-500 text-lg animate-pulse drop-shadow-lg">notifications</span>
                {availableMissions.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {availableMissions.length}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center">
                  <span className="material-icons text-purple-400 text-xl">emoji_events</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--text-primary)]">Weekend Warriors</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mb-2">
                    Complete 3 services & win 150 points before Monday!
                  </p>
                  <div className="text-sm font-medium text-purple-400">
                    🏆 {activeMissions.length} active, {availableMissions.length} available
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 mb-1">
                  <span className="material-icons text-purple-400 text-xs">stars</span>
                  <span className="font-bold text-[var(--text-primary)] text-sm">
                    350
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Points
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Rewards Section */}
        {featuredRewards.length > 0 && customer && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className="material-icons text-yellow-400">card_giftcard</span>
                Featured Rewards
              </h2>
              <Link href="/customer/rewards" className="text-sm text-[var(--accent)] hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {featuredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={customer.total_points}
                  onClick={() => window.location.href = '/customer/rewards'}
                />
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}