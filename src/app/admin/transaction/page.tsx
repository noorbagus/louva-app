'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Customer } from '@/lib/types'
import { TransactionForm } from '@/components/admin/TransactionForm'
import { supabase } from '@/lib/supabase-frontend'

// Fixed customer for demo
const CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export default function TransactionPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [])

  const fetchCustomer = async () => {
    try {
      // For demo, use the fixed customer
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', CUSTOMER_ID)
        .single()

      if (error) throw error

      // Transform to Customer type
      const transformedCustomer: Customer = {
        id: data.id,
        customer_id: data.id,
        name: data.full_name,
        phone: data.phone || '',
        email: data.email,
        full_name: data.full_name,
        total_points: data.total_points,
        membership_level: data.membership_level as any,
        total_visits: data.total_visits,
        total_spent: data.total_spent,
        qr_code: data.qr_code,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      setCustomer(transformedCustomer)
    } catch (error) {
      console.error('Error fetching customer:', error)
      setError('Failed to load customer data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="px-5 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/scanner">
            <button className="p-2 hover:bg-[var(--surface-light)] rounded-xl transition-colors">
              <span className="material-icons text-[var(--text-primary)]">arrow_back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Transaction</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <span className="material-icons text-red-500 text-4xl mb-3 block">error</span>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Customer</h2>
          <p className="text-red-600 mb-4">{error || 'Customer data not found'}</p>
          <Link href="/admin/scanner">
            <button className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
              Back to Scanner
            </button>
          </Link>
        </div>
      </div>
    )
  }

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

      {/* Transaction Form */}
      <TransactionForm customer={customer} />
    </div>
  )
}