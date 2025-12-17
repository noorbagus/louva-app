import { createClient } from '@supabase/supabase-js'

// Supabase configuration with hardcoded values for development
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase keys loaded successfully')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          membership_level: string
          total_points: number
          total_visits: number
          total_spent: number
          qr_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          membership_level?: string
          total_points?: number
          total_visits?: number
          total_spent?: number
          qr_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          membership_level?: string
          total_points?: number
          total_visits?: number
          total_spent?: number
          qr_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          salon_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: string
          salon_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          salon_id?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          min_price: number
          max_price: number | null
          points_multiplier: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          min_price: number
          max_price?: number | null
          points_multiplier?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          min_price?: number
          max_price?: number | null
          points_multiplier?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          name: string
          type: string
          bank: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          bank?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          bank?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          admin_id: string
          payment_method_id: string
          total_amount: number
          points_earned: number
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          admin_id: string
          payment_method_id: string
          total_amount: number
          points_earned: number
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          admin_id?: string
          payment_method_id?: string
          total_amount?: number
          points_earned?: number
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}