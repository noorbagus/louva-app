import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Fixed customer account for prototype
const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET(request: NextRequest) {
  try {
    // Get customer profile
    const { data: customer, error } = await supabase
      .from('customers')
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
      .from('customers')
      .update({ name, phone, email, updated_at: new Date().toISOString() })
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