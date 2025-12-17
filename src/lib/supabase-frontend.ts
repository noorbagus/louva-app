import { createClient } from '@supabase/supabase-js'

// Supabase configuration for frontend
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle API errors
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  console.error('API Error:', error)
  if (error?.message) {
    return error.message
  }
  return defaultMessage
}

// Helper function to check network status
export const isNetworkError = (error: any) => {
  return error instanceof TypeError && error.message === 'Failed to fetch'
}