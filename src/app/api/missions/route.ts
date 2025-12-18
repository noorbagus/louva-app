import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

// GET - Get available missions for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || FIXED_CUSTOMER_ID

    // Get all active missions
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select(`
        *,
        services (
          id,
          name,
          min_price,
          category
        )
      `)
      .eq('is_active', true)

    if (missionsError) throw missionsError

    // Get user's mission status
    const { data: userMissions, error: userMissionsError } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)

    if (userMissionsError) throw userMissionsError

    // Combine mission data with user progress
    const missionsWithStatus = missions.map(mission => {
      const userMission = userMissions.find(um => um.mission_id === mission.id)
      
      return {
        ...mission,
        user_status: userMission?.status || 'available',
        activated_at: userMission?.activated_at,
        completed_at: userMission?.completed_at,
        expires_at: userMission?.expires_at,
        is_expired: userMission?.expires_at ? new Date() > new Date(userMission.expires_at) : false
      }
    })

    return NextResponse.json({
      missions: missionsWithStatus,
      user_id: userId
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  }
}

// POST - Activate mission for user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mission_id, user_id = FIXED_CUSTOMER_ID } = body

    if (!mission_id) {
      return NextResponse.json(
        { error: 'Mission ID is required' },
        { status: 400 }
      )
    }

    // Get mission details
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('*')
      .eq('id', mission_id)
      .single()

    if (missionError || !mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Check if user already has this mission
    const { data: existingMission } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', user_id)
      .eq('mission_id', mission_id)
      .single()

    if (existingMission) {
      return NextResponse.json(
        { error: 'Mission already activated' },
        { status: 400 }
      )
    }

    // Calculate expiry date if mission has duration
    let expiresAt = null
    if (mission.duration_days) {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + mission.duration_days)
      expiresAt = expiry.toISOString()
    }

    // Activate mission for user
    const { data: userMission, error: activateError } = await supabaseAdmin
      .from('user_missions')
      .insert({
        user_id,
        mission_id,
        status: 'active',
        expires_at: expiresAt
      })
      .select()
      .single()

    if (activateError) {
      console.error('Error activating mission:', activateError)
      return NextResponse.json(
        { error: 'Failed to activate mission' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user_mission: userMission,
      message: 'Mission activated successfully'
    })
  } catch (error) {
    console.error('Error activating mission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Complete mission (called during transaction)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id = FIXED_CUSTOMER_ID, mission_id } = body

    if (!mission_id) {
      return NextResponse.json(
        { error: 'Mission ID is required' },
        { status: 400 }
      )
    }

    // Update mission status to completed
    const { data: userMission, error: updateError } = await supabaseAdmin
      .from('user_missions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('mission_id', mission_id)
      .eq('status', 'active')
      .select()
      .single()

    if (updateError || !userMission) {
      return NextResponse.json(
        { error: 'Mission not found or already completed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user_mission: userMission,
      message: 'Mission completed successfully'
    })
  } catch (error) {
    console.error('Error completing mission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}