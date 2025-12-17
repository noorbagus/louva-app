import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
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