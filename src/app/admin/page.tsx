'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardStats } from '@/lib/types'
import { DashboardStats as DashboardStatsComponent } from '@/components/admin/DashboardStats'
import { QuickActions } from '@/components/admin/QuickActions'
import { Card } from '@/components/shared/Card'
import { supabase } from '@/lib/supabase-frontend'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminInfo] = useState({
    name: 'Maya Sari',
    role: 'Salon Manager',
    email: 'maya.sari@louva.com'
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch today's customers
      const { data: todayCustomers } = await supabase
        .from('users')
        .select('*')
        .gte('updated_at', new Date().toISOString().split('T')[0])

      // Fetch today's transactions
      const { data: todayTransactions } = await supabase
        .from('transactions')
        .select(`
          *,
          user:users(full_name, membership_level),
          payment_method:payment_methods(name)
        `)
        .gte('created_at', new Date().toISOString().split('T')[0])

      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Fetch top services
      const { data: transactionServices } = await supabase
        .from('transaction_services')
        .select(`
          price,
          service:services(name, category)
        `)
        .gte('created_at', new Date().toISOString().split('T')[0])

      // Calculate stats
      const todayRevenue = todayTransactions?.reduce((sum, t) => sum + t.total_amount, 0) || 0

      // Group services by name and sum revenue
      const serviceRevenue = transactionServices?.reduce((acc, ts) => {
        const serviceName = (ts.service as any)?.name || 'Unknown'
        acc[serviceName] = (acc[serviceName] || 0) + ts.price
        return acc
      }, {} as Record<string, number>)

      const topServices = Object.entries(serviceRevenue || {})
        .map(([name, revenue]) => ({
          service: {
            id: '',
            service_id: '',
            name,
            category: 'Hair' as const,
            price: revenue,
            point_multiplier: 1,
            description: '',
            is_active: true,
            created_at: '',
            updated_at: ''
          },
          count: 1,
          revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      const dashboardStats: DashboardStats = {
        totalCustomers: totalCustomers || 0,
        todayCustomers: todayCustomers?.length || 0,
        todayRevenue,
        monthlyRevenue: todayRevenue * 30, // Estimate
        averageRating: 4.8, // Mock data
        satisfactionRate: 89, // Mock data
        recentTransactions: todayTransactions || [],
        topServices,
        revenueGrowth: 15.2, // Mock data
        customerGrowth: 8.5 // Mock data
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6">
      {/* Header matching customer app layout */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

        {/* User Info Section - matching customer app */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 backdrop-blur-lg">
              <img
                src="/images/admin-profile.jpg"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{adminInfo.name}</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-lg">
                {adminInfo.role}
              </div>
            </div>
          </div>

          {/* Logo - matching customer app position */}
          <div className="flex items-center justify-center">
            <img
              src="/images/louva-putih.png"
              alt="Louva Logo"
              width={82}
              height={54}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stats && <DashboardStatsComponent stats={stats} />}

      {/* Quick Actions */}
      <QuickActions />

      {/* Management Sections */}
      <div className="space-y-8">
        {/* Management Section */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Management</h2>
          <div className="flex flex-col gap-4">
            <Link href="/admin/customers">
              <div className="rounded-xl border duration-200 backdrop-blur-lg shadow-[0_2px_10px_var(--shadow)] p-4 bg-[var(--surface-light)] border-[var(--border)] hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[var(--accent)]">people</span>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Customer Management</h3>
                      <p className="text-sm text-[var(--text-muted)]">View, add, edit customer profiles</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full">
                      {stats?.totalCustomers || 0}
                    </span>
                    <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/services">
              <div className="rounded-xl border duration-200 backdrop-blur-lg shadow-[0_2px_10px_var(--shadow)] p-4 bg-[var(--surface-light)] border-[var(--border)] hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[var(--accent)]">spa</span>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Service Management</h3>
                      <p className="text-sm text-[var(--text-muted)]">Manage services and pricing</p>
                    </div>
                  </div>
                  <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Marketing Section */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Marketing</h2>
          <div className="flex flex-col gap-4">
            <Link href="/admin/reports">
              <div className="rounded-xl border duration-200 backdrop-blur-lg shadow-[0_2px_10px_var(--shadow)] p-4 bg-[var(--surface-light)] border-[var(--border)] hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[var(--accent)]">analytics</span>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Analytics</h3>
                      <p className="text-sm text-[var(--text-muted)]">Customer insights & trends</p>
                    </div>
                  </div>
                  <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}