import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znsmbtnlfqdumnrmvijh.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc21idG5sZnFkdW1ucm12aWpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3MzQwNiwiZXhwIjoyMDgxNTQ5NDA2fQ.NAAyUacn3xdKsf15vOETFXuCx6P86LxqdMvQwy__QW4'
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

const FIXED_ADMIN_ID = '550e8400-e29b-41d4-a716-446655440002'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      service_ids, 
      service_prices, 
      payment_method_id, 
      active_missions, 
      notes 
    } = body

    if (!user_id || !service_ids || !payment_method_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get customer data
    const { data: customer, error: customerError } = await supabaseAdmin
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

    // Get services data
    const { data: services, error: servicesError } = await supabaseAdmin
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
        const pointsEarned = Math.floor(servicePrice / 1000)

        transactionServices.push({
          service_id: serviceId,
          price: servicePrice,
          points_earned: pointsEarned
        })

        totalAmount += servicePrice
        totalPointsEarned += pointsEarned
      }
    }

    // Apply membership multiplier from configuration
    let membershipMultiplier = 1

    try {
      // Fetch membership configuration
      const membershipResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/membership`)
      if (membershipResponse.ok) {
        const membershipData = await membershipResponse.json()
        if (membershipData.success) {
          const currentLifetimePoints = customer.lifetime_points || customer.total_points || 0

          // Find matching membership level
          const matchingLevel = membershipData.data.rules.find(rule => {
            const minPoints = rule.min_points
            const maxPoints = rule.max_points
            return currentLifetimePoints >= minPoints && (maxPoints === null || currentLifetimePoints <= maxPoints)
          })

          if (matchingLevel) {
            membershipMultiplier = matchingLevel.multiplier
          }
        }
      }
    } catch (error) {
      console.error('Error fetching membership configuration:', error)
      // Default to 1.0 if configuration fetch fails
      membershipMultiplier = 1
    }

    totalPointsEarned = Math.floor(totalPointsEarned * membershipMultiplier)

    // Check for mission bonus
    let missionBonusPoints = 0
    let completedMissions = []

    if (active_missions && active_missions.length > 0) {
      for (const mission of active_missions) {
        const missionServiceId = mission.service_id
        const serviceMatches = !missionServiceId || service_ids.includes(missionServiceId)

        if (serviceMatches) {
          missionBonusPoints += mission.bonus_points
          completedMissions.push(mission)

          // Complete the mission
          await supabaseAdmin
            .from('user_missions')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', mission.user_mission_id)
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
      await supabaseAdmin
        .from('transaction_services')
        .insert({
          transaction_id: transaction.id,
          service_id: ts.service_id,
          price: ts.price,
          points_earned: ts.points_earned
        })
    }

    // Update customer points and membership
    const newAvailablePoints = customer.total_points + finalPointsEarned
    const newLifetimePoints = (customer.lifetime_points || customer.total_points || 0) + finalPointsEarned
    
    // Membership level based on lifetime points
    const newMembershipLevel = newLifetimePoints >= 1000 ? 'Gold' : 
                              newLifetimePoints >= 500 ? 'Silver' : 'Bronze'

    await supabaseAdmin
      .from('users')
      .update({
        total_points: newAvailablePoints,
        lifetime_points: newLifetimePoints,
        membership_level: newMembershipLevel,
        total_visits: customer.total_visits + 1,
        total_spent: customer.total_spent + totalAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)

    // Add to points history
    let description = 'Transaction: ' + services.map(s => s.name).join(', ')
    if (completedMissions.length > 0) {
      description += ` + Missions: ${completedMissions.map(m => m.title).join(', ')}`
    }

    await supabaseAdmin
      .from('points_history')
      .insert({
        user_id,
        transaction_id: transaction.id,
        points_change: finalPointsEarned,
        balance_after: newAvailablePoints,
        type: 'earn',
        description
      })

    return NextResponse.json({
      transaction,
      customer: {
        ...customer,
        total_points: newAvailablePoints,
        lifetime_points: newLifetimePoints,
        membership_level: newMembershipLevel
      },
      missions_completed: completedMissions,
      mission_bonus_points: missionBonusPoints,
      message: completedMissions.length > 0 
        ? `Transaction completed! Missions completed: ${completedMissions.map(m => m.title).join(', ')}`
        : 'Transaction completed successfully!'
    })
  } catch (error) {
    console.error('Error in transaction API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}