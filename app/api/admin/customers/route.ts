import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const membership = searchParams.get('membership')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
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
      .from('users')
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
      .from('users')
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
      .from('users')
      .insert({
        full_name: name,
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