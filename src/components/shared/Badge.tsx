import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'primary',
  size = 'md',
  children,
  className
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium'

  const variants = {
    primary: 'bg-primary-600/20 text-primary-400 border border-primary-600/30',
    secondary: 'bg-secondary-600/20 text-secondary-400 border border-secondary-600/30',
    success: 'bg-green-600/20 text-green-400 border border-green-600/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
    error: 'bg-red-600/20 text-red-400 border border-red-600/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm'
  }

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}