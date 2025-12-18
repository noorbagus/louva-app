import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qr_code, qrCode } = body

    const qrData = qr_code || qrCode

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      )
    }

    let customer = null
    let error = null

    // Try JSON format first (new dynamic QR)
    try {
      const parsed = JSON.parse(qrData)
      if (parsed.type === 'loyalty' && parsed.customerId && parsed.timestamp) {
        // Check if QR is expired (5 minutes)
        const qrTimestamp = new Date(parsed.timestamp)
        const now = new Date()
        const diffMs = now.getTime() - qrTimestamp.getTime()
        const diffMinutes = Math.floor(diffMs / 60000)

        if (diffMinutes > 5) {
          return NextResponse.json(
            { error: 'QR code has expired. Please generate a new one.' },
            { status: 400 }
          )
        }

        // Find customer by customer ID
        const { data: jsonCustomer, error: jsonError } = await supabase
          .from('users')
          .select('*')
          .eq('id', parsed.customerId)
          .single()

        if (jsonCustomer && !jsonError) {
          customer = jsonCustomer
        }
      }
    } catch {
      // Not JSON, try other formats
    }

    // Direct lookup for static QR codes
    if (!customer) {
      const { data: directCustomer, error: directError } = await supabase
        .from('users')
        .select('*')
        .eq('qr_code', qrData)
        .single()

      if (directCustomer) {
        customer = directCustomer
      }
    }

    // Try timestamp-based QR format
    if (!customer) {
      const qrPattern = /^LOUVA_(.+)_(\d+)$/
      const match = qrData.match(qrPattern)

      if (!match) {
        return NextResponse.json(
          { error: 'Invalid QR code format' },
          { status: 400 }
        )
      }

      const [, userId, timestamp] = match
      const qrTimestamp = parseInt(timestamp)
      const currentTime = Date.now()
      const fiveMinutes = 5 * 60 * 1000

      if (currentTime - qrTimestamp > fiveMinutes) {
        return NextResponse.json(
          { error: 'QR code has expired' },
          { status: 400 }
        )
      }

      const { data: timestampCustomer, error: timestampError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      customer = timestampCustomer
      error = timestampError
    }

    if (error || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get active missions for this customer
    const { data: activeMissions, error: missionsError } = await supabase
      .from('user_missions')
      .select(`
        *,
        mission:missions (
          id,
          title,
          description,
          bonus_points,
          service_id,
          services (
            id,
            name,
            min_price,
            category
          )
        )
      `)
      .eq('user_id', customer.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())

    const activeUserMissions = activeMissions || []

    return NextResponse.json({
      success: true,
      valid: true,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        membership_level: customer.membership_level,
        total_points: customer.total_points,
        last_visit: customer.updated_at
      },
      active_missions: activeUserMissions.map(um => ({
        user_mission_id: um.id,
        mission_id: um.mission.id,
        title: um.mission.title,
        description: um.mission.description,
        bonus_points: um.mission.bonus_points,
        service_id: um.mission.service_id,
        service_name: um.mission.services?.name,
        service_price: um.mission.services?.min_price,
        activated_at: um.activated_at,
        expires_at: um.expires_at
      }))
    })
  } catch (error) {
    console.error('Error in QR verification API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}