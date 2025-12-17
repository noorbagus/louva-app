import { Metadata } from 'next'
import { AdminBottomNav } from '@/components/admin/AdminBottomNav'

export const metadata: Metadata = {
  title: 'Louva Salon - Admin App',
  description: 'Aplikasi manajemen salon Louva',
  viewport: 'width=375, initial-scale=1.0',
  themeColor: '#4A8BC2'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--secondary)] safe-top">
      <div className="max-w-md mx-auto bg-[var(--surface)] min-h-screen relative">
        {/* Main Content */}
        <main className="pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <AdminBottomNav />
      </div>
    </div>
  )
}