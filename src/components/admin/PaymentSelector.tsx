'use client'

import { Card, CardContent } from '@/components/shared/Card'
import type { PaymentMethod } from '@/lib/types'

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null
  onSelectionChange: (method: PaymentMethod) => void
  className?: string
}

const paymentMethods = [
  { id: 'credit_card', name: 'Debit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'ewallet', name: 'E-Wallet', icon: '📱' },
  { id: 'transfer', name: 'Transfer', icon: '🏦' }
]

export function PaymentSelector({
  selectedMethod,
  onSelectionChange,
  className
}: PaymentSelectorProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id

          return (
            <Card
              key={method.id}
              variant="dark"
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#93BEE1]/10 border-[#93BEE1]'
                  : 'hover:bg-[#243442]'
              }`}
              onClick={() => onSelectionChange(method.id as PaymentMethod)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{method.icon}</div>
                <p className="text-white text-sm font-medium">{method.name}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}