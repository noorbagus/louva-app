'use client'

import { useState, useEffect } from 'react'
import { Customer, SelectedService } from '@/lib/types'
import { CustomerInfo } from './CustomerInfo'
import { ServiceSelector } from './ServiceSelector'
import { PaymentSelector } from './PaymentSelector'
import { Card } from '@/components/shared/Card'
import { clearCustomerCache } from '@/lib/cache'

interface TransactionFormProps {
  customer: Customer
}

export function TransactionForm({ customer }: TransactionFormProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [activeMissions, setActiveMissions] = useState<any[]>([])
  const [activeRewards, setActiveRewards] = useState<any[]>([])
  const [appliedRewards, setAppliedRewards] = useState<any[]>([])

  // Debug logging
  console.log('🔍 TransactionForm render:', {
    selectedServicesCount: selectedServices.length,
    selectedServices: selectedServices.map(s => ({ id: s.id, name: s.name, isMission: s.isMissionService })),
    activeMissionsCount: activeMissions.length
  })

  useEffect(() => {
    console.log('🔍 Loading missions from sessionStorage')
    const missionData = sessionStorage.getItem('scanned_missions')
    if (missionData) {
      const missions = JSON.parse(missionData)
      console.log('🔍 Missions found:', missions)
      setActiveMissions(missions)
      sessionStorage.removeItem('scanned_missions')
    }
  }, [])

  // Load customer's active rewards
  useEffect(() => {
    if (customer?.id) {
      fetchCustomerRewards()
    }
  }, [customer])

  const fetchCustomerRewards = async () => {
    try {
      const response = await fetch(`/api/scan/customer-rewards?customerId=${customer.id}`)
      if (response.ok) {
        const data = await response.json()
        setActiveRewards(data.activeRewards || [])
      }
    } catch (error) {
      console.error('Error fetching customer rewards:', error)
    }
  }

  const handleApplyReward = (reward: any) => {
    if (!appliedRewards.find(r => r.redemption_id === reward.redemption_id)) {
      setAppliedRewards([...appliedRewards, reward])
    }
  }

  const handleRemoveReward = (redemptionId: string) => {
    setAppliedRewards(appliedRewards.filter(r => r.redemption_id !== redemptionId))
  }

  const handleServiceToggle = (service: SelectedService) => {
    console.log('🔍 handleServiceToggle called with:', service)
    
    setSelectedServices(prev => {
      console.log('🔍 Previous selectedServices:', prev.map(s => s.id))
      
      const exists = prev.find(s => s.id === service.id)
      console.log('🔍 Service exists in selection:', !!exists)
      
      if (exists) {
        if (exists.isMissionService) {
          console.log('🔍 Preventing removal of mission service')
          alert('This service is required for an active mission and cannot be removed.')
          return prev
        }
        console.log('🔍 Removing service from selection')
        const newSelection = prev.filter(s => s.id !== service.id)
        console.log('🔍 New selection after removal:', newSelection.map(s => s.id))
        return newSelection
      } else {
        console.log('🔍 Adding service to selection')
        const newSelection = [...prev, service]
        console.log('🔍 New selection after addition:', newSelection.map(s => s.id))
        return newSelection
      }
    })
  }

  const calculateTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0)
  }

  const calculatePoints = () => {
    return selectedServices.reduce((sum, service) => sum + service.points, 0)
  }

  const calculateMissionBonus = () => {
    if (!activeMissions.length) return 0
    
    return activeMissions.reduce((total, mission) => {
      if (!mission.service_id || selectedServices.some(s => s.id === mission.service_id)) {
        return total + mission.bonus_points
      }
      return total
    }, 0)
  }

  const handleProcessTransaction = async () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service')
      return
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method')
      return
    }

    setProcessing(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: customer.id,
          service_ids: selectedServices.map(s => s.id),
          payment_method_id: selectedPaymentMethod,
          service_prices: selectedServices.map(s => s.price),
          active_missions: activeMissions,
          applied_rewards: appliedRewards, // Send applied rewards
          notes: notes || ''
        })
      })

      const data = await response.json()

      if (data.transaction) {
        clearCustomerCache()

        let message = `Transaction completed successfully!`

        if (appliedRewards.length > 0) {
          message += ` Used ${appliedRewards.length} reward(s). `
          if (data.customer.total_points > 0) {
            message += `Customer earned ${data.customer.total_points.toLocaleString()} total points.`
          } else {
            message += `No points earned (reward applied).`
          }
        } else {
          message += ` Customer earned ${data.customer.total_points.toLocaleString()} total points.`
        }

        if (data.mission_bonus_points > 0) {
          message += ` Bonus from missions: +${data.mission_bonus_points} points!`
        }

        alert(message)
        window.location.href = '/admin'
      } else {
        alert('Failed to process transaction: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Transaction error:', error)
      alert('Failed to process transaction')
    } finally {
      setProcessing(false)
    }
  }

  const totalAmount = calculateTotal()
  const totalPoints = calculatePoints()
  const missionBonus = calculateMissionBonus()
  const finalPoints = totalPoints + missionBonus

  return (
    <div className="space-y-6">


      <CustomerInfo customer={customer} />

      {activeMissions.length > 0 && (
        <Card className="bg-green-500/10 border-green-500/30 p-4">
          <h3 className="text-green-400 font-semibold mb-2">Active Missions</h3>
          {activeMissions.map((mission, index) => (
            <div key={index} className="text-sm text-green-300">
              "{mission.title}" - +{mission.bonus_points} bonus points
            </div>
          ))}
        </Card>
      )}

      {activeRewards.length > 0 && (
        <Card className="bg-purple-500/10 border-purple-500/30 p-4">
          <h3 className="text-purple-400 font-semibold mb-2">Customer's Active Rewards ({activeRewards.length})</h3>
          <div className="space-y-2">
            {activeRewards.map((reward) => {
              const isApplied = appliedRewards.find(r => r.redemption_id === reward.redemption_id)
              return (
                <div key={reward.redemption_id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-purple-300 font-medium">{reward.reward_name}</p>
                    <p className="text-xs text-purple-200/70">Redeemed with {reward.points_used} points</p>
                  </div>
                  {!isApplied ? (
                    <button
                      onClick={() => handleApplyReward(reward)}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveReward(reward.redemption_id)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {appliedRewards.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <p className="text-xs text-purple-300">
                ⚠️ Applied rewards: {appliedRewards.length} - No points will be earned for free services
              </p>
            </div>
          )}
        </Card>
      )}

      <ServiceSelector
        selectedServices={selectedServices}
        onServiceToggle={handleServiceToggle}
        activeMissions={activeMissions}
      />

      <PaymentSelector
        selectedMethod={selectedPaymentMethod}
        onMethodSelect={setSelectedPaymentMethod}
      />

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Payment Notes (Optional)
        </label>
        <textarea
          value={notes || (appliedRewards.length > 0
            ? `Applied rewards: ${appliedRewards.map(r => r.reward_name).join(', ')}`
            : ''
          )}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this transaction..."
          className="w-full p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none min-h-[100px] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>

      {totalAmount > 0 && (
        <Card className="bg-[var(--surface-lighter)] border-[var(--border)] p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal:</span>
              <span className="font-medium">Rp {totalAmount.toLocaleString()}</span>
            </div>
            {appliedRewards.length > 0 ? (
              <div className="flex justify-between text-purple-400">
                <span>Reward Applied:</span>
                <span className="font-semibold">-{totalPoints} pts (no earnings)</span>
              </div>
            ) : (
              <div className="flex justify-between text-[var(--success)]">
                <span>Service points:</span>
                <span className="font-semibold">+{totalPoints} pts</span>
              </div>
            )}
            {missionBonus > 0 && appliedRewards.length === 0 && (
              <div className="flex justify-between text-green-400">
                <span>Mission bonus:</span>
                <span className="font-semibold">+{missionBonus} pts</span>
              </div>
            )}
            <div className="h-px bg-[var(--border)] my-3"></div>
            <div className="flex justify-between text-lg font-bold text-[var(--text-primary)]">
              <span>Total:</span>
              <span>Rp {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[var(--success)]">
              <span>Total Points:</span>
              <span>{appliedRewards.length > 0 ? '0' : `+${finalPoints}`} pts</span>
            </div>
          </div>
        </Card>
      )}

      <button
        onClick={handleProcessTransaction}
        disabled={processing || selectedServices.length === 0 || !selectedPaymentMethod}
        className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all ${
          processing || selectedServices.length === 0 || !selectedPaymentMethod
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/25 border border-green-400'
        }`}
      >
        {processing ? 'Processing...' : 'Process Transaction'}
      </button>
    </div>
  )
}