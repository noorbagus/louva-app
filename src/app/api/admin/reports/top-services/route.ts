import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today'

    let dateFilter = ''
    const now = new Date()
    
    switch (period) {
      case 'today':
        dateFilter = `DATE(t.created_at) = CURRENT_DATE`
        break
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0]
        dateFilter = `DATE(t.created_at) >= '${weekStart}'`
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        dateFilter = `DATE(t.created_at) >= '${monthStart}'`
        break
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        dateFilter = `DATE(t.created_at) >= '${yearStart}'`
        break
    }

    // Get top services with SQL query
    const { data: topServicesData, error: servicesError } = await supabase
      .rpc('get_top_services', {
        period_filter: dateFilter
      })

    if (servicesError) {
      // Fallback to manual query if RPC doesn't exist
      const { data: transactionServices, error } = await supabase
        .from('transaction_services')
        .select(`
          service_id,
          price,
          services!inner (
            id,
            name,
            category
          ),
          transactions!inner (
            created_at,
            status
          )
        `)
        .eq('transactions.status', 'completed')
        .gte('transactions.created_at', 
          period === 'today' ? new Date().toISOString().split('T')[0] :
          period === 'week' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() :
          period === 'month' ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString() :
          new Date(new Date().getFullYear(), 0, 1).toISOString()
        )
      
      if (error) {
        throw error
      }

      // Process the data
      const serviceStats: Record<string, any> = {}
      
      transactionServices.forEach((ts: any) => {
        const serviceId = ts.service_id
        const serviceName = ts.services?.name || 'Unknown Service'
        const serviceCategory = ts.services?.category || 'Other'
        
        if (!serviceStats[serviceId]) {
          serviceStats[serviceId] = {
            service_id: serviceId,
            service_name: serviceName,
            category: serviceCategory,
            booking_count: 0,
            total_revenue: 0
          }
        }
        
        serviceStats[serviceId].booking_count += 1
        serviceStats[serviceId].total_revenue += ts.price || 0
      })

      const topServices = Object.values(serviceStats)
        .sort((a: any, b: any) => b.booking_count - a.booking_count || b.total_revenue - a.total_revenue)
        .slice(0, 5)

      return NextResponse.json({
        period,
        top_services: topServices,
        total_revenue: Object.values(serviceStats).reduce((sum: number, service: any) => sum + service.total_revenue, 0),
        total_bookings: Object.values(serviceStats).reduce((sum: number, service: any) => sum + service.booking_count, 0)
      })
    }

    return NextResponse.json({
      period,
      top_services: topServicesData || [],
      total_revenue: 0,
      total_bookings: 0
    })

  } catch (error) {
    console.error('Error fetching top services:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}