import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qr_code, qrCode } = body // Support both naming conventions

    const qrData = qr_code || qrCode

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Try to find customer by QR code directly first (for static QR codes)
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

    // Try timestamp-based QR format (LOUVA_[USER_ID]_[TIMESTAMP])
    if (!customer) {
      // Try timestamp-based QR format (LOUVA_[USER_ID]_[TIMESTAMP])
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

      // Check if QR code is expired (5 minutes)
      if (currentTime - qrTimestamp > fiveMinutes) {
        return NextResponse.json(
          { error: 'QR code has expired' },
          { status: 400 }
        )
      }

      // Find customer by user ID for timestamp QR codes
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
      }
    })
  } catch (error) {
    console.error('Error in QR verification API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}