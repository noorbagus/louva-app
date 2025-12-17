import { NextRequest, NextResponse } from 'next/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return supabaseUrl &&
         supabaseAnonKey &&
         serviceRoleKey &&
         !supabaseUrl.includes('[your-project-id]') &&
         !supabaseAnonKey.includes('...')
}

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        status: 'configuration_error',
        message: 'Supabase credentials not configured',
        instructions: {
          step1: 'Create a Supabase project at https://supabase.com',
          step2: 'Copy credentials from Settings → API',
          step3: 'Update .env.local with your credentials',
          step4: 'Execute database/schema.sql in Supabase SQL Editor'
        },
        current_env_status: {
          url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          service_key_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }, { status: 400 })
    }

    // Import supabase only if configured
    let supabase
    if (isSupabaseConfigured()) {
      const { supabase: sb } = require('@/lib/supabase')
      supabase = sb
    }

    if (!supabase) {
      return NextResponse.json({
        status: 'configuration_error',
        message: 'Supabase credentials not configured',
        instructions: {
          step1: 'Create a Supabase project at https://supabase.com',
          step2: 'Copy credentials from Settings → API',
          step3: 'Update .env.local with your credentials',
          step4: 'Execute database/schema.sql in Supabase SQL Editor'
        }
      }, { status: 400 })
    }

    // Test Supabase connection
    const { data, error } = await supabase
      .from('customers')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'connection_error',
        message: 'Failed to connect to Supabase',
        error: error.message,
        suggestion: 'Please check if database schema has been executed in Supabase SQL Editor'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Supabase',
      data: {
        timestamp: new Date().toISOString(),
        test_result: data,
        next_steps: [
          'Database is connected and ready',
          'You can now test the frontend integration'
        ]
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}