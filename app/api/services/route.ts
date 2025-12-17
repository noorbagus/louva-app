import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: services, error } = await query

    // Transform data to match frontend expectations
    const transformedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      price_min: service.min_price,
      price_max: service.max_price,
      point_multiplier: service.points_multiplier,
      description: service.description,
      is_active: service.is_active
    }))

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      )
    }

    return NextResponse.json(transformedServices)
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}