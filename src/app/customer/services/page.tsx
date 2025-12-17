'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { ServiceGrid } from '@/components/customer/ServiceGrid'
import { formatCurrency } from '@/lib/utils'
import { DEFAULT_SERVICES, SERVICE_CATEGORIES } from '@/lib/constants'
import type { Service } from '@/lib/types'

export default function CustomerServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mockServices: Service[] = DEFAULT_SERVICES.map((service, index) => ({
      service_id: `svc-${String(index + 1).padStart(3, '0')}`,
      name: service.name,
      category: service.category,
      price: service.price,
      point_multiplier: service.pointMultiplier,
      description: service.description,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    setServices(mockServices)
    setIsLoading(false)
  }, [])

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

        {/* Services by Category */}
        {Object.entries(SERVICE_CATEGORIES).map(([key, categoryName]) => {
          const categoryServices = services.filter(s => s.category === categoryName)
          if (selectedCategory !== 'all' && selectedCategory !== categoryName) return null
          
          return (
            <div key={key} className="service-category">
              <div className="category-title flex items-center gap-2 mb-4">
                <i className="material-icons text-xl text-[var(--primary)]">
                  {categoryName === 'Hair' ? 'content_cut' : 
                   categoryName === 'Treatment' ? 'spa' : 'colorize'}
                </i>
                <span className="font-semibold text-[var(--text-primary)]">{categoryName}</span>
              </div>
              <ServiceGrid services={categoryServices} />
            </div>
          )
        })}

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