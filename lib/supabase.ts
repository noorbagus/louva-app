import { createClient } from '@supabase/supabase-js'

// Check if Supabase credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a mock client if credentials are not available (for development)
const createMockClient = () => {
  console.warn('⚠️  Supabase credentials not found. Using mock client for development.')

  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Mock client - Supabase not configured' } }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: { message: 'Mock client - Supabase not configured' } })
          })
        })
      })
    })
  }
}

// Create real or mock client based on environment
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('[your-project-id]'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any

// Service role client for admin operations (server-side only)
export const supabaseAdmin = (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('[your-project-id]'))
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockClient() as any

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl &&
         supabaseAnonKey &&
         serviceRoleKey &&
         !supabaseUrl.includes('[your-project-id]') &&
         !supabaseAnonKey.includes('...')
}