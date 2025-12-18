'use client'

import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'

interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    description: string
    reward_points: number
    reward_type?: 'points' | 'service' | 'product'
    progress?: number
    target?: number
    start_date: string
    end_date: string
    is_active: boolean
    is_completed?: boolean
    image_url?: string
    difficulty?: 'easy' | 'medium' | 'hard'
  }
  onClick?: () => void
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const isCompleted = challenge.is_completed
  const isExpired = !challenge.is_active && new Date() > new Date(challenge.end_date)
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

  const progressPercent = challenge.target && challenge.progress
    ? Math.min((challenge.progress / challenge.target) * 100, 100)
    : 0

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500/20 border-green-500/30'
    if (isExpired) return 'bg-[var(--surface-light)] border-[var(--border)] opacity-60'
    return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
  }

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getStatusColor()}`}
      onClick={onClick}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>

      {/* Header */}
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          {/* Challenge Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-purple-400">emoji_events</span>
              <h3 className="font-semibold text-[var(--text-primary)]">
                {challenge.title}
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
              {challenge.description}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col gap-1">
            {isCompleted && (
              <Badge variant="success" className="text-xs">
                <span className="material-icons text-xs mr-1">check</span>
                Done
              </Badge>
            )}
            {isExpired && (
              <Badge variant="secondary" className="text-xs">
                Expired
              </Badge>
            )}
            {challenge.difficulty && (
              <Badge className={`text-xs ${getDifficultyColor()}`}>
                {challenge.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Reward */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full">
            <span className="material-icons text-purple-400 text-sm">card_giftcard</span>
            <span className="text-sm font-medium text-purple-400">
              +{challenge.reward_points} pts
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)] capitalize">
            {challenge.reward_type || 'points'} reward
          </span>
        </div>

        {/* Progress Bar */}
        {challenge.target && challenge.progress && !isCompleted && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Progress</span>
              <span>{challenge.progress}/{challenge.target}</span>
            </div>
            <div className="w-full bg-[var(--surface)] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Time Info */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <span className="material-icons text-xs">schedule</span>
            <span>
              {isCompleted ? 'Completed!' :
               isExpired ? 'Challenge ended' :
               daysLeft <= 7 ? `${daysLeft} days left` :
               `${new Date(challenge.start_date).toLocaleDateString()} - ${new Date(challenge.end_date).toLocaleDateString()}`
              }
            </span>
          </div>
          {!isCompleted && !isExpired && (
            <span className="material-icons text-[var(--accent)] text-sm">arrow_forward</span>
          )}
        </div>

        {/* Image */}
        {challenge.image_url && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={challenge.image_url}
              alt={challenge.title}
              className="w-full h-24 object-cover"
            />
          </div>
        )}
      </div>
    </Card>
  )
}