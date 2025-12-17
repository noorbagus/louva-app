import React from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Edit, Trash2, User } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Customer } from '@/lib/types'

interface CustomerInfoProps {
  customer: Customer
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  className?: string
}

export function CustomerInfo({
  customer,
  onEdit,
  onDelete,
  showActions = true,
  className
}: CustomerInfoProps) {
  const lifetimeValue = customer.total_points * 1000 // Assuming 1 point = Rp 1000

  return (
    <Card variant="dark" className={`bg-[#1a2832] ${className}`}>
      <CardContent className="p-5">
        {/* Customer Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#93BEE1] flex items-center justify-center">
            {customer.profile_url ? (
              <img
                src={customer.profile_url}
                alt={customer.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{customer.name}</h3>
            <Badge
              variant="warning"
              size="sm"
              className="bg-[#ffa726]/20 text-[#ffa726] border-[#ffa726]/30"
            >
              {customer.membership_level} Member
            </Badge>
          </div>
          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={onEdit}
                  className="text-[#93BEE1] border-[#93BEE1] hover:bg-[#93BEE1]/10"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={onDelete}
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Customer Stats - Enhanced Layout */}
        <div className="grid grid-cols-3 gap-3 bg-[#0a1620] rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-[#93BEE1]">{customer.total_points.toLocaleString('id-ID')}</p>
            <p className="text-xs text-[#6b7785] mt-1">Current Points</p>
          </div>
          <div className="text-center border-l border-r border-[#2d3748] px-2">
            <p className="text-xl font-bold text-white">15</p>
            <p className="text-xs text-[#6b7785] mt-1">Total Visits</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{formatCurrency(lifetimeValue)}</p>
            <p className="text-xs text-[#6b7785] mt-1">Lifetime Value</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-[#2d3748]/50">
            <span className="text-[#6b7785] font-medium">Phone</span>
            <span className="text-white">{customer.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#2d3748]/50">
            <span className="text-[#6b7785] font-medium">Email</span>
            <span className="text-white">{customer.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#2d3748]/50">
            <span className="text-[#6b7785] font-medium">Member Since</span>
            <span className="text-white">{formatDate(customer.created_at)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#6b7785] font-medium">Last Visit</span>
            <span className="text-white">{formatDate(customer.last_visit || customer.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}