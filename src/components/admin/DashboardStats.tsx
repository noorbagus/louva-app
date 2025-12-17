import { Card } from '@/components/shared/Card'
import { DashboardStats as DashboardStatsType } from '@/lib/types'

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          {stats.todayCustomers}
        </div>
        <div className="text-xs text-[var(--text-muted)]">Today's Customers</div>
      </Card>

      <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          {(stats.todayRevenue / 1000000).toFixed(1)}M
        </div>
        <div className="text-xs text-[var(--text-muted)]">Revenue (IDR)</div>
      </Card>

      <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          {stats.satisfactionRate}%
        </div>
        <div className="text-xs text-[var(--text-muted)]">Satisfaction</div>
      </Card>
    </div>
  )
}