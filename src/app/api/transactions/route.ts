import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzM0MDYsImV4cCI6MjA4MTU0OTQwNn0.fnqBm3S3lWlCY4p4Q0Q7an-J2NXmNOQcbMx0n-O0mHc'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

const FIXED_ADMIN_ID = '550e8400-e29b-41d4-a716-446655440002'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      service_ids,
      payment_method_id,
      notes,
      service_prices,
      mission_id // New field for mission completion
    } = body

    if (!user_id || !service_ids || !payment_method_id || !service_prices) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get customer info
    const { data: customer, error: customerError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
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
      const servicePrice = service_prices[i] || service.min_price

      if (service) {
        const pointsEarned = Math.floor(servicePrice / 1000 * service.points_multiplier)

        transactionServices.push({
          service_id: serviceId,
          price: servicePrice,
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

    // Check for mission bonus
    let missionBonusPoints = 0
    let missionData = null

    if (mission_id) {
      const { data: activeMission } = await supabase
        .from('user_missions')
        .select(`
          *,
          mission:missions (
            id,
            title,
            bonus_points,
            service_id
          )
        `)
        .eq('user_id', user_id)
        .eq('mission_id', mission_id)
        .eq('status', 'active')
        .single()

      if (activeMission && activeMission.mission) {
        // Check if this service matches the mission requirement
        const missionServiceId = activeMission.mission.service_id
        const serviceMatches = !missionServiceId || service_ids.includes(missionServiceId)

        if (serviceMatches) {
          missionBonusPoints = activeMission.mission.bonus_points
          missionData = activeMission.mission
        }
      }
    }

    const finalPointsEarned = totalPointsEarned + missionBonusPoints

    // Create transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id,
        admin_id: FIXED_ADMIN_ID,
        payment_method_id,
        total_amount: totalAmount,
        points_earned: finalPointsEarned,
        mission_id: mission_id || null,
        mission_bonus_points: missionBonusPoints,
        notes: notes || '',
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
          price: ts.price,
          points_earned: ts.points_earned
        })

      if (tsError) {
        console.error('Error inserting transaction service:', tsError)
      }
    }

    // Complete mission if applicable
    if (mission_id && missionData) {
      const { error: missionCompleteError } = await supabaseAdmin
        .from('user_missions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .eq('mission_id', mission_id)

      if (missionCompleteError) {
        console.error('Error completing mission:', missionCompleteError)
      }
    }

    // Update customer points and membership
    const newPointsBalance = customer.total_points + finalPointsEarned
    const newMembershipLevel = newPointsBalance >= 1000 ? 'Gold' : newPointsBalance >= 500 ? 'Silver' : 'Bronze'

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        total_points: newPointsBalance,
        membership_level: newMembershipLevel,
        total_visits: customer.total_visits + 1,
        total_spent: customer.total_spent + totalAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)

    if (updateError) {
      console.error('Error updating customer points:', updateError)
    }

    // Add to points history
    let description = 'Transaction: ' + services.map(s => s.name).join(', ')
    if (missionData) {
      description += ` + Mission: ${missionData.title}`
    }

    const { error: historyError } = await supabaseAdmin
      .from('points_history')
      .insert({
        user_id,
        transaction_id: transaction.id,
        points_change: finalPointsEarned,
        balance_after: newPointsBalance,
        type: 'earn',
        description
      })

    if (historyError) {
      console.error('Error creating points history:', historyError)
    }

    return NextResponse.json({
      transaction,
      customer: {
        ...customer,
        total_points: newPointsBalance,
        membership_level: newMembershipLevel
      },
      mission_completed: missionData ? {
        title: missionData.title,
        bonus_points: missionBonusPoints
      } : null,
      message: missionData 
        ? `Transaction completed! Mission "${missionData.title}" completed with +${missionBonusPoints} bonus points!`
        : 'Transaction completed successfully'
    })
  } catch (error) {
    console.error('Error in transaction API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method remains the same as before
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('user_id') || searchParams.get('customer_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('transactions')
      .select(`
        *,
        transaction_services (
          service_id,
          price,
          points_earned,
          services (
            name,
            category
          )
        ),
        payment_methods (
          name,
          type
        ),
        missions (
          title,
          bonus_points
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (customerId) {
      query = query.eq('user_id', customerId)
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