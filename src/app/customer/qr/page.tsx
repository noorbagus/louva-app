'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { QRModal } from '@/components/customer/QRModal'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { formatDateTime } from '@/lib/utils'
import type { Customer } from '@/lib/types'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export default function CustomerQRPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [lastQRTime, setLastQRTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCustomerData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true)
      }

      // Fetch customer profile and points
      const profileResponse = await fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)
      const pointsResponse = await fetch(`/api/user/points?userId=${FIXED_CUSTOMER_ID}&_t=${Date.now()}`)

      if (profileResponse.ok && pointsResponse.ok) {
        const profileData = await profileResponse.json()
        const pointsData = await pointsResponse.json()

        const newPoints = profileData.total_points || pointsData.current_points || 0
        // Calculate membership level based on current points
        const calculatedMembershipLevel = newPoints >= 1000 ? 'Gold' : newPoints >= 500 ? 'Silver' : 'Bronze'

        setCustomer({
          id: FIXED_CUSTOMER_ID,
          customer_id: FIXED_CUSTOMER_ID,
          name: profileData.full_name || 'Sari Dewi',
          phone: profileData.phone || '+628123456789',
          email: profileData.email || 'sari.dewi@example.com',
          total_points: newPoints,
          membership_level: calculatedMembershipLevel, // Use calculated level
          created_at: profileData.created_at || new Date().toISOString(),
          last_visit: profileData.updated_at || new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchCustomerData(true)

    // Smart refresh only when visible
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCustomerData(false)
      }
    }, 30000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCustomerData(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(refreshInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchCustomerData])

  const handleOpenQR = () => {
    setIsQRModalOpen(true)
    setLastQRTime(new Date())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            <h1 className="text-xl font-semibold">My card</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        {/* Premium Loyalty Card */}
        <div className="relative">
          {/* Card with blue glassmorphism design */}
          <div className="relative rounded-2xl p-4 overflow-hidden transition-all duration-500 shadow-2xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(74, 139, 194, 0.9) 0%, rgba(90, 155, 212, 0.85) 50%, rgba(147, 190, 225, 0.8) 100%)',
                 backdropFilter: 'blur(20px)',
                 WebkitBackdropFilter: 'blur(20px)',
                 boxShadow: '0 20px 40px rgba(74, 139, 194, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
               }}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"></div>

            {/* Card pattern with custom colors */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 w-24 h-24 border-4 border-white/30 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-8 h-8 border-2 border-white/25 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Glassmorphism decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                 style={{
                   background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                 }}>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-15"
                 style={{
                   background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
                 }}>
            </div>

            {/* Card content */}
            <div className="relative z-10">
              {/* Header with name and email */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/25 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/40 shadow-lg">
                    <img
                      src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">
                      {customer.name}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/95 text-xs font-medium mb-1 tracking-wide">{customer.membership_level.toUpperCase()}</div>
                  <p className="text-sm text-white/90">
                    {customer.email}
                  </p>
                </div>
              </div>

              {/* Points Section with glassmorphism effect */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4 border border-white/20"
                   style={{
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)'
                   }}>
                <div className="text-xs font-medium mb-1 text-white/90 tracking-wider">
                  AVAILABLE POINTS
                </div>
                <div className="text-4xl font-bold text-white">
                  {customer.total_points?.toLocaleString('id-ID') || '0'}
                </div>
                <div className="text-xs mt-1 text-white/80 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-white rounded-full"></span>
                  ✨ {customer.membership_level} Status
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/80 font-medium">
                  LOUVA BEAUTY STUDIO
                </div>
                <div className="text-xs text-white/80 font-medium">
                  VALID THRU 12/25
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* QR Button */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-5">
          <Button
            onClick={handleOpenQR}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl"
          >
            <span className="material-icons text-lg">qr_code_2</span>
            Show QR Code
          </Button>

          <p className="text-center text-xs text-[var(--text-muted)] mt-3">
            {customer.membership_level === 'Gold'
              ? '✨ VIP access ready • Show to our stylist'
              : customer.membership_level === 'Silver'
              ? '⭐ Premium member • Earn 1.2x points'
              : '🎯 Start your beauty journey • Earn points'}
          </p>
        </div>

        {/* Card Features */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            {customer.membership_level} Member Perks
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="material-icons text-lg">stars</span>
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">Points Multiplier</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {customer.membership_level === 'Gold' ? '1.5x points on all services' :
                   customer.membership_level === 'Silver' ? '1.2x points on all services' :
                   'Standard points earning'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="material-icons text-lg">redeem</span>
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">Exclusive Rewards</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {customer.membership_level === 'Gold' ? 'Premium treatments & VIP access' :
                   customer.membership_level === 'Silver' ? 'Advanced beauty treatments' :
                   'Great selection of rewards'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="material-icons text-lg">local_offer</span>
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">Special Offers</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {customer.membership_level === 'Gold' ? 'Member-only discounts & priority booking' :
                   customer.membership_level === 'Silver' ? 'Seasonal promotions & early access' :
                   'Regular promotions & updates'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next level progress */}
        {customer.membership_level !== 'Gold' && (
          <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
              {customer.membership_level === 'Bronze' ? 'Next Level: Silver (500 pts)' : 'Next Level: Gold (1000 pts)'}
            </h3>
            <div className="w-full bg-[var(--surface)] rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full transition-all duration-700 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]"
                style={{
                  width: `${Math.min(
                    customer.membership_level === 'Bronze'
                      ? Math.min(((customer.total_points || 0) / 500) * 100, 100)
                      : Math.min(((customer.total_points || 0) / 1000) * 100, 100),
                    100
                  )}%`
                }}
              />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {customer.membership_level === 'Bronze'
                ? `${Math.max(0, 500 - (customer.total_points || 0))} points to Silver`
                : `${Math.max(0, 1000 - (customer.total_points || 0))} points to Gold`}
            </p>
          </div>
        )}

       
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        customer={customer}
      />
    </div>
  )
}