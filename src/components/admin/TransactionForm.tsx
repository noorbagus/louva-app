'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { CustomerInfo } from './CustomerInfo'
import { ServiceSelector } from './ServiceSelector'
import { PaymentSelector } from './PaymentSelector'
import { formatCurrency } from '@/lib/utils'
import type { Customer, Service, PaymentMethod } from '@/lib/types'

interface TransactionFormProps {
  customer: Customer
  services: Service[]
  onTransactionComplete?: (transactionData: any) => void
  className?: string
}

export function TransactionForm({
  customer,
  services,
  onTransactionComplete,
  className
}: TransactionFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [paymentNotes, setPaymentNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const calculateTotal = () => {
    return services
      .filter(s => selectedServices.includes(s.service_id))
      .reduce((sum, service) => sum + service.price, 0)
  }

  const calculatePoints = () => {
    return services
      .filter(s => selectedServices.includes(s.service_id))
      .reduce((sum, service) => sum + Math.floor(service.price / 1000 * service.point_multiplier), 0)
  }

  const handleProcessTransaction = async () => {
    if (selectedServices.length === 0 || !selectedPayment) {
      alert('Please select services and payment method')
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const transactionData = {
      customer_id: customer.customer_id,
      service_ids: selectedServices,
      payment_method: selectedPayment,
      total_amount: calculateTotal(),
      points_earned: calculatePoints(),
      notes: paymentNotes
    }

    setIsProcessing(false)
    setShowSuccessModal(true)
    onTransactionComplete?.(transactionData)
  }

  const handleNewTransaction = () => {
    setSelectedServices([])
    setSelectedPayment(null)
    setPaymentNotes('')
    setShowSuccessModal(false)
  }

  const totalAmount = calculateTotal()
  const pointsEarned = calculatePoints()

  return (
    <div className={className}>
      <CustomerInfo customer={customer} showActions={false} className="mb-6" />

      <ServiceSelector
        services={services}
        selectedServices={selectedServices}
        onSelectionChange={setSelectedServices}
        className="mb-6"
      />

      <PaymentSelector
        selectedMethod={selectedPayment}
        onSelectionChange={setSelectedPayment}
        className="mb-6"
      />

      {selectedPayment && (
        <Card variant="dark" className="mb-6">
          <CardContent className="p-4">
            <label className="block text-white text-sm font-medium mb-2">
              Payment Notes (Optional)
            </label>
            <Input
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Add any notes about this transaction..."
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </CardContent>
        </Card>
      )}

      {selectedServices.length > 0 && selectedPayment && (
        <Card variant="glass" className="bg-gradient-to-r from-[#93BEE1]/10 to-[#7ba6d3]/10">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#b0b8c1]">Subtotal</span>
                <span className="text-white">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#b0b8c1]">Points to Earn</span>
                <span className="text-[#00d4aa]">+{pointsEarned} pts</span>
              </div>
              <div className="border-t border-[#2d3748] pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold text-lg">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleProcessTransaction}
              disabled={isProcessing}
              className="w-full mt-4 bg-gradient-to-r from-[#93BEE1] to-[#7ba6d3] hover:from-[#7ba6d3] hover:to-[#93BEE1]"
            >
              {isProcessing ? 'Processing...' : 'Process Transaction'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Transaction Successful"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[#00d4aa]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Transaction Completed!
          </h3>
          <p className="text-[#b0b8c1] text-sm mb-4">
            {pointsEarned} points have been added to {customer.name}'s account
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleNewTransaction}
              className="flex-1"
            >
              New Transaction
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowSuccessModal(false)}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}