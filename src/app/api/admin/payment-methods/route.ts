import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct supabase client creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabase
      .from('payment_methods')
      .select('*')
      .order('type', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: paymentMethods, error } = await query

    if (error) {
      console.error('Error fetching payment methods:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected PaymentMethodConfig interface
    const transformedMethods = paymentMethods.map(method => ({
      id: method.id,
      name: method.name,
      type: method.type,
      bank: method.bank || undefined,
      icon: getPaymentIcon(method.type, method.bank),
      is_active: method.is_active,
      created_at: method.created_at
    }))

    return NextResponse.json(transformedMethods)
  } catch (error) {
    console.error('Error in payment methods API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, bank, is_active = true } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    const icon = getPaymentIcon(type, bank)

    const { data: paymentMethod, error } = await supabaseAdmin
      .from('payment_methods')
      .insert([{
        name,
        type,
        bank,
        icon,
        is_active
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating payment method:', error)
      return NextResponse.json(
        { error: 'Failed to create payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method created successfully'
    })
  } catch (error) {
    console.error('Error in payment methods POST API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, type, bank, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (bank !== undefined) updateData.bank = bank
    if (is_active !== undefined) updateData.is_active = is_active

    // Update icon if type or bank changed
    if (type !== undefined || bank !== undefined) {
      updateData.icon = getPaymentIcon(type, bank)
    }

    updateData.updated_at = new Date().toISOString()

    const { data: paymentMethod, error } = await supabaseAdmin
      .from('payment_methods')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment method:', error)
      return NextResponse.json(
        { error: 'Failed to update payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method updated successfully'
    })
  } catch (error) {
    console.error('Error in payment methods PUT API:', error)
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
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    // Soft delete by setting is_active to false
    const { data: paymentMethod, error } = await supabaseAdmin
      .from('payment_methods')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting payment method:', error)
      return NextResponse.json(
        { error: 'Failed to delete payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method deleted successfully'
    })
  } catch (error) {
    console.error('Error in payment methods DELETE API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get payment icon based on type and bank
function getPaymentIcon(type: string, bank?: string | null): string {
  const icons: Record<string, string> = {
    cash: 'payments',
    qris: 'qr_code_2',
    debit: 'credit_card',
    credit: 'credit_card',
    transfer: 'account_balance',
    ewallet: 'phone_android',
    bank: 'account_balance'
  }
  
  // Special cases for specific banks
  if (bank) {
    const bankIcons: Record<string, string> = {
      bca: 'credit_card',
      mandiri: 'credit_card',
      bni: 'credit_card',
      bri: 'credit_card',
      gopay: 'phone_android',
      ovo: 'phone_android',
      dana: 'phone_android',
      shopeepay: 'phone_android'
    }
    
    const bankKey = bank.toLowerCase()
    if (bankIcons[bankKey]) {
      return bankIcons[bankKey]
    }
  }
  
  return icons[type] || 'payments'
}