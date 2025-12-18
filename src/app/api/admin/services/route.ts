import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })

    if (error) {
      console.error('Services fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      )
    }

    return NextResponse.json(services || [])
  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { name, category, description, min_price, max_price, points_multiplier } = body

    if (!name || !category || !min_price) {
      return NextResponse.json(
        { error: 'Name, category, and min_price are required' },
        { status: 400 }
      )
    }

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        name,
        category,
        description: description || null,
        min_price,
        max_price: max_price || null,
        points_multiplier: points_multiplier || 1.0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Service creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      )
    }

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Service creation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}