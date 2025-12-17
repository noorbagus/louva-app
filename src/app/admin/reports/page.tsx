'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { supabase } from '@/lib/supabase-frontend'

export default function ReportsPage() {
  const [period, setPeriod] = useState('today')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [period])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Calculate date range based on period
      const now = new Date()
      let startDate: Date

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      }

      // Fetch transactions for the period
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', startDate.toISOString())

      // Fetch transaction services for revenue breakdown
      const { data: transactionServices } = await supabase
        .from('transaction_services')
        .select(`
          price,
          service:services(name)
        `)
        .gte('created_at', startDate.toISOString())

      // Calculate metrics
      const totalRevenue = transactions?.reduce((sum, t) => sum + t.total_amount, 0) || 0
      const totalCustomers = new Set(transactions?.map(t => t.user_id)).size
      const yesterdayRevenue = 10000000 // Mock data for comparison
      const revenueGrowth = totalRevenue > 0 ? ((totalRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0

      // Group services by name for top services
      const serviceRevenue = transactionServices?.reduce((acc, ts) => {
        const serviceName = ts.service?.name || 'Unknown'
        acc[serviceName] = (acc[serviceName] || 0) + ts.price
        return acc
      }, {} as Record<string, number>)

      const topServices = Object.entries(serviceRevenue || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

      setReportData({
        totalRevenue,
        totalCustomers,
        revenueGrowth,
        topServices
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    // Mock export functionality
    alert('Exporting PDF report...')
  }

  const handleExportExcel = () => {
    // Mock export functionality
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

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {['today', 'week', 'month', 'year'].map((p) => (
          <Button
            key={p}
            onClick={() => setPeriod(p)}
            variant={period === p ? 'default' : 'outline'}
            className={period === p ? '' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue Overview</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-5 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-icons text-[var(--success)]">trending_up</span>
            <span className="text-sm text-[var(--text-muted)]">Daily Revenue</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            Rp {((reportData?.totalRevenue || 0) / 1000000).toFixed(1)}M
          </div>
          <div className={`text-sm mt-2 ${reportData?.revenueGrowth >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
            {reportData?.revenueGrowth >= 0 ? '+' : ''}{reportData?.revenueGrowth?.toFixed(1)}% from yesterday
          </div>
        </Card>

        <Card className="p-5 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-icons text-[var(--accent)]">people</span>
            <span className="text-sm text-[var(--text-muted)]">Customers</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {reportData?.totalCustomers || 0}
          </div>
          <div className="text-sm text-[var(--success)] mt-2">
            +3 from yesterday
          </div>
        </Card>
      </div>

      {/* Top Services */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Top Services {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
      </h2>
      <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)] mb-6">
        {reportData?.topServices?.map(([serviceName, revenue]: [string, number], index: number) => (
          <div key={serviceName} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">{serviceName}</h3>
              <p className="text-sm text-[var(--text-muted)]">{8 - index} bookings</p>
            </div>
            <div className="text-[var(--accent)] font-semibold">
              Rp {(revenue / 1000000).toFixed(1)}M
            </div>
          </div>
        ))}
      </Card>

      {/* Export Options */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Export Reports</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-lighter)]"
        >
          <span className="material-icons mb-2 text-2xl">file_download</span>
          Download PDF
        </Button>
        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-lighter)]"
        >
          <span className="material-icons mb-2 text-2xl">table_chart</span>
          Export Excel
        </Button>
      </div>
    </div>
  )
}