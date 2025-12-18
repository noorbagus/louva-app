'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Customer } from '@/lib/types'

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
          // Always calculate membership level from current points
          const calculatedMembershipLevel = newPoints >= 1000 ? 'Gold' : newPoints >= 500 ? 'Silver' : 'Bronze'

          const mappedCustomer: Customer = {
            id: FIXED_CUSTOMER_ID,
            customer_id: FIXED_CUSTOMER_ID,
            name: profileData.full_name || 'Sari Dewi',
            phone: profileData.phone || '081234567890',
            email: profileData.email || 'sari.dewi@example.com',
            total_points: newPoints,
            membership_level: calculatedMembershipLevel, // Use calculated level instead of DB value
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
            const calculatedMembershipLevel = newPoints >= 1000 ? 'Gold' : newPoints >= 500 ? 'Silver' : 'Bronze'

            setCustomer(prev => prev ? {
              ...prev,
              total_points: newPoints,
              membership_level: calculatedMembershipLevel,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white relative overflow-hidden sticky top-0 z-10">
        <div className="absolute top-0 right-[-50px] w-[120px] h-[120px] bg-white/10 rounded-full transform translate-x-5 -translate-y-5"></div>
        
        <div className="max-w-md mx-auto px-5 py-6 relative z-10">
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
              <span className="text-xs opacity-90 font-medium">points</span>
            </div>
            <Link href="/customer/services">
              <button className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg">
                Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
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
        {/* Membership Progress */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <i className="material-icons text-2xl text-[var(--primary)]">stars</i>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">Membership Progress</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {customer.membership_level === 'Bronze' && `${Math.max(0, 500 - customer.total_points)} poin lagi menuju Silver`}
                {customer.membership_level === 'Silver' && `${Math.max(0, 1000 - customer.total_points)} poin lagi menuju Gold`}
                {customer.membership_level === 'Gold' && 'Selamat! Anda sudah mencapai level tertinggi'}
              </p>
            </div>
          </div>
          
          {customer.membership_level !== 'Gold' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Current: {customer.membership_level}</span>
                <span className="text-[var(--text-primary)] font-medium">
                  {customer.membership_level === 'Bronze' ? 'Next: Silver' : 'Next: Gold'}
                </span>
              </div>
              <div className="w-full bg-[var(--surface)] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] h-2 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      customer.membership_level === 'Bronze'
                        ? Math.min((customer.total_points / 500) * 100, 100)
                        : Math.min(((customer.total_points - 500) / 500) * 100, 100),
                      100
                    )}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>{customer.membership_level === 'Bronze' ? '0' : '500'}</span>
                <span>{customer.membership_level === 'Bronze' ? '500' : '1000'}</span>
              </div>
            </div>
          )}
        </div>
        {/* Badges Section */}
        <div className="mt-8">
          <Link href="/customer/rewards">
            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 cursor-pointer hover:bg-[var(--surface-lighter)] transition-all">
              <div className="flex items-center gap-3">
                <i className="material-icons text-2xl text-[var(--primary)]">emoji_events</i>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">Badges & Mission</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Collect badges and unlock more rewards</p>
                </div>
              </div>
            </div>
          </Link>
        </div>


      </div>
    </div>
  )
}