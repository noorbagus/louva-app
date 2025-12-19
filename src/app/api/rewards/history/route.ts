import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET() {
  try {
    // Fetch redemption history with reward details
    const { data: redemptions, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        rewards (
          id,
          name,
          description,
          points_required
        )
      `)
      .eq('user_id', FIXED_CUSTOMER_ID)
      .order('redeemed_at', { ascending: false })

    if (error) {
      console.error('Error fetching redemption history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch redemption history' },
        { status: 500 }
      )
    }

    // Transform the data to flatten the structure
    const transformedRedemptions = redemptions?.map(redemption => ({
      id: redemption.id,
      voucher_code: redemption.voucher_code || '',
      reward_name: redemption.rewards?.name || 'Unknown Reward',
      reward_description: redemption.rewards?.description || '',
      points_used: redemption.points_used,
      status: redemption.status,
      redeemed_at: redemption.redeemed_at,
      expiry_date: redemption.expiry_date,
      used_at: redemption.used_at
    })) || []

    return NextResponse.json(transformedRedemptions)
  } catch (error) {
    console.error('Error in redemption history API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}