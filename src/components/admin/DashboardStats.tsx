import React from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardStatsProps {
  stats: {
    totalCustomers: number
    todayRevenue: number
    monthlyRevenue: number
    totalRewardsRedeemed: number
  }
  className?: string
}

export function DashboardStats({ stats, className }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toLocaleString('id-ID'),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      label: 'Rewards Redeemed',
      value: stats.totalRewardsRedeemed.toLocaleString('id-ID'),
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    }
  ]

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {statItems.map((item, index) => (
        <Card key={index} variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
            <p className="text-dark-400 text-xs mb-1">{item.label}</p>
            <p className="text-dark-100 text-lg font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}