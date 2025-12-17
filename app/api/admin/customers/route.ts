import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const membership = searchParams.get('membership')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (membership && membership !== 'all') {
      query = query.eq('membership_level', membership)
    }

    const { data: customers, error } = await query

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      )
    }

    // Get customer counts for stats
    const { data: stats, error: statsError } = await supabase
      .from('customers')
      .select('membership_level')

    let statsData = { total: customers?.length || 0, bronze: 0, silver: 0, gold: 0 }

    if (!statsError && stats) {
      statsData = {
        total: customers?.length || 0,
        bronze: stats.filter(c => c.membership_level === 'Bronze').length,
        silver: stats.filter(c => c.membership_level === 'Silver').length,
        gold: stats.filter(c => c.membership_level === 'Gold').length
      }
    }

    return NextResponse.json({
      customers,
      stats: statsData
    })
  } catch (error) {
    console.error('Error in admin customers API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if customer already exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Error checking for existing customer' },
        { status: 500 }
      )
    }

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email or phone already exists' },
        { status: 400 }
      )
    }

    // Generate QR code
    const timestamp = Date.now()
    const qrCode = `LOUVA_${email.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_${timestamp}`

    // Create new customer
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert({
        name,
        email,
        phone,
        membership_level: 'Bronze',
        total_points: 0,
        qr_code: qrCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      customer,
      message: 'Customer created successfully'
    })
  } catch (error) {
    console.error('Error in admin customer creation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}