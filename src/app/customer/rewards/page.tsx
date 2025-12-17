'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { formatDate } from '@/lib/utils'
import type { Customer, Reward, Redemption } from '@/lib/types'

const mockCustomer: Customer = {
  id: 'cust-001',
  customer_id: 'cust-001',
  name: 'Sari Dewi',
  phone: '+628123456789',
  email: 'sari.dewi@email.com',
  total_points: 2450,
  membership_level: 'Silver',
  created_at: '2024-01-15T10:00:00Z',
  last_visit: '2024-01-20T14:30:00Z'
}

export default function CustomerRewardsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setCustomer(mockCustomer)
      setIsLoading(false)
    }, 500)
  }, [])

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
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white">
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

        {/* Available Rewards */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Available Rewards</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
              </div>
              <i className="material-icons text-3xl mb-3 text-[var(--success)] transition-all duration-300 hover:text-[var(--primary-light)] hover:scale-110">shower</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">Free Hair Wash & Blow Dry</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">Perfect for a quick refresh!</div>
              <div className="text-sm text-[var(--success)] font-semibold">1,000 points</div>
            </div>

            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <i className="material-icons text-3xl mb-3 text-[var(--success)]">content_cut</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">20% Discount Hair Cut</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">Valid for all hair cutting services</div>
              <div className="text-sm text-[var(--success)] font-semibold">1,500 points</div>
            </div>

            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <i className="material-icons text-3xl mb-3 text-[var(--success)]">colorize</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">Free Manicure</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">Complete nail care treatment</div>
              <div className="text-sm text-[var(--success)] font-semibold">2,000 points</div>
            </div>

            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <i className="material-icons text-3xl mb-3 text-[var(--success)]">spa</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">Premium Hair Treatment</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">Deep conditioning & hair mask</div>
              <div className="text-sm text-[var(--success)] font-semibold">3,000 points</div>
            </div>

            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <i className="material-icons text-3xl mb-3 text-[var(--success)]">palette</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">Hair Color Discount</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">30% off any color service</div>
              <div className="text-sm text-[var(--success)] font-semibold">2,500 points</div>
            </div>

            <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[var(--surface-lighter)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,170,0.2)] min-h-[140px] flex flex-col justify-center">
              <i className="material-icons text-3xl mb-3 text-[var(--success)]">card_giftcard</i>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-2 leading-tight">Surprise Gift</div>
              <div className="text-xs text-[var(--text-muted)] mb-2 leading-tight">Mystery reward package</div>
              <div className="text-sm text-[var(--success)] font-semibold">5,000 points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}