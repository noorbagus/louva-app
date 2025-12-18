'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { ServiceGrid } from '@/components/customer/ServiceGrid'
import { formatCurrency } from '@/lib/utils'
import { SERVICE_CATEGORIES } from '@/lib/constants'
import type { Service } from '@/lib/types'

export default function CustomerServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?active_only=true')
      if (response.ok) {
        const data = await response.json()
        console.log('Services API response:', data) // Debug log
        
        // Handle different response formats
        let servicesList = data
        if (data.services) servicesList = data.services
        if (data.grouped) servicesList = data.services || []
        
        const transformedServices: Service[] = servicesList.map((s: any) => ({
          service_id: s.id,
          name: s.name,
          category: s.category,
          price: s.min_price || s.price || 0,
          point_multiplier: s.points_multiplier || s.point_multiplier || 1,
          description: s.description || '',
          is_active: s.is_active,
          created_at: s.created_at,
          updated_at: s.updated_at
        }))
        
        console.log('Transformed services:', transformedServices) // Debug log
        setServices(transformedServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'All', icon: 'star' },
    { id: SERVICE_CATEGORIES.HAIR, name: 'Hair', icon: 'content_cut' },
    { id: SERVICE_CATEGORIES.TREATMENT, name: 'Treatments', icon: 'spa' },
    { id: SERVICE_CATEGORIES.NAIL, name: 'Nail Care', icon: 'colorize' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Memuat layanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto px-5 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()} 
              className="text-white hover:text-white/80 transition-colors"
            >
              <i className="material-icons text-xl">arrow_back</i>
            </button>
            <h1 className="text-xl font-semibold">Services</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6 pb-28">
        {/* Category Filter */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-[var(--primary)]/20 border-[var(--primary)]/30 text-[var(--primary)]'
                  : 'bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-lighter)]'
                }
              `}
            >
              <i className="material-icons text-2xl mb-2">{category.icon}</i>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Card key={service.service_id} className="p-4 hover:shadow-lg transition-shadow bg-[var(--surface-light)] border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                    <i className="material-icons text-[var(--primary)]">
                      {service.category === 'Hair' ? 'content_cut' :
                       service.category === 'Treatment' ? 'spa' :
                       service.category === 'Nail Care' ? 'colorize' : 'spa'}
                    </i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{service.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {service.description || 'Professional service'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--primary)]">
                    Rp {(service.price || 0).toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {Math.floor((service.price || 0) * (service.point_multiplier || 1) / 1000)} pts
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <i className="material-icons text-6xl text-[var(--text-muted)] mb-4">spa</i>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Services Available</h3>
            <p className="text-[var(--text-secondary)]">Services are being updated. Please try again later.</p>
          </div>
        )}

        {/* Info Card */}
        <Card variant="glass" className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-light)]/10 border-[var(--primary)]/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <i className="material-icons text-2xl text-[var(--primary)]">info</i>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium mb-1">Cara Mendapatkan Poin</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Setiap pembelian layanan akan mendapatkan poin. Bronze: 1x/1000, Silver: 1.2x/1000, Gold: 1.5x/1000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}