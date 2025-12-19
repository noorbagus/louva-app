'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { getMembershipLevel } from '@/lib/utils'
import type { Customer } from '@/lib/types'
import Link from 'next/link'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export default function CustomerAccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pointsData, setPointsData] = useState<any>(null)

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true)
      const profileResponse = await fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}`)
      const pointsResponse = await fetch(`/api/user/points?userId=${FIXED_CUSTOMER_ID}`)

      if (profileResponse.ok && pointsResponse.ok) {
        const profileData = await profileResponse.json()
        const pointsData = await pointsResponse.json()

        setPointsData(pointsData)

        const availablePoints = profileData.total_points || pointsData.current_points || 0
        const lifetimePoints = profileData.lifetime_points || availablePoints
        
        // Membership level based on lifetime points
        const calculatedMembershipLevel = lifetimePoints >= 1000 ? 'Gold' : lifetimePoints >= 500 ? 'Silver' : 'Bronze'

        setCustomer({
          id: FIXED_CUSTOMER_ID,
          customer_id: FIXED_CUSTOMER_ID,
          name: profileData.full_name || 'Sari Dewi',
          phone: profileData.phone || '+628123456789',
          email: profileData.email || 'sari.dewi@example.com',
          total_points: availablePoints,
          lifetime_points: lifetimePoints,
          membership_level: calculatedMembershipLevel,
          total_visits: profileData.total_visits || 0,
          total_spent: profileData.total_spent || 0,
          created_at: profileData.created_at || new Date().toISOString(),
          last_visit: profileData.updated_at || new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
      setCustomer({
        id: FIXED_CUSTOMER_ID,
        customer_id: FIXED_CUSTOMER_ID,
        name: 'Sari Dewi',
        phone: '+628123456789',
        email: 'sari.dewi@example.com',
        total_points: 0,
        lifetime_points: 0,
        membership_level: 'Bronze',
        total_visits: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        last_visit: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const lifetimePoints = customer?.lifetime_points || customer?.total_points || 0
  const membership = customer ? getMembershipLevel(lifetimePoints) : null

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header - Always render immediately with sticky class */}
      <div className="sticky-header text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">
        <div className="max-w-md mx-auto px-5 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="text-white">
              <i className="material-icons text-xl">arrow_back</i>
            </button>
            <h1 className="text-xl font-semibold">Account</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        {isLoading || !customer ? (
          // Loading skeleton for account page content
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 bg-white/20"></div>
                <div className="h-6 bg-white/20 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-48 mx-auto"></div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="h-6 bg-white/20 rounded w-8 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-16 mx-auto"></div>
                </div>
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="h-6 bg-white/20 rounded w-10 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-20 mx-auto"></div>
                </div>
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="h-6 bg-white/20 rounded w-12 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-12 mx-auto"></div>
                </div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center p-4 border-b border-[var(--border)] last:border-b-0">
                    <div className="w-6 h-6 bg-white/20 rounded mr-4"></div>
                    <div className="flex-1 h-4 bg-white/20 rounded w-32"></div>
                    <div className="h-4 bg-white/20 rounded w-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">{customer.name}</h3>
              <p className="text-[var(--text-secondary)] text-sm">View and edit profile</p>
              
              {/* Membership Status with lifetime info */}
              {membership && (
                <div className="mt-3">
                  <Badge className={`${membership.bgColor} ${membership.color} border-0`}>
                    {membership.level} Member
                  </Badge>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Based on {lifetimePoints.toLocaleString('id-ID')} lifetime points
                  </p>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 pl-1">Your Statistics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-[var(--primary)]">{customer.total_visits || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Total Visits</div>
                </div>
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-[var(--primary)]">
                    {((customer.total_spent || 0) / 1000).toLocaleString('id-ID')} K
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Total Spent (Rp)</div>
                </div>
                <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-[var(--primary)]">{customer.total_points?.toLocaleString('id-ID') || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Available Points</div>
                </div>
              </div>

              {/* Lifetime Points Display */}
              <div className="mt-3 bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-[var(--accent)]">{lifetimePoints.toLocaleString('id-ID')}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Lifetime Points Earned</div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {membership?.level === 'Gold' ? '1.5x' : membership?.level === 'Silver' ? '1.2x' : '1x'} points multiplier
                </p>
              </div>
            </div>

            {/* Menu List */}
            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl overflow-hidden">
              <Link href="/customer/rewards/history" className="flex items-center p-4 border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                <i className="material-icons text-[var(--primary)] mr-4">history</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Redemption History</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </Link>

              <Link href="/customer/rewards" className="flex items-center p-4 border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                <i className="material-icons text-[var(--primary)] mr-4">redeem</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Browse Rewards</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </Link>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">flag</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">My Missions</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">history</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Transaction History</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">card_giftcard</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Gift Cards</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">people</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Refer Friends</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">notifications</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Notifications</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4 border-b border-[var(--border)]">
                <i className="material-icons text-[var(--primary)] mr-4">help</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">Help & Support</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>

              <div className="flex items-center p-4">
                <i className="material-icons text-[var(--primary)] mr-4">info</i>
                <span className="flex-1 text-[var(--text-primary)] font-medium">About Louva</span>
                <i className="material-icons text-[var(--text-muted)]">chevron_right</i>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}