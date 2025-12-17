'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/customer', label: 'Home', icon: 'home' },
  { href: '/customer/services', label: 'Services', icon: 'spa' },
  { href: '/customer/qr', label: 'My card', icon: 'credit_card' },
  { href: '/customer/rewards', label: 'Rewards', icon: 'card_giftcard' },
  { href: '/customer/account', label: 'Account', icon: 'person' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[375px] bg-[var(--surface-light)] border-t border-[var(--border)] backdrop-blur-lg z-40 safe-bottom">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
                         (item.href !== '/customer' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-tab flex-1 max-w-[80px] flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200',
                isActive 
                  ? 'text-[var(--primary)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--primary-light)]'
              )}
            >
              <i className="material-icons text-xl mb-1">{item.icon}</i>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}