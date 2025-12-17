import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'glass'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl border transition-all duration-200'

  const variants = {
    default: 'bg-[var(--surface-light)] backdrop-blur-lg border-[var(--border)]',
    dark: 'bg-[var(--surface)] backdrop-blur-lg border-[var(--border)]',
    glass: 'bg-[var(--surface-light)]/50 backdrop-blur-lg border-[var(--border)]'
  }

  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        paddings[padding],
        'shadow-[0_2px_10px_var(--shadow)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]', className)}
      {...props}
    >
      {children}
    </div>
  )
}