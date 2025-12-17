import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

// Fixed customer account for prototype
const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET(request: NextRequest) {
  try {
    // Get available rewards
    const { data: rewards, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true })

    if (error) {
      console.error('Error fetching rewards:', error)
      return NextResponse.json(
        { error: 'Failed to fetch rewards' },
        { status: 500 }
      )
    }

    return NextResponse.json(rewards)
  } catch (error) {
    console.error('Error in rewards API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reward_id } = body

    // Get customer points
    const { data: customer, error: customerError } = await supabase
      .from('users')
      .select('total_points')
      .eq('id', FIXED_CUSTOMER_ID)
      .single()

    if (customerError) {
      console.error('Error fetching customer:', customerError)
      return NextResponse.json(
        { error: 'Failed to fetch customer' },
        { status: 500 }
      )
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', reward_id)
      .single()

    if (rewardError) {
      console.error('Error fetching reward:', rewardError)
      return NextResponse.json(
        { error: 'Failed to fetch reward' },
        { status: 500 }
      )
    }

    // Check if customer has enough points
    if (customer.total_points < reward.points_required) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }

    // Start transaction
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: FIXED_CUSTOMER_ID,
        reward_id: reward_id,
        points_used: reward.points_required,
        status: 'completed',
        redeemed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (redemptionError) {
      console.error('Error creating redemption:', redemptionError)
      return NextResponse.json(
        { error: 'Failed to create redemption' },
        { status: 500 }
      )
    }

    // Update customer points
    const newPointsBalance = customer.total_points - reward.points_required
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_points: newPointsBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', FIXED_CUSTOMER_ID)

    if (updateError) {
      console.error('Error updating customer points:', updateError)
      return NextResponse.json(
        { error: 'Failed to update customer points' },
        { status: 500 }
      )
    }

    // Add to points history
    const { error: historyError } = await supabase
      .from('points_history')
      .insert({
        user_id: FIXED_CUSTOMER_ID,
        reward_id: redemption.id,
        points_change: -reward.points_required,
        balance_after: newPointsBalance,
        type: 'redeem',
        description: `Redeemed: ${reward.name}`
      })

    if (historyError) {
      console.error('Error creating points history:', historyError)
    }

    return NextResponse.json({
      redemption,
      new_points_balance: newPointsBalance,
      message: 'Reward redeemed successfully'
    })
  } catch (error) {
    console.error('Error in reward redemption API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}