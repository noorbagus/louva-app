import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qr_code } = body

    if (!qr_code) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Try to find customer by QR code directly first (for static QR codes)
    let customer = null
    let error = null

    // Direct lookup for static QR codes
    const { data: directCustomer, error: directError } = await supabase
      .from('users')
      .select('*')
      .eq('qr_code', qr_code)
      .single()

    if (directCustomer) {
      customer = directCustomer
    } else {
      // Try timestamp-based QR format (LOUVA_[USER_ID]_[TIMESTAMP])
      const qrPattern = /^LOUVA_(.+)_(\d+)$/
      const match = qr_code.match(qrPattern)

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
      valid: true,
      customer: {
        id: customer.id,
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