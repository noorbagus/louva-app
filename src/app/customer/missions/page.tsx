'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'

const FIXED_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440001'

interface Mission {
  id: string
  title: string
  description: string
  bonus_points: number
  service_id?: string
  services?: {
    name: string
    min_price: number
    category: string
  }
  user_status: 'available' | 'active' | 'completed'
  expires_at?: string
  duration_days?: number
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      const response = await fetch(`/api/missions?user_id=${FIXED_CUSTOMER_ID}`)
      const data = await response.json()
      setMissions(data.missions || [])
    } catch (error) {
      console.error('Error fetching missions:', error)
    } finally {
      setLoading(false)
    }
  }

  const activateMission = async (missionId: string) => {
    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission_id: missionId,
          user_id: FIXED_CUSTOMER_ID
        })
      })

      if (response.ok) {
        fetchMissions()
        alert('Mission activated! Show your QR code to staff.')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to activate mission')
      }
    } catch (error) {
      alert('Failed to activate mission')
    }
  }

  const getMissionIcon = (title: string) => {
    if (title.includes('Datang')) return 'schedule'
    if (title.includes('Streak')) return 'local_fire_department'
    if (title.includes('Explorer')) return 'explore'
    if (title.includes('VIP')) return 'diamond'
    return 'emoji_events'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20'
      case 'active': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 'Expired'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto px-5 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="text-white">
              <i className="material-icons text-xl">arrow_back</i>
            </button>
            <h1 className="text-xl font-semibold">Missions & Challenges</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6">
        {/* Info Card */}
        <Card className="bg-[var(--surface-light)] border-[var(--border)] mb-6">
          <div className="p-4 text-center">
            <i className="material-icons text-3xl text-[var(--primary)] mb-2">info</i>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">How Missions Work</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Activate a mission, visit salon for the service, get bonus points!
            </p>
          </div>
        </Card>

        {/* Missions Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {missions.map((mission) => (
            <Card 
              key={mission.id}
              className={`p-4 transition-all duration-200 relative overflow-hidden ${
                mission.user_status === 'completed' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : mission.user_status === 'active'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-[var(--surface-light)] border-[var(--border)] hover:bg-[var(--surface-lighter)]'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <Badge 
                  className={`text-xs ${getStatusColor(mission.user_status)}`}
                >
                  {mission.user_status === 'active' ? 'Active' : 
                   mission.user_status === 'completed' ? 'Done' : 'Available'}
                </Badge>
              </div>

              {/* Mission Icon */}
              <div className="text-center mb-3">
                <i className={`material-icons text-3xl mb-2 ${
                  mission.user_status === 'completed' ? 'text-green-400' :
                  mission.user_status === 'active' ? 'text-blue-400' :
                  'text-[var(--primary)]'
                }`}>
                  {getMissionIcon(mission.title)}
                </i>
              </div>

              {/* Mission Info */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight">
                  {mission.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-tight">
                  {mission.description}
                </p>
                
                {/* Service Info */}
                {mission.services && (
                  <div className="text-xs text-[var(--text-muted)]">
                    {mission.services.name} - Rp {mission.services.min_price.toLocaleString()}
                  </div>
                )}

                {/* Points Reward */}
                <div className="text-center">
                  <span className="text-sm font-bold text-[var(--success)]">
                    +{mission.bonus_points} pts
                  </span>
                </div>

                {/* Timer for active missions */}
                {mission.user_status === 'active' && mission.expires_at && (
                  <div className="text-xs text-blue-400">
                    {formatTimeRemaining(mission.expires_at)}
                  </div>
                )}

                {/* Action Button */}
                {mission.user_status === 'available' && (
                  <Button
                    size="sm"
                    onClick={() => activateMission(mission.id)}
                    className="w-full mt-2 text-xs py-1.5"
                  >
                    Activate
                  </Button>
                )}
                
                {mission.user_status === 'active' && (
                  <div className="text-xs text-blue-400 mt-2 font-medium">
                    Show QR to staff!
                  </div>
                )}

                {mission.user_status === 'completed' && (
                  <div className="text-xs text-green-400 mt-2 font-medium">
                    ✓ Completed
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* QR Code Section */}
        <Card className="bg-[var(--surface-light)] border-[var(--border)] mt-6">
          <div className="p-4 text-center">
            <i className="material-icons text-2xl text-[var(--primary)] mb-2">qr_code_2</i>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">Ready to Scan?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Show your QR code to complete active missions
            </p>
            <Button 
              onClick={() => window.location.href = '/customer/qr'}
              className="w-full"
            >
              Show My QR Code
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}