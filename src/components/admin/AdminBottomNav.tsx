'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/customers', label: 'Customers', icon: 'people' },
  { href: '/admin/scanner', label: 'Scanner', icon: 'qr_code_scanner' },
  { href: '/admin/reports', label: 'Reports', icon: 'analytics' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' }
]

export function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-[var(--surface-light)] border-t border-[var(--border)]">
      <div className="flex justify-around py-3 backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <span className="material-icons text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}