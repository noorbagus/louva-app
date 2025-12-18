'use client'

import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'

interface MissionCardProps {
  mission: {
    id: string
    title: string
    description: string
    bonus_points: number
    service_name?: string
    service_price?: number
    progress?: number
    target?: number
    user_status: 'active' | 'completed' | 'available'
    expires_at?: string
    activated_at?: string
  }
  onClick?: () => void
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  const isCompleted = mission.user_status === 'completed'
  const isActive = mission.user_status === 'active'
  const isAvailable = mission.user_status === 'available'

  const progressPercent = mission.target && mission.progress
    ? Math.min((mission.progress / mission.target) * 100, 100)
    : 0

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500/20 border-green-500/30 text-green-400'
    if (isActive) return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    return 'bg-[var(--surface-light)] border-[var(--border)]'
  }

  const getStatusIcon = () => {
    if (isCompleted) return 'check_circle'
    if (isActive) return 'flag'
    return 'lock'
  }

  const getStatusText = () => {
    if (isCompleted) return 'Completed'
    if (isActive) return 'In Progress'
    return 'Locked'
  }

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getStatusColor()}`}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <Badge
          variant={isCompleted ? 'success' : isActive ? 'primary' : 'secondary'}
          className="text-xs font-medium flex items-center gap-1"
        >
          <span className="material-icons text-xs">{getStatusIcon()}</span>
          {getStatusText()}
        </Badge>
      </div>

      {/* Mission Content */}
      <div className="p-4">
        {/* Mission Title */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] mb-1 pr-16">
              {mission.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
              {mission.description}
            </p>
          </div>
        </div>

        {/* Bonus Points */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
            <span className="material-icons text-yellow-400 text-sm">stars</span>
            <span className="text-sm font-medium text-yellow-400">
              +{mission.bonus_points} pts
            </span>
          </div>
          {mission.service_name && (
            <span className="text-xs text-[var(--text-muted)]">
              {mission.service_name}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {mission.target && mission.progress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Progress</span>
              <span>{mission.progress}/{mission.target}</span>
            </div>
            <div className="w-full bg-[var(--surface)] rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Time Info */}
        {mission.expires_at && isActive && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <span className="material-icons text-xs">schedule</span>
            <span>Expires {new Date(mission.expires_at).toLocaleDateString()}</span>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-3 pt-3 border-t border-[var(--border)]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)">
              {isAvailable ? 'Tap to unlock' : isCompleted ? 'Mission completed!' : 'Continue progress'}
            </span>
            <span className="material-icons text-[var(--accent)] text-sm">arrow_forward</span>
          </div>
        </div>
      </div>
    </Card>
  )
}