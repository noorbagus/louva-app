import { PAYMENT_METHODS, SERVICE_CATEGORIES } from './constants'

export type MembershipLevel = 'Bronze' | 'Silver' | 'Gold'
export type PaymentMethod = typeof PAYMENT_METHODS[number]['id']
export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES]

export interface Customer {
  id: string
  customer_id: string
  name: string
  phone: string
  email: string
  full_name?: string
  profile_url?: string
  total_points: number
  membership_level: MembershipLevel
  total_visits?: number
  total_spent?: number
  card_url?: string
  qr_code?: string
  created_at: string
  updated_at?: string
  last_visit?: string
}

export interface Admin {
  admin_id: string
  name: string
  phone: string
  email: string
  role: 'admin' | 'manager'
  created_at: string
}

export interface Service {
  service_id: string
  name: string
  category: ServiceCategory
  price: number
  point_multiplier: number
  description: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  transaction_id: string
  customer_id: string
  user_id?: string
  admin_id: string
  service_id?: string
  payment_method_id?: string
  payment_method?: PaymentMethod
  total_amount: number
  points_earned: number
  status: string
  staff_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Reward {
  reward_id: string
  name: string
  description: string
  points_required: number
  image_url?: string
  is_active: boolean
  expiry_date?: string
  created_at: string
  updated_at: string
}

export interface Redemption {
  redemption_id: string
  customer_id: string
  reward_id: string
  points_used: number
  status: 'pending' | 'claimed' | 'expired'
  redemption_date: string
  claimed_date?: string
  expiry_date?: string
  notes?: string
}

export interface QRData {
  customerId: string
  timestamp: string
  type: 'loyalty'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalCustomers: number
  todayRevenue: number
  monthlyRevenue: number
  averageRating: number
  recentTransactions: Transaction[]
  topServices: Array<{
    service: Service
    count: number
    revenue: number
  }>
}