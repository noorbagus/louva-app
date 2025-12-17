import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today'

    let startDate = new Date()
    const endDate = new Date()

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setDate(startDate.getDate() - 30)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // Get total customers
    const { data: totalCustomers, error: customersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    // Get active customers (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activeCustomers, error: activeCustomersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('updated_at', thirtyDaysAgo.toISOString())

    // Get new customers (in selected period)
    const { data: newCustomers, error: newCustomersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Get total revenue in period
    const { data: revenueData, error: revenueError } = await supabase
      .from('transactions')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Get customer growth
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(startDate)

    const { data: previousPeriodCustomers, error: previousPeriodError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('created_at', previousStartDate.toISOString())
      .lte('created_at', previousEndDate.toISOString())

    // Get top services in period
    const { data: topServicesData, error: topServicesError } = await supabase
      .from('transaction_services')
      .select(`
        price,
        services!inner (
          name
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    // Calculate totals
    const totalCustomersCount = totalCustomers?.length || 0
    const activeCustomersCount = activeCustomers?.length || 0
    const newCustomersCount = newCustomers?.length || 0
    const previousCustomersCount = previousPeriodCustomers?.length || 0

    const totalRevenue = revenueData?.reduce((sum, t) => sum + t.total_amount, 0) || 0

    const customerGrowth = previousCustomersCount > 0
      ? ((newCustomersCount - previousCustomersCount) / previousCustomersCount * 100).toFixed(1)
      : '0'

    // Process top services
    const serviceStats: Record<string, any> = {}
    if (topServicesData) {
      topServicesData.forEach((ts: any) => {
        const serviceName = ts.services?.name || 'Unknown Service'
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = {
            name: serviceName,
            bookings: 0,
            revenue: 0
          }
        }
        serviceStats[serviceName].bookings += 1
        serviceStats[serviceName].revenue += ts.price || 0
      })
    }

    const topServices = Object.values(serviceStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get recent transactions
    const { data: recentTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        users!inner (
          full_name
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get membership distribution
    const { data: membershipData, error: membershipError } = await supabase
      .from('users')
      .select('membership_level')

    const membershipStats: Record<string, number> = { bronze: 0, silver: 0, gold: 0 }
    if (membershipData) {
      membershipData.forEach((c: any) => {
        const level = c.membership_level?.toLowerCase() || 'bronze'
        if (membershipStats[level] !== undefined) {
          membershipStats[level]++
        }
      })
    }

    const response = {
      period,
      stats: {
        totalCustomers: totalCustomersCount,
        activeCustomers: activeCustomersCount,
        newCustomers: newCustomersCount,
        customerGrowth: parseFloat(customerGrowth),
        totalRevenue,
        totalTransactions: revenueData?.length || 0
      },
      topServices,
      recentTransactions: recentTransactions || [],
      membershipDistribution: [
        { level: 'Gold', count: membershipStats.gold, percentage: totalCustomersCount > 0 ? (membershipStats.gold / totalCustomersCount * 100).toFixed(0) : 0 },
        { level: 'Silver', count: membershipStats.silver, percentage: totalCustomersCount > 0 ? (membershipStats.silver / totalCustomersCount * 100).toFixed(0) : 0 },
        { level: 'Bronze', count: membershipStats.bronze, percentage: totalCustomersCount > 0 ? (membershipStats.bronze / totalCustomersCount * 100).toFixed(0) : 0 }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in admin dashboard API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}