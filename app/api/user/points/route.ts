import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Fixed customer account for prototype
const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET(request: NextRequest) {
  try {
    // Get current customer points
    const { data: customer, error } = await supabase
      .from('users')
      .select('total_points, membership_level, total_visits, total_spent')
      .eq('id', FIXED_CUSTOMER_ID)
      .single()

    if (error) {
      console.error('Error fetching customer points:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customer points' },
        { status: 500 }
      )
    }

    // Get points history
    const { data: history, error: historyError } = await supabase
      .from('points_history')
      .select('*')
      .eq('user_id', FIXED_CUSTOMER_ID)
      .order('created_at', { ascending: false })
      .limit(20)

    if (historyError) {
      console.error('Error fetching points history:', historyError)
      return NextResponse.json(
        { error: 'Failed to fetch points history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      current_points: customer.total_points,
      membership_level: customer.membership_level,
      total_visits: customer.total_visits,
      total_spent: customer.total_spent,
      history: history
    })
  } catch (error) {
    console.error('Error in points API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}