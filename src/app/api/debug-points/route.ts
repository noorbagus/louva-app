import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

const CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG POINTS ===')

    // Get data with anon client (customer API)
    const { data: customerAnon, error: errorAnon } = await supabase
      .from('users')
      .select('*')
      .eq('id', CUSTOMER_ID)
      .single()

    // Get data with admin client (admin API)
    const { data: customerAdmin, error: errorAdmin } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', CUSTOMER_ID)
      .single()

    // Get recent transactions for this customer
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', CUSTOMER_ID)
      .order('created_at', { ascending: false })
      .limit(5)

    console.log('Anon client data:', customerAnon)
    console.log('Admin client data:', customerAdmin)
    console.log('Recent transactions:', transactions)

    return NextResponse.json({
      customer_anon_client: customerAnon,
      customer_admin_client: customerAdmin,
      recent_transactions: transactions,
      anon_error: errorAnon,
      admin_error: errorAdmin,
      trans_error: transError
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
}