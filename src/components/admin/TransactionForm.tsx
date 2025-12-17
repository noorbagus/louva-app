'use client'

import { useState } from 'react'
import { Customer, SelectedService, PaymentMethodConfig } from '@/lib/types'
import { CustomerInfo } from './CustomerInfo'
import { ServiceSelector } from './ServiceSelector'
import { PaymentSelector } from './PaymentSelector'
import { Card } from '@/components/shared/Card'

interface TransactionFormProps {
  customer: Customer
}

export function TransactionForm({ customer }: TransactionFormProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleServiceToggle = (service: SelectedService) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id)
      if (exists) {
        return prev.filter(s => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
  }

  const calculateTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0)
  }

  const calculatePoints = () => {
    return selectedServices.reduce((sum, service) => sum + service.points, 0)
  }

  const handleProcessTransaction = async () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service')
      return
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method')
      return
    }

    setProcessing(true)

    try {
      // Get admin ID from fixed account
      const adminId = '550e8400-e29b-41d4-a716-446655440002'

      // Create transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: customer.id,
          service_ids: selectedServices.map(s => s.id),
          payment_method_id: selectedPaymentMethod,
          service_prices: selectedServices.map(s => s.price),
          notes: notes || ''
        })
      })

      const data = await response.json()

      if (data.transaction) {
        // Show success message and redirect
        alert('Transaction completed successfully! Customer earned ' + data.customer.total_points.toLocaleString() + ' points.')
        window.location.href = '/admin'
      } else {
        alert('Failed to process transaction: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Transaction error:', error)
      alert('Failed to process transaction')
    } finally {
      setProcessing(false)
    }
  }

  const totalAmount = calculateTotal()
  const totalPoints = calculatePoints()

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <CustomerInfo customer={customer} />

      {/* Service Selection */}
      <ServiceSelector
        selectedServices={selectedServices}
        onServiceToggle={handleServiceToggle}
      />

      {/* Payment Method */}
      <PaymentSelector
        selectedMethod={selectedPaymentMethod}
        onMethodSelect={setSelectedPaymentMethod}
      />

      {/* Payment Notes */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Payment Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this transaction..."
          className="w-full p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none min-h-[100px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>

      {/* Summary */}
      {totalAmount > 0 && (
        <Card className="bg-[var(--surface-lighter)] border-[var(--border)] p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal:</span>
              <span className="font-medium">Rp {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[var(--success)]">
              <span>Points to earn:</span>
              <span className="font-semibold">+{totalPoints} points</span>
            </div>
            <div className="h-px bg-[var(--border)] my-3"></div>
            <div className="flex justify-between text-lg font-bold text-[var(--text-primary)]">
              <span>Total:</span>
              <span>Rp {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Process Button */}
      <button
        onClick={handleProcessTransaction}
        disabled={processing || selectedServices.length === 0 || !selectedPaymentMethod}
        className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all ${
          processing || selectedServices.length === 0 || !selectedPaymentMethod
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/25 border border-green-400'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-icons animate-spin">refresh</span>
            Processing...
          </span>
        ) : (
          'Process Transaction'
        )}
      </button>
    </div>
  )
}