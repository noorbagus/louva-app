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
    // Configuration Status
    const configStatus = isSupabaseConfigured()
    const envStatus = {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('[your-project-id]'),
      anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('...'),
      service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('...')
    }

    const response: any = {
      status: configStatus ? 'configured' : 'not_configured',
      message: configStatus ? 'Supabase is configured' : 'Supabase credentials not configured',
      environment: envStatus,
      schema_analysis: {
        expected_tables: [
          'users',
          'admins',
          'services',
          'payment_methods',
          'transactions',
          'transaction_services',
          'points_history',
          'rewards',
          'reward_redemptions'
        ],
        fixed_accounts: {
          customer_id: '550e8400-e29b-41d4-a716-446655440001',
          customer_email: 'sari.dewi@example.com',
          customer_name: 'Sari Dewi',
          customer_points: 750,
          customer_membership: 'Silver',
          admin_id: '550e8400-e29b-41d4-a716-446655440002',
          admin_email: 'maya.sari@louva.com',
          admin_name: 'Maya Sari'
        },
        sample_data_count: {
          services: 8,
          payment_methods: 11,
          rewards: 5
        }
      },
      api_endpoints: {
        customer: [
          'GET /api/user/profile',
          'PUT /api/user/profile',
          'GET /api/user/points',
          'GET /api/services',
          'GET /api/rewards',
          'POST /api/rewards'
        ],
        transaction: [
          'POST /api/scan/verify',
          'GET /api/transactions',
          'POST /api/transactions'
        ],
        admin: [
          'GET /api/admin/dashboard',
          'GET /api/admin/customers',
          'POST /api/admin/customers'
        ]
      },
      testing_instructions: {
        step1: 'Execute database/schema.sql in Supabase SQL Editor',
        step2: 'Test connection: curl http://localhost:3001/api/test-connection',
        step3: 'Test customer profile: curl http://localhost:3001/api/user/profile',
        step4: 'Test services: curl http://localhost:3001/api/services',
        step5: 'Test QR verification: curl -X POST -H "Content-Type: application/json" -d \'{"qr_code":"LOUVA_SD001_2024"}\' http://localhost:3001/api/scan/verify'
      }
    }

    // Test actual API endpoints if configured
    if (configStatus) {
      try {
        // Test user profile
        const { supabase } = require('@/lib/supabase')
        const { data: customer, error: customerError } = await supabase
          .from('users')
          .select('*')
          .eq('id', '550e8400-e29b-41d4-a716-446655440001')
          .single()

        // Test services
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .limit(3)

        response.database_connection = {
          customer_test: customerError ? 'failed' : 'success',
          services_test: servicesError ? 'failed' : 'success',
          customer_data: customerError ? null : {
            id: customer.id,
            name: customer.full_name,
            email: customer.email,
            points: customer.total_points,
            membership: customer.membership_level
          },
          services_count: servicesError ? 0 : services.length
        }

        if (customerError || servicesError) {
          response.status = 'database_error'
          response.message = 'Database connection failed - please execute schema.sql'
          response.error_details = {
            customer_error: customerError?.message,
            services_error: servicesError?.message
          }
        } else {
          response.status = 'ready'
          response.message = 'All systems ready for testing!'
        }

      } catch (dbError) {
        response.status = 'connection_error'
        response.message = 'Failed to connect to database'
        response.error = dbError instanceof Error ? dbError.message : 'Unknown error'
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Setup test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}