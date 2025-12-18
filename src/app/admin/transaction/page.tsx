'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Customer } from '@/lib/types'
import { TransactionForm } from '@/components/admin/TransactionForm'

// Static customer data for testing
const STATIC_CUSTOMER: Customer = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  customer_id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Sari Dewi',
  phone: '081234567890',
  email: 'sari.dewi@example.com',
  full_name: 'Sari Dewi',
  total_points: 632,
  membership_level: 'Silver' as any,
  total_visits: 26,
  total_spent: 4920000,
  qr_code: 'LOUVA_SD001_2024',
  created_at: '2025-12-17T14:04:08.068454',
  updated_at: '2025-12-18T10:18:55.683'
}

export default function TransactionPage() {
  const [customer] = useState<Customer>(STATIC_CUSTOMER)
  const [activeMissions, setActiveMissions] = useState<any[]>([])

  useEffect(() => {
    // Check for missions from QR scan
    const missionData = sessionStorage.getItem('scanned_missions')
    if (missionData) {
      const missions = JSON.parse(missionData)
      setActiveMissions(missions)
      sessionStorage.removeItem('scanned_missions')
    }
  }, [])

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/scanner">
          <button className="p-2 hover:bg-[var(--surface-light)] rounded-xl transition-colors">
            <span className="material-icons text-[var(--text-primary)]">arrow_back</span>
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Transaction</h1>
      </div>

      {/* Mission Info */}
      {activeMissions.length > 0 && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
          <h3 className="text-green-400 font-semibold mb-2">
            🎯 Active Missions Detected
          </h3>
          {activeMissions.map((mission, index) => (
            <div key={index} className="text-sm text-green-300">
              "{mission.title}" - {mission.service_name} (+{mission.bonus_points} bonus pts)
            </div>
          ))}
          <p className="text-xs text-green-200 mt-2">
            Relevant services will be auto-selected below
          </p>
        </div>
      )}

      {/* Transaction Form */}
      <TransactionForm customer={customer} />
    </div>
  )
}