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
  const lifetimePoints = customer.lifetime_points || customer.total_points
  const membership = getMembershipLevel(lifetimePoints)
  const pointsToNext = getPointsToNextLevel(lifetimePoints)
  const currentLevelConfig = MEMBERSHIP_LEVELS[membership.level.toUpperCase() as keyof typeof MEMBERSHIP_LEVELS]

  return (
    <div className={className}>
      {/* Main Points Card */}
      <Card variant="glass" className="mb-4 bg-gradient-to-br from-primary-500/10 to-primary-600/15 border-primary-500/20">
        <CardContent className="text-center py-6">
          <div className="mb-2">
            <span className="text-dark-400 text-sm font-medium">Available Points</span>
          </div>
          <div className={`text-4xl font-bold mb-3 ${membership.textColor}`}>
            {customer.total_points.toLocaleString('id-ID')}
          </div>
          
          {/* Show lifetime points if different from available */}
          {lifetimePoints !== customer.total_points && (
            <div className="mb-3">
              <span className="text-dark-500 text-sm">Lifetime: {lifetimePoints.toLocaleString('id-ID')} pts</span>
            </div>
          )}
          
          <Badge
            variant="secondary"
            className={`${membership.bgColor} ${membership.color} border-0`}
          >
            {membership.level} Member
          </Badge>
        </CardContent>
      </Card>

      {/* Membership Benefits */}
      <Card variant="dark" className="mb-4 bg-[#1a2832]">
        <CardContent className="p-4">
          <h3 className="text-dark-100 font-semibold mb-3 text-base">Keanggotaan {membership.level}</h3>
          <ul className="space-y-2">
            {currentLevelConfig.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-dark-300 text-sm">
                <span className="text-primary-400 mr-2 text-xs">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          
          {/* Membership note */}
          <div className="mt-3 pt-3 border-t border-dark-600">
            <p className="text-xs text-dark-400">
              Status berdasarkan lifetime points ({lifetimePoints.toLocaleString('id-ID')})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      {pointsToNext > 0 && (
        <Card variant="dark" className="mb-4 bg-[#1a2832]">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-dark-300 text-sm font-medium">
                {membership.level === 'Bronze' ? 'Progress to Silver' : 'Progress to Gold'}
              </span>
              <span className="text-dark-400 text-xs">
                {pointsToNext} lifetime pts needed
              </span>
            </div>
            
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    membership.level === 'Bronze'
                      ? (lifetimePoints / 500) * 100
                      : ((lifetimePoints - 500) / 500) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}