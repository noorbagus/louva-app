import Link from 'next/link'
import { Card } from '@/components/shared/Card'

interface QuickAction {
  title: string
  href: string
  icon: string
  primary?: boolean
}

const quickActions: QuickAction[] = [
  { title: 'Scan Customer', href: '/admin/scanner', icon: 'qr_code_scanner', primary: true },
  { title: 'Customers', href: '/admin/customers', icon: 'people' },
  { title: 'Services', href: '/admin/services', icon: 'spa' },
  { title: 'Reports', href: '/admin/reports', icon: 'analytics' }
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {quickActions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className={`
            p-5 text-center cursor-pointer transition-all duration-300
            ${action.primary
              ? 'bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] border-none hover:shadow-lg hover:shadow-[var(--secondary)]/25'
              : 'bg-[var(--surface-light)] border-[var(--border)] hover:bg-[var(--surface-lighter)] hover:border-[var(--accent)]'
            }
          `}>
            <span className="material-icons text-3xl mb-3 block text-[var(--text-primary)]">
              {action.icon}
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {action.title}
            </span>
          </Card>
        </Link>
      ))}
    </div>
  )
}