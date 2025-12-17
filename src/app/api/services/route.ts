import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      )
    }

    // Group by categories
    const categories: { [key: string]: any[] } = {}
    services.forEach((service: any) => {
      if (!categories[service.category]) {
        categories[service.category] = []
      }
      categories[service.category].push(service)
    })

    return NextResponse.json({
      services,
      categories: Object.keys(categories),
      grouped: categories
    })
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      description,
      min_price,
      max_price,
      points_multiplier,
      is_active
    } = body

    if (!name || !category || !min_price) {
      return NextResponse.json(
        { error: 'Name, category, and minimum price are required' },
        { status: 400 }
      )
    }

    // Create new service
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .insert({
        name,
        category,
        description: description || '',
        min_price,
        max_price: max_price || null,
        points_multiplier: points_multiplier || 1.0,
        is_active: is_active !== undefined ? is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      service,
      message: 'Service created successfully'
    })
  } catch (error) {
    console.error('Error in service creation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      category,
      description,
      min_price,
      max_price,
      points_multiplier,
      is_active
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    // Update service
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .update({
        ...(name && { name }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(min_price && { min_price }),
        ...(max_price !== undefined && { max_price }),
        ...(points_multiplier !== undefined && { points_multiplier }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating service:', error)
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      service,
      message: 'Service updated successfully'
    })
  } catch (error) {
    console.error('Error in service update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    // Check if service is used in any transactions
    const { data: transactionServices, error: checkError } = await supabase
      .from('transaction_services')
      .select('id')
      .eq('service_id', id)
      .limit(1)

    if (checkError) {
      console.error('Error checking service usage:', checkError)
      return NextResponse.json(
        { error: 'Failed to check service usage' },
        { status: 500 }
      )
    }

    if (transactionServices && transactionServices.length > 0) {
      // If service is used, just deactivate it
      const { error: updateError } = await supabaseAdmin
        .from('services')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) {
        console.error('Error deactivating service:', updateError)
        return NextResponse.json(
          { error: 'Failed to deactivate service' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Service deactivated (was used in transactions)'
      })
    } else {
      // If service is not used, delete it
      const { error: deleteError } = await supabaseAdmin
        .from('services')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('Error deleting service:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete service' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Service deleted successfully'
      })
    }
  } catch (error) {
    console.error('Error in service deletion API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}