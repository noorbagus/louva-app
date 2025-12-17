'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, TrendingDown, Users, FileDownload, TableChart, Calendar } from 'lucide-react'

interface ReportData {
  dailyRevenue: number
  todayCustomers: number
  customerGrowth: number
  revenueGrowth: number
  topServices: Array<{
    name: string
    bookings: number
    revenue: number
  }>
  period: 'today' | 'week' | 'month' | 'year'
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    dailyRevenue: 12500000,
    todayCustomers: 24,
    customerGrowth: 3,
    revenueGrowth: 15.2,
    topServices: [
      {
        name: 'Hair Color',
        bookings: 8,
        revenue: 3600000
      },
      {
        name: 'Hair Cut',
        bookings: 12,
        revenue: 2400000
      },
      {
        name: 'Keratin Therapy',
        bookings: 3,
        revenue: 3270000
      },
      {
        name: 'Hair Spa',
        bookings: 6,
        revenue: 1500000
      },
      {
        name: 'Scalp Treatment',
        bookings: 2,
        revenue: 900000
      }
    ],
    period: 'today'
  })

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [notification, setNotification] = useState('')

  const handlePeriodChange = (period: ReportData['period']) => {
    // Simulate API call to fetch data for different periods
    setIsGeneratingReport(true)

    setTimeout(() => {
      // Mock data for different periods
      const mockData = {
        today: {
          dailyRevenue: 12500000,
          todayCustomers: 24,
          customerGrowth: 3,
          revenueGrowth: 15.2,
        },
        week: {
          dailyRevenue: 87500000,
          todayCustomers: 156,
          customerGrowth: 12,
          revenueGrowth: 8.5,
        },
        month: {
          dailyRevenue: 350000000,
          todayCustomers: 623,
          customerGrowth: 23,
          revenueGrowth: 22.3,
        },
        year: {
          dailyRevenue: 4200000000,
          todayCustomers: 7485,
          customerGrowth: 156,
          revenueGrowth: 45.8,
        }
      }

      setReportData({
        ...reportData,
        ...mockData[period],
        period
      })
      setIsGeneratingReport(false)
    }, 500)
  }

  const exportReport = async (format: 'pdf' | 'excel') => {
    setIsGeneratingReport(true)
    setNotification(`Generating ${format.toUpperCase()} report...`)

    // Simulate API call
    setTimeout(() => {
      setNotification(`Report exported successfully as ${format.toUpperCase()}`)
      setTimeout(() => setNotification(''), 3000)
      setIsGeneratingReport(false)
    }, 2000)
  }

  const customerInsights = [
    { metric: 'Retention Rate', value: '85%', change: '+5%', positive: true },
    { metric: 'Avg Spend', value: 'Rp 485k', change: '+12%', positive: true },
    { metric: 'Monthly Frequency', value: '2.3', change: '+0.2', positive: true },
    { metric: 'Loyalty Score', value: '7.8', change: '+1.2', positive: true }
  ]

  const membershipDistribution = [
    { level: 'Gold', count: 45, percentage: 18, color: 'bg-[#ffa726]/20 text-[#ffa726]' },
    { level: 'Silver', count: 112, percentage: 45, color: 'bg-[#93BEE1]/20 text-[#93BEE1]' },
    { level: 'Bronze', count: 91, percentage: 37, color: 'bg-[#1B3B32]/20 text-[#1B3B32]' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A8BC2] to-[#5A9BD4] sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white hover:text-[#93BEE1]">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-white">Reports & Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {notification && (
          <Card variant="glass" className="bg-[#00d4aa]/10 border-[#00d4aa]/20 mb-4">
            <CardContent className="p-4 text-center">
              <p className="text-[#00d4aa]">{notification}</p>
            </CardContent>
          </Card>
        )}

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                reportData.period === period
                  ? 'bg-[#93BEE1] text-white'
                  : 'bg-[#1a2832] text-[#b0b8c1] hover:bg-[#243442] hover:text-white'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Revenue Overview */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">Revenue Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card variant="dark" className="bg-[#1a2832]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
                  <span className="text-[#b0b8c1] text-sm">Daily Revenue</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(reportData.dailyRevenue)}
                </p>
                <p className="text-xs text-[#00d4aa]">
                  {reportData.revenueGrowth > 0 ? '+' : ''}{reportData.revenueGrowth}% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card variant="dark" className="bg-[#1a2832]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[#93BEE1]" />
                  <span className="text-[#b0b8c1] text-sm">Customers</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {reportData.todayCustomers}
                </p>
                <p className="text-xs text-[#00d4aa]">
                  {reportData.customerGrowth > 0 ? '+' : ''}{reportData.customerGrowth} from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Customer Insights</h2>
          <div className="grid grid-cols-2 gap-3">
            {customerInsights.map((insight, index) => (
              <Card key={index} variant="dark" className="bg-[#1a2832]">
                <CardContent className="p-4">
                  <h5 className="text-white mb-1">{insight.metric}</h5>
                  <p className="text-2xl font-bold text-white">{insight.value}</p>
                  <p className={`text-xs ${
                    insight.positive ? 'text-[#00d4aa]' : 'text-[#ff5252]'
                  }`}>
                    {insight.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Membership Levels</h2>
          <Card variant="dark" className="bg-[#1a2832]">
            <CardContent className="p-4">
              <div className="space-y-3">
                {membershipDistribution.map((level) => (
                  <div key={level.level} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                      <span className="text-white">{level.level} Members</span>
                    </div>
                    <span className="font-semibold text-white">
                      {level.count} ({level.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Services */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            Top Services {reportData.period === 'today' ? 'Today' : `This ${reportData.period}`}
          </h2>
          <Card variant="dark" className="bg-[#1a2832]">
            <CardContent className="p-0">
              {reportData.topServices.map((service, index) => (
                <div
                  key={service.name}
                  className={`flex justify-between items-center p-4 ${
                    index !== reportData.topServices.length - 1
                      ? 'border-b border-[#2d3748]'
                      : ''
                  }`}
                >
                  <div>
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <p className="text-[#6b7785] text-xs">{service.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#93BEE1] font-semibold">
                      {formatCurrency(service.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Export Reports</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => exportReport('pdf')}
              disabled={isGeneratingReport}
              className="bg-[#1a2832] hover:bg-[#243442] border-[#2d3748]"
            >
              <FileDownload className="w-5 h-5 mb-1 mx-auto" />
              <span>Download PDF</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => exportReport('excel')}
              disabled={isGeneratingReport}
              className="bg-[#1a2832] hover:bg-[#243442] border-[#2d3748]"
            >
              <TableChart className="w-5 h-5 mb-1 mx-auto" />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}