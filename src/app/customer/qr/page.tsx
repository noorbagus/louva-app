'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { QRModal } from '@/components/customer/QRModal'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { formatDateTime } from '@/lib/utils'
import type { Customer } from '@/lib/types'

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

export default function CustomerQRPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [lastQRTime, setLastQRTime] = useState<Date | null>(null)

  useEffect(() => {
    setCustomer(mockCustomer)
  }, [])

  const handleOpenQR = () => {
    setIsQRModalOpen(true)
    setLastQRTime(new Date())
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
            <h1 className="text-lg font-medium">My card</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-5">
        {/* Customer Card */}
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-sm text-[var(--text-secondary)] mb-4">Silver Member</div>
          
          <div className="bg-[var(--surface)] p-5 rounded-xl text-center mb-5">
            <i className="material-icons text-2xl mb-3 text-[var(--primary)]">card_giftcard</i>
            <p className="text-[var(--text-secondary)] text-sm m-0">
              Your rewards will be displayed here. Keep visiting to earn rewards and LOUVA points.
            </p>
          </div>
          
          <div className="text-center text-[var(--text-muted)] text-sm mb-5">
            swipe to refresh
            <div className="mt-1">⌄</div>
          </div>
        </div>

        {/* QR Button */}
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-[calc(375px-40px)] max-w-[335px]">
          <button 
            onClick={handleOpenQR}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white w-full py-4 rounded-xl font-semibold text-base shadow-[0_4px_15px_rgba(74,139,194,0.3)] hover:shadow-[0_8px_25px_rgba(74,139,194,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Show QR
          </button>
        </div>
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