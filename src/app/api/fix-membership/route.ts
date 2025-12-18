import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function POST() {
  try {
    // Get fixed customer
    const { data: customer, error } = await supabaseAdmin
      .from('users')
      .select('id, total_points, membership_level')
      .eq('id', '550e8400-e29b-41d4-a716-446655440001')
      .single()

    if (error || !customer) {
      return NextResponse.json({ error: 'Customer not found' })
    }

    // Calculate correct membership level
    const correctLevel = customer.total_points >= 1000 ? 'Gold' : 
                        customer.total_points >= 500 ? 'Silver' : 'Bronze'

    // Update if different
    if (customer.membership_level !== correctLevel) {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          membership_level: correctLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update membership' })
      }

      return NextResponse.json({ 
        message: `Updated from ${customer.membership_level} to ${correctLevel}`,
        old_level: customer.membership_level,
        new_level: correctLevel,
        points: customer.total_points
      })
    }

    return NextResponse.json({ 
      message: 'Membership level is correct',
      level: correctLevel,
      points: customer.total_points
    })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' })
  }
}