'use client'

import { useState, useEffect } from 'react'
import { PaymentMethodConfig } from '@/lib/types'
import { supabase } from '@/lib/supabase-frontend'

interface PaymentSelectorProps {
  selectedMethod: string | null
  onMethodSelect: (methodId: string) => void
}

export function PaymentSelector({ selectedMethod, onMethodSelect }: PaymentSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })

      if (error) throw error

      const transformedMethods = data.map(pm => ({
        id: pm.id,
        name: pm.name,
        type: pm.type as any,
        bank: pm.bank || undefined,
        icon: getPaymentIcon(pm.type, pm.bank),
        is_active: pm.is_active,
        created_at: pm.created_at
      }))

      setPaymentMethods(transformedMethods)
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (type: string, bank?: string | null) => {
    const icons: Record<string, string> = {
      cash: 'payments',
      qris: 'qr_code_2',
      debit: 'credit_card',
      credit: 'credit_card',
      transfer: 'account_balance',
      ewallet: 'phone_android'
    }
    return icons[type] || 'payments'
  }

  if (loading) {
    return <div className="animate-pulse">Loading payment methods...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Payment Method</h2>

      <div className="relative">
        <select
          value={selectedMethod || ''}
          onChange={(e) => onMethodSelect(e.target.value)}
          className={`w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all appearance-none cursor-pointer ${
            selectedMethod ? 'pl-12' : ''
          }`}
        >
          <option value="" disabled>
            Select payment method
          </option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>

        {/* Dropdown arrow icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="material-icons text-[var(--text-muted)]">expand_more</span>
        </div>

        {/* Payment icon dropdown */}
        {selectedMethod && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {(() => {
              const selectedPayment = paymentMethods.find(m => m.id === selectedMethod)
              if (selectedPayment) {
                return (
                  <span className="material-icons text-[var(--accent)] text-lg">
                    {selectedPayment.icon}
                  </span>
                )
              }
              return null
            })()}
          </div>
        )}
      </div>

      {/* Selected payment details */}
      {selectedMethod && (
        <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-3">
          {(() => {
            const selectedPayment = paymentMethods.find(m => m.id === selectedMethod)
            if (selectedPayment) {
              return (
                <div className="flex items-center gap-3">
                  <span className="material-icons text-[var(--accent)] text-xl">
                    {selectedPayment.icon}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{selectedPayment.name}</p>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{selectedPayment.type}</p>
                  </div>
                </div>
              )
            }
            return null
          })()}
        </div>
      )}
    </div>
  )
}