import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
})

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

// Fixed customer account for prototype
const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET(request: NextRequest) {
  try {
    // Force no cache headers
    const response = new NextRequest(request.url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    // Get customer profile with admin client to ensure fresh data
    const { data: customer, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', FIXED_CUSTOMER_ID)
      .single()

    if (error) {
      console.error('Error fetching customer profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customer profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in customer profile API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email } = body

    // Update customer profile
    const { data: customer, error } = await supabase
      .from('users')
      .update({ full_name: name, phone, email, updated_at: new Date().toISOString() })
      .eq('id', FIXED_CUSTOMER_ID)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer profile:', error)
      return NextResponse.json(
        { error: 'Failed to update customer profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in customer profile update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}