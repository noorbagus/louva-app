import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Validate QR code format (LOUVA_[USER_ID]_[TIMESTAMP])
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

    // Find customer by QR code
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('qr_code', qr_code)
      .single()

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
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        membership_level: customer.membership_level,
        total_points: customer.total_points,
        last_visit: customer.last_visit
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