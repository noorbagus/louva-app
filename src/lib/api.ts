// API Service Layer - Centralized API calls
import { handleApiError, isNetworkError } from './supabase-frontend'

// Base URL for API calls
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/api'
  : 'http://localhost:3000/api'

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error('Network error. Please check your connection.')
    }
    throw new Error(handleApiError(error))
  }
}

// Customer APIs
export const customerAPI = {
  // Get customer profile
  getProfile: () => apiRequest('/user/profile'),

  // Update customer profile
  updateProfile: (data: any) => apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Get customer points and history
  getPoints: () => apiRequest('/user/points'),

  // Get transaction history
  getTransactions: (userId?: string) => {
    const params = userId ? `?user_id=${userId}` : ''
    return apiRequest(`/transactions${params}`)
  },

  // Get available rewards
  getRewards: () => apiRequest('/rewards'),

  // Redeem reward
  redeemReward: (rewardId: string) => apiRequest('/rewards', {
    method: 'POST',
    body: JSON.stringify({ reward_id: rewardId }),
  }),

  // Get services
  getServices: () => apiRequest('/services'),

  // Verify QR code
  verifyQR: (qrCode: string) => apiRequest('/scan/verify', {
    method: 'POST',
    body: JSON.stringify({ qr_code: qrCode }),
  }),
}

// Admin APIs
export const adminAPI = {
  // Get dashboard statistics
  getDashboard: () => apiRequest('/admin/dashboard'),

  // Get customers
  getCustomers: (params?: { search?: string; membership?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.membership) searchParams.append('membership', params.membership)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const queryString = searchParams.toString()
    return apiRequest(`/admin/customers${queryString ? `?${queryString}` : ''}`)
  },

  // Create customer
  createCustomer: (data: any) => apiRequest('/admin/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update customer
  updateCustomer: (id: string, data: any) => apiRequest(`/admin/customers`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  }),

  // Delete customer
  deleteCustomer: (id: string) => apiRequest(`/admin/customers?id=${id}`, {
    method: 'DELETE',
  }),

  // Get all transactions
  getTransactions: () => apiRequest('/transactions'),

  // Create transaction
  createTransaction: (data: any) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get services for admin
  getServices: () => apiRequest('/services'),

  // Create service
  createService: (data: any) => apiRequest('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update service
  updateService: (data: any) => apiRequest('/services', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Delete service
  deleteService: (id: string) => apiRequest(`/services?id=${id}`, {
    method: 'DELETE',
  }),
}

// Utility API
export const utilityAPI = {
  // Test database connection
  testConnection: () => apiRequest('/test-connection'),
}

export default apiRequest