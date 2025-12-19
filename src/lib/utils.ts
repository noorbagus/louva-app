import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd MMM yyyy', { locale: id })
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd MMM yyyy, HH:mm', { locale: id })
}

export function calculatePoints(amount: number, rate: number = 1000): number {
  return Math.floor(amount / rate)
}

export function getMembershipLevel(lifetimePoints: number): {
  level: 'Bronze' | 'Silver' | 'Gold'
  color: string
  bgColor: string
  textColor: string
} {
  if (lifetimePoints >= 1000) {
    return {
      level: 'Gold',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      textColor: 'text-yellow-400'
    }
  } else if (lifetimePoints >= 500) {
    return {
      level: 'Silver',
      color: 'text-gray-300',
      bgColor: 'bg-gray-300/20',
      textColor: 'text-gray-300'
    }
  } else {
    return {
      level: 'Bronze',
      color: 'text-amber-600',
      bgColor: 'bg-amber-600/20',
      textColor: 'text-amber-600'
    }
  }
}

export function getPointsToNextLevel(lifetimePoints: number): number {
  if (lifetimePoints >= 1000) return 0 // Gold is max level
  if (lifetimePoints >= 500) return 1000 - lifetimePoints // To Gold
  return 500 - lifetimePoints // To Silver
}

export function generateQRData(customerId: string): string {
  return JSON.stringify({
    customerId,
    timestamp: new Date().toISOString(),
    type: 'loyalty'
  })
}

export function parseQRData(qrData: string): {
  customerId: string
  timestamp: string
  type: string
} | null {
  try {
    const parsed = JSON.parse(qrData)
    if (parsed.type === 'loyalty' && parsed.customerId && parsed.timestamp) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function isQRValid(timestamp: string, expiryMinutes: number = 5): boolean {
  const qrTime = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - qrTime.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  return diffMinutes <= expiryMinutes
}