import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent'

  const variants = {
    primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] hover:shadow-[0_8px_25px_rgba(74,139,194,0.4)] text-white focus:ring-[var(--primary)] shadow-[0_4px_15px_rgba(74,139,194,0.3)]',
    secondary: 'bg-[var(--secondary)] hover:bg-[var(--secondary-light)] text-white focus:ring-[var(--secondary)]',
    outline: 'border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-secondary)] hover:text-white focus:ring-[var(--primary)]',
    ghost: 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-light)] focus:ring-[var(--primary)]'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        variant === 'primary' && 'hover:transform hover:-translate-y-0.5',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}