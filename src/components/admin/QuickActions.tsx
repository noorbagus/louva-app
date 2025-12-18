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
            {/* Material Icon dengan spacing yang proper */}
            <div className="flex flex-col items-center gap-3">
              <span 
                className="material-icons text-3xl text-[var(--text-primary)]"
                style={{
                  display: 'block',
                  lineHeight: '1',
                  marginBottom: '0'
                }}
              >
                {action.icon}
              </span>
              
              {/* Text dengan spacing yang jelas */}
              <span 
                className="text-sm font-semibold text-[var(--text-primary)]"
                style={{
                  display: 'block',
                  lineHeight: '1.2',
                  textAlign: 'center'
                }}
              >
                {action.title}
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}