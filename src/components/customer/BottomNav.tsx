'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3x3, CreditCard, Gift, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/customer', label: 'Home', icon: Home },
  { href: '/customer/services', label: 'Services', icon: Grid3x3 },
  { href: '/customer/qr', label: 'My Card', icon: CreditCard },
  { href: '/customer/rewards', label: 'Rewards', icon: Gift },
  { href: '/customer/account', label: 'Account', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-dark-700 z-40 safe-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
                           (item.href !== '/customer' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-tab flex-1 max-w-[80px]',
                  isActive && 'active'
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}