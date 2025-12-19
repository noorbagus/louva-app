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
      .select('id, total_points, lifetime_points, membership_level')
      .eq('id', '550e8400-e29b-41d4-a716-446655440001')
      .single()

    if (error || !customer) {
      return NextResponse.json({ error: 'Customer not found' })
    }

    // Migrate lifetime_points if null (set to total_points for existing users)
    const lifetimePoints = customer.lifetime_points || customer.total_points || 0

    // Calculate correct membership level based on lifetime_points
    const correctLevel = lifetimePoints >= 1000 ? 'Gold' : 
                        lifetimePoints >= 500 ? 'Silver' : 'Bronze'

    // Update if different or lifetime_points is null
    if (customer.membership_level !== correctLevel || customer.lifetime_points === null) {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          lifetime_points: lifetimePoints,
          membership_level: correctLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update membership' })
      }

      return NextResponse.json({ 
        message: `Updated membership from ${customer.membership_level} to ${correctLevel}`,
        old_level: customer.membership_level,
        new_level: correctLevel,
        lifetime_points: lifetimePoints,
        available_points: customer.total_points,
        migrated: customer.lifetime_points === null
      })
    }

    return NextResponse.json({ 
      message: 'Membership level is correct',
      level: correctLevel,
      lifetime_points: lifetimePoints,
      available_points: customer.total_points
    })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' })
  }
}