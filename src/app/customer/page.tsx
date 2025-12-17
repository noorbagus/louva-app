'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { PointsDisplay } from '@/components/customer/PointsDisplay'
import { ServiceGrid } from '@/components/customer/ServiceGrid'
import { Badge } from '@/components/shared/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DEFAULT_SERVICES, SERVICE_CATEGORIES } from '@/lib/constants'
import { customerAPI } from '@/lib/api'
import type { Customer, Transaction } from '@/lib/types'

export default function CustomerHomePage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true)
        const customerData = await customerAPI.getProfile()
        const mappedCustomer: Customer = {
          ...customerData,
          name: customerData.full_name,
          customer_id: customerData.id,
          last_visit: customerData.updated_at
        }
        setCustomer(mappedCustomer)

        const transactionsData = await customerAPI.getTransactions()
        setRecentTransactions(transactionsData.slice(0, 3))
      } catch (err) {
        // Fallback data
        const fallbackCustomer: Customer = {
          id: '550e8400-e29b-41d4-a716-446655440001',
          customer_id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Sari Dewi',
          phone: '081234567890',
          email: 'sari.dewi@example.com',
          total_points: 2450,
          membership_level: 'Silver',
          total_visits: 15,
          total_spent: 3200000,
          qr_code: 'LOUVA_SD001_2024',
          created_at: '2025-12-17T14:04:08.068454Z',
          updated_at: '2025-12-17T14:04:08.068454Z',
          last_visit: '2025-12-17T14:04:08.068454Z'
        }
        setCustomer(fallbackCustomer)
      } finally {
        setLoading(false)
      }
    }

    loadCustomerData()
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
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-[-50px] w-[120px] h-[120px] bg-white/10 rounded-full transform translate-x-5 -translate-y-5"></div>
        
        <div className="max-w-md mx-auto px-5 py-6 relative z-10">
          {/* User Info */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 border-2 border-white/30 rounded-xl flex items-center justify-center text-xl backdrop-blur-lg">
                <i className="material-icons">person</i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{customer.name}</h3>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-lg">
                  {customer.membership_level} Member
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-base backdrop-blur-lg">
              L
            </div>
          </div>

          {/* Points Section */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold block mb-1">{customer.total_points.toLocaleString('id-ID')}</span>
              <span className="text-xs opacity-90 font-medium">points</span>
            </div>
            <Link href="/customer/services">
              <button className="bg-[var(--secondary)] text-white px-4 py-2 rounded-full font-semibold text-xs">
                Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-5 space-y-5">
        {/* Promo Banner */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Weekend Special</h3>
            <p className="text-sm text-[var(--text-secondary)]">Double points untuk semua hair treatments setiap weekend</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-[100px] h-[100px] bg-[var(--primary)]/10 rounded-full"></div>
        </div>

        {/* Badges Section */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <i className="material-icons text-2xl text-[var(--primary)]">emoji_events</i>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">Badges & Achievements</h3>
              <p className="text-sm text-[var(--text-secondary)]">Collect badges and unlock more rewards</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5 text-center">
          <h3 className="text-base font-semibold mb-4 text-[var(--text-primary)]">Ready for your appointment?</h3>
          <Link href="/customer/qr">
            <button className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white w-full py-4 rounded-xl font-semibold text-base shadow-[0_4px_15px_rgba(74,139,194,0.3)] hover:shadow-[0_8px_25px_rgba(74,139,194,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              Show QR Code
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}