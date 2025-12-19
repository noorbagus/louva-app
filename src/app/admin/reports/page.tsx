'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { RewardAnalytics } from '@/components/admin/RewardAnalytics'

interface ReportData {
  totalRevenue: number
  totalCustomers: number
  revenueGrowth: number
  topServices: Array<[string, number, number]> // [name, revenue, booking_count]
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('today')
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [activeTab, setActiveTab] = useState<'revenue' | 'customers' | 'services' | 'rewards'>('rewards')

  useEffect(() => {
    fetchReportData()
  }, [period])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Fetch top services data from API
      const response = await fetch(`/api/admin/reports/top-services?period=${period}`)
      const data = await response.json()
      
      if (response.ok) {
        // Transform data for UI
        const topServices = data.top_services?.map((service: any) => [
          service.service_name,
          service.total_revenue,
          service.booking_count
        ]) || []

        setReportData({
          totalRevenue: data.total_revenue || 0,
          totalCustomers: data.total_bookings || 0,
          revenueGrowth: 15.2, // Mock data for now
          topServices
        })
      } else {
        throw new Error(data.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      // Fallback to empty state
      setReportData({
        totalRevenue: 0,
        totalCustomers: 0,
        revenueGrowth: 0,
        topServices: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    alert('Exporting PDF report...')
  }

  const handleExportExcel = () => {
    alert('Exporting Excel report...')
  }

  if (loading) {
    return (
      <div className="px-5 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports & Analytics</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 border-b border-[var(--border)]">
        {[
          { id: 'revenue', label: 'Revenue', icon: 'trending_up' },
          { id: 'customers', label: 'Customers', icon: 'people' },
          { id: 'services', label: 'Services', icon: 'content_cut' },
          { id: 'rewards', label: 'Rewards', icon: 'redeem' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 flex items-center gap-2 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'text-[var(--primary)] border-[var(--primary)]'
                : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
            }`}
          >
            <span className="material-icons text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {['today', 'week', 'month', 'year'].map((p) => (
          <Button
            key={p}
            onClick={() => setPeriod(p)}
            variant={period === p ? 'primary' : 'outline'}
            className={period === p ? '' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'rewards' ? (
        <RewardAnalytics />
      ) : (
        <>
          {/* Key Metrics */}
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-5 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-icons text-[var(--success)]">trending_up</span>
            <span className="text-sm text-[var(--text-muted)]">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            Rp {((reportData?.totalRevenue || 0) / 1000000).toFixed(1)}M
          </div>
          <div className={`text-sm mt-2 ${(reportData?.revenueGrowth ?? 0) >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
            {(reportData?.revenueGrowth ?? 0) >= 0 ? '+' : ''}{(reportData?.revenueGrowth ?? 0).toFixed(1)}% from yesterday
          </div>
        </Card>

        <Card className="p-5 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-icons text-[var(--accent)]">local_activity</span>
            <span className="text-sm text-[var(--text-muted)]">Total Bookings</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {reportData?.totalCustomers || 0}
          </div>
          <div className="text-sm text-[var(--success)] mt-2">
            From {period === 'today' ? 'today' : `this ${period}`}
          </div>
        </Card>
      </div>

      {/* Top Services */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Top Services {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
      </h2>
      
      {reportData?.topServices && reportData.topServices.length > 0 ? (
        <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)] mb-6">
          {reportData.topServices.slice(0, 3).map(([serviceName, revenue, bookingCount]: [string, number, number], index: number) => (
            <div key={serviceName} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-amber-600' : 'bg-[var(--accent)]'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{serviceName}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{bookingCount} bookings</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[var(--accent)] font-semibold">
                  Rp {(revenue / 1000).toLocaleString('id-ID')}K
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Avg: Rp {Math.round(revenue / bookingCount / 1000)}K
                </div>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card className="bg-[var(--surface-light)] border-[var(--border)] p-8 text-center mb-6">
          <span className="material-icons text-4xl text-[var(--text-muted)] mb-2 block">spa</span>
          <h3 className="font-medium text-[var(--text-primary)] mb-1">No Services Data</h3>
          <p className="text-sm text-[var(--text-muted)]">
            No transactions found for {period === 'today' ? 'today' : `this ${period}`}
          </p>
        </Card>
      )}

      {/* Export Options */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Export Reports</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-lighter)] flex flex-col items-center gap-2 py-4"
        >
          <span className="material-icons text-2xl">file_download</span>
          <span>Download PDF</span>
        </Button>
        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-lighter)] flex flex-col items-center gap-2 py-4"
        >
          <span className="material-icons text-2xl">table_chart</span>
          <span>Export Excel</span>
        </Button>
      </div>
        </>
      )}
    </div>
  )
}