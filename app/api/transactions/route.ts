import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// Fixed admin account for prototype
const FIXED_ADMIN_ID = '550e8400-e29b-41d4-a716-446655440002'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_id,
      service_ids,
      payment_method_id,
      payment_notes,
      service_prices
    } = body

    if (!customer_id || !service_ids || !payment_method_id || !service_prices) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get customer info
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customer_id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get services info
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .in('id', service_ids)

    if (servicesError || !services) {
      return NextResponse.json(
        { error: 'Services not found' },
        { status: 404 }
      )
    }

    // Calculate total amount and points
    let totalAmount = 0
    let totalPointsEarned = 0
    const transactionServices = []

    for (let i = 0; i < service_ids.length; i++) {
      const serviceId = service_ids[i]
      const service = services.find(s => s.id === serviceId)
      const servicePrice = service_prices[i] || service.price_min

      if (service) {
        const pointsEarned = Math.floor(servicePrice / 1000 * service.point_multiplier)

        transactionServices.push({
          service_id: serviceId,
          service_price: servicePrice,
          points_earned: pointsEarned
        })

        totalAmount += servicePrice
        totalPointsEarned += pointsEarned
      }
    }

    // Apply membership multiplier
    let membershipMultiplier = 1
    if (customer.membership_level === 'Silver') {
      membershipMultiplier = 1.2
    } else if (customer.membership_level === 'Gold') {
      membershipMultiplier = 1.5
    }

    totalPointsEarned = Math.floor(totalPointsEarned * membershipMultiplier)

    // Start transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        customer_id,
        admin_id: FIXED_ADMIN_ID,
        payment_method_id,
        total_amount: totalAmount,
        points_earned: totalPointsEarned,
        payment_notes: payment_notes || '',
        status: 'completed'
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    // Insert transaction services
    for (const ts of transactionServices) {
      const { error: tsError } = await supabaseAdmin
        .from('transaction_services')
        .insert({
          transaction_id: transaction.id,
          service_id: ts.service_id,
          service_price: ts.service_price,
          points_earned: ts.points_earned
        })

      if (tsError) {
        console.error('Error inserting transaction service:', tsError)
      }
    }

    // Update customer points
    const newPointsBalance = customer.total_points + totalPointsEarned
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        total_points: newPointsBalance,
        last_visit: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', customer_id)

    if (updateError) {
      console.error('Error updating customer points:', updateError)
      return NextResponse.json(
        { error: 'Failed to update customer points' },
        { status: 500 }
      )
    }

    // Add to points history
    const { error: historyError } = await supabaseAdmin
      .from('points_history')
      .insert({
        customer_id,
        transaction_id: transaction.id,
        points_change: totalPointsEarned,
        balance_after: newPointsBalance,
        reason: 'Transaction: ' + services.map(s => s.name).join(', ')
      })

    if (historyError) {
      console.error('Error creating points history:', historyError)
    }

    return NextResponse.json({
      transaction,
      customer: {
        ...customer,
        total_points: newPointsBalance,
        membership_level: newPointsBalance >= 1000 ? 'Gold' : newPointsBalance >= 500 ? 'Silver' : 'Bronze'
      },
      message: 'Transaction completed successfully'
    })
  } catch (error) {
    console.error('Error in transaction API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('transactions')
      .select(`
        *,
        transaction_services (
          service_id,
          service_price,
          points_earned,
          services (
            name,
            category
          )
        ),
        payment_methods (
          name,
          type
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error in transactions API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}