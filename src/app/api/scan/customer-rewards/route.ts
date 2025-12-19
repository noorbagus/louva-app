import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      )
    }

    // Fetch active rewards with reward details
    const { data: activeRewards, error } = await supabase
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
      .eq('user_id', customerId)
      .eq('status', 'active')
      .order('redeemed_at', { ascending: false })

    if (error) {
      console.error('Error fetching active rewards:', error)
      return NextResponse.json(
        { error: 'Failed to fetch active rewards' },
        { status: 500 }
      )
    }

    // Format the response
    const formattedRewards = activeRewards?.map(reward => ({
      redemption_id: reward.id,
      reward_id: reward.rewards?.id,
      reward_name: reward.rewards?.name || 'Unknown Reward',
      reward_description: reward.rewards?.description || '',
      points_used: reward.points_used,
      redeemed_at: reward.redeemed_at,
      // For display purposes
      display_text: `${reward.rewards?.name} (Redeemed with ${reward.points_required} points)`
    })) || []

    return NextResponse.json({
      activeRewards: formattedRewards,
      totalActive: formattedRewards.length
    })

  } catch (error) {
    console.error('Error in customer rewards API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}