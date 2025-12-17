import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function POST(request: NextRequest) {
  try {
    // Get all users and fix their membership levels
    const { data: users, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, total_points, membership_level')

    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    const updatedUsers = []

    for (const user of users || []) {
      const correctMembership = user.total_points >= 1000 ? 'Gold' : user.total_points >= 500 ? 'Silver' : 'Bronze'

      if (user.membership_level !== correctMembership) {
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ membership_level: correctMembership })
          .eq('id', user.id)

        if (updateError) {
          console.error(`Error updating user ${user.id}:`, updateError)
        } else {
          updatedUsers.push({
            id: user.id,
            old_level: user.membership_level,
            new_level: correctMembership,
            points: user.total_points
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Membership levels updated successfully',
      updated_users: updatedUsers
    })
  } catch (error) {
    console.error('Error fixing membership levels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}