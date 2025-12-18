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
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-[var(--surface-light)] border-t border-[var(--border)] backdrop-filter backdrop-blur-xl">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {/* Icon with proper spacing */}
              <span 
                className={`material-icons transition-all duration-200 ${
                  isActive ? 'text-xl' : 'text-lg'
                }`}
                style={{ 
                  display: 'block',
                  lineHeight: '1',
                  marginBottom: '4px'
                }}
              >
                {item.icon}
              </span>
              
              {/* Label with proper spacing */}
              <span 
                className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                }`}
                style={{
                  display: 'block',
                  lineHeight: '1.2',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}