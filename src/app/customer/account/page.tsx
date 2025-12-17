'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import type { Customer } from '@/lib/types'

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
      // Fetch customer profile and points
      const profileResponse = await fetch(`/api/user/profile?id=${FIXED_CUSTOMER_ID}`)
      const pointsResponse = await fetch(`/api/user/points?userId=${FIXED_CUSTOMER_ID}`)

      if (profileResponse.ok && pointsResponse.ok) {
        const profileData = await profileResponse.json()
        const pointsData = await pointsResponse.json()

        setPointsData(pointsData)

        setCustomer({
          id: FIXED_CUSTOMER_ID,
          customer_id: FIXED_CUSTOMER_ID,
          name: profileData.full_name || 'Sari Dewi',
          phone: profileData.phone || '+628123456789',
          email: profileData.email || 'sari.dewi@example.com',
          total_points: profileData.total_points || pointsData.current_points || 0,
          membership_level: profileData.membership_level || pointsData.membership_level || 'Bronze',
          total_visits: profileData.total_visits || 0,
          total_spent: profileData.total_spent || 0,
          created_at: profileData.created_at || new Date().toISOString(),
          last_visit: profileData.updated_at || new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
      // Set fallback data
      setCustomer({
        id: FIXED_CUSTOMER_ID,
        customer_id: FIXED_CUSTOMER_ID,
        name: 'Sari Dewi',
        phone: '+628123456789',
        email: 'sari.dewi@example.com',
        total_points: 0,
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

  if (isLoading) {
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
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white sticky top-0 z-10">
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
              <div className="text-lg font-bold text-[var(--primary)]">{(customer.total_spent || 0).toLocaleString('id-ID')}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Total Spent (Rp)</div>
            </div>
            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-[var(--primary)]">{customer.total_points?.toLocaleString('id-ID') || 0}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Points</div>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">receipt_long</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Transaction History</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">redeem</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">My Redemptions</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">emoji_events</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Achievements</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">location_on</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Salon Locations</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">schedule</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Points Expiry</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">notifications</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Notifications</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">help</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Help & Support</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
          
          <div className="flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-[rgba(74,139,194,0.1)]">
            <div className="w-6 h-6 mr-4 text-[var(--primary)] flex items-center justify-center">
              <i className="material-icons text-lg">settings</i>
            </div>
            <div className="flex-1 text-[var(--text-primary)] text-sm font-medium">Settings</div>
            <div className="text-[var(--text-muted)]">›</div>
          </div>
        </div>
      </div>
    </div>
  )
}