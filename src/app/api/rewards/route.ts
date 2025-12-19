import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET() {
  try {
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

    // Generate unique voucher code
    const generateVoucherCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = 'LOUVA-'
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    // Check for unique code
    let voucherCode = generateVoucherCode()
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('reward_redemptions')
        .select('voucher_code')
        .eq('voucher_code', voucherCode)
        .single()

      if (!existing) {
        isUnique = true
      } else {
        voucherCode = generateVoucherCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique voucher code' },
        { status: 500 }
      )
    }

    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('users')
      .select('total_points, lifetime_points')
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

    // Check if customer has enough available points
    if (customer.total_points < reward.points_required) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }

    // Set expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: FIXED_CUSTOMER_ID,
        reward_id: reward_id,
        voucher_code: voucherCode,
        points_used: reward.points_required,
        status: 'active', // Changed from 'completed' to 'active'
        redeemed_at: new Date().toISOString(),
        expiry_date: expiryDate.toISOString()
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

    // Update customer available points (lifetime_points unchanged)
    const newAvailablePoints = customer.total_points - reward.points_required
    const lifetimePoints = customer.lifetime_points || customer.total_points || 0
    
    // Membership level based on lifetime_points (won't decrease)
    const membershipLevel = lifetimePoints >= 1000 ? 'Gold' : 
                            lifetimePoints >= 500 ? 'Silver' : 'Bronze'

    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_points: newAvailablePoints,
        membership_level: membershipLevel,
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
        balance_after: newAvailablePoints,
        type: 'redeem',
        description: `Redeemed: ${reward.name}`
      })

    if (historyError) {
      console.error('Error creating points history:', historyError)
    }

    return NextResponse.json({
      redemption: {
        ...redemption,
        voucher_code: voucherCode
      },
      voucher_code: voucherCode,
      expiry_date: expiryDate.toISOString(),
      new_points_balance: newAvailablePoints,
      membership_level: membershipLevel,
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