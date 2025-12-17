import React from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { getMembershipLevel, getPointsToNextLevel, formatCurrency } from '@/lib/utils'
import { MEMBERSHIP_LEVELS } from '@/lib/constants'
import type { Customer } from '@/lib/types'

interface PointsDisplayProps {
  customer: Customer
  className?: string
}

export function PointsDisplay({ customer, className }: PointsDisplayProps) {
  const membership = getMembershipLevel(customer.total_points)
  const pointsToNext = getPointsToNextLevel(customer.total_points)
  const currentLevelConfig = MEMBERSHIP_LEVELS[membership.level.toUpperCase() as keyof typeof MEMBERSHIP_LEVELS]

  return (
    <div className={className}>
      {/* Main Points Card */}
      <Card variant="glass" className="mb-4">
        <CardContent className="text-center">
          <div className="mb-2">
            <span className="text-dark-400 text-sm">Total Poin</span>
          </div>
          <div className={`text-4xl font-bold mb-2 ${membership.textColor}`}>
            {customer.total_points.toLocaleString('id-ID')}
          </div>
          <Badge
            variant="secondary"
            className={`${membership.bgColor} ${membership.color}`}
          >
            {membership.level}
          </Badge>
        </CardContent>
      </Card>

      {/* Membership Benefits */}
      <Card variant="dark" className="mb-4">
        <CardContent>
          <h3 className="text-dark-100 font-semibold mb-3">Keanggotaan {membership.level}</h3>
          <ul className="space-y-2">
            {currentLevelConfig.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-dark-300 text-sm">
                <span className="text-primary-400 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      {pointsToNext > 0 && (
        <Card variant="dark">
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-dark-300 text-sm">
                {membership.level === 'Bronze' ? 'Ke Silver' : 'Ke Gold'}
              </span>
              <span className="text-dark-100 text-sm font-medium">
                {pointsToNext.toLocaleString('id-ID')} poin lagi
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((customer.total_points - (membership.level === 'Silver' ? 500 : 0)) / pointsToNext) * 100}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Points Value */}
      <Card variant="glass" className="mt-4">
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-dark-400 text-sm">Nilai Poin</span>
            <span className="text-dark-100 font-medium">
              {formatCurrency(customer.total_points)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}