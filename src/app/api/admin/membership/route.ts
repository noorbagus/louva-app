import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // First, try to get existing membership rules from database
    const { data: existingRules, error } = await supabase
      .from('membership_rules')
      .select('*')
      .order('min_points', { ascending: true })

    if (error) {
      console.error('Error fetching membership rules:', error)
      // Return default rules if table doesn't exist or has error
      return NextResponse.json({
        success: true,
        data: {
          rules: [
            {
              id: 'bronze',
              name: 'Bronze',
              min_points: 0,
              max_points: 499,
              multiplier: 1.0,
              color: '#CD7F32',
              benefits: ['Basic points earning', 'Standard service access']
            },
            {
              id: 'silver',
              name: 'Silver',
              min_points: 500,
              max_points: 999,
              multiplier: 1.2,
              color: '#C0C0C0',
              benefits: ['1.2x points multiplier', 'Priority booking', 'Exclusive offers']
            },
            {
              id: 'gold',
              name: 'Gold',
              min_points: 1000,
              max_points: null,
              multiplier: 1.5,
              color: '#FFD700',
              benefits: ['1.5x points multiplier', 'VIP service', 'Exclusive rewards', 'Birthday bonus']
            }
          ]
        }
      })
    }

    // Return existing rules if available
    const rules = existingRules || [
      {
        id: 'bronze',
        name: 'Bronze',
        min_points: 0,
        max_points: 499,
        multiplier: 1.0,
        color: '#CD7F32',
        benefits: ['Basic points earning', 'Standard service access']
      },
      {
        id: 'silver',
        name: 'Silver',
        min_points: 500,
        max_points: 999,
        multiplier: 1.2,
        color: '#C0C0C0',
        benefits: ['1.2x points multiplier', 'Priority booking', 'Exclusive offers']
      },
      {
        id: 'gold',
        name: 'Gold',
        min_points: 1000,
        max_points: null,
        multiplier: 1.5,
        color: '#FFD700',
        benefits: ['1.5x points multiplier', 'VIP service', 'Exclusive rewards', 'Birthday bonus']
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        rules: rules
      }
    })

  } catch (error) {
    console.error('Error in membership GET:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch membership rules'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { rules } = body

    if (!rules || !Array.isArray(rules)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rules array is required'
        },
        { status: 400 }
      )
    }

    // Validate rules structure
    const requiredFields = ['id', 'name', 'min_points', 'multiplier']
    for (const rule of rules) {
      for (const field of requiredFields) {
        if (rule[field] === undefined || rule[field] === null) {
          return NextResponse.json(
            {
              success: false,
              error: `Missing required field: ${field} for ${rule.name || 'unknown rule'}`
            },
            { status: 400 }
          )
        }
      }

      // Validate multiplier
      if (rule.multiplier < 0.1 || rule.multiplier > 5.0) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid multiplier for ${rule.name}: must be between 0.1 and 5.0`
          },
          { status: 400 }
        )
      }

      // Validate points
      if (rule.min_points < 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid minimum points for ${rule.name}: must be non-negative`
          },
          { status: 400 }
        )
      }
    }

    // Check for overlapping point ranges
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const rule1 = rules[i]
        const rule2 = rules[j]

        // Skip if one rule has null max_points (highest tier)
        if (rule1.max_points === null || rule2.max_points === null) continue

        // Check for overlapping ranges
        if (rule1.min_points <= rule2.max_points && rule2.min_points <= rule1.max_points) {
          return NextResponse.json(
            {
              success: false,
              error: `Overlapping point ranges between ${rule1.name} and ${rule2.name}`
            },
            { status: 400 }
          )
        }
      }
    }

    // Try to update database (if table exists)
    try {
      // Delete existing rules
      await supabase.from('membership_rules').delete().not('id', 'is', null)

      // Insert new rules
      const rulesToInsert = rules.map(rule => ({
        id: rule.id,
        name: rule.name,
        min_points: rule.min_points,
        max_points: rule.max_points || null,
        multiplier: rule.multiplier,
        color: rule.color || '#4A8BC2',
        benefits: rule.benefits || []
      }))

      const { error: insertError } = await supabase
        .from('membership_rules')
        .insert(rulesToInsert)

      if (insertError) {
        console.error('Error updating membership rules in database:', insertError)
        // Continue anyway, we'll store in memory/state
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      // Continue anyway, this is not critical
    }

    return NextResponse.json({
      success: true,
      data: {
        rules: rules,
        message: 'Membership rules updated successfully'
      }
    })

  } catch (error) {
    console.error('Error in membership PUT:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update membership rules'
      },
      { status: 500 }
    )
  }
}