import { Metadata } from 'next'
import { AdminBottomNav } from '@/components/admin/AdminBottomNav'

export const metadata: Metadata = {
  title: 'Louva Salon - Admin App',
  description: 'Aplikasi manajemen salon Louva',
  viewport: 'width=375, initial-scale=1.0',
  themeColor: '#1a1a1a'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 safe-top">
      <div className="max-w-md mx-auto bg-dark-900 min-h-screen relative">
        {/* Main Content */}
        <main className="pb-20 safe-bottom">
          {children}
        </main>

        {/* Bottom Navigation */}
        <AdminBottomNav />
      </div>
    </div>
  )
}