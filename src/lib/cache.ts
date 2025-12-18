// Cache utility for customer data with real-time invalidation
const CACHE_DURATION = 60000 // 1 minute
const BACKGROUND_REFRESH_INTERVAL = 30000 // 30 seconds

export const cache = {
  set: (key: string, data: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Cache set failed:', error)
    }
  },
  
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null
      
      const { data, timestamp } = JSON.parse(cached)
      const isExpired = Date.now() - timestamp > CACHE_DURATION
      
      return isExpired ? null : data
    } catch (error) {
      console.warn('Cache get failed:', error)
      return null
    }
  },

  clear: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Cache clear failed:', error)
    }
  },

  clearAll: () => {
    if (typeof window === 'undefined') return
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('customer-') || key.startsWith('admin-')
      )
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Cache clearAll failed:', error)
    }
  }
}

// Cache keys
export const CACHE_KEYS = {
  CUSTOMER_DATA: 'customer-data',
  CUSTOMER_POINTS: 'customer-points', 
  ADMIN_DASHBOARD: 'admin-dashboard',
  SERVICES: 'services-data'
}

// Clear customer cache after transactions
export const clearCustomerCache = () => {
  cache.clear(CACHE_KEYS.CUSTOMER_DATA)
  cache.clear(CACHE_KEYS.CUSTOMER_POINTS)
}