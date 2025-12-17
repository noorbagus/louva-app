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
    // Simulate API call
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
    { id: 'all', name: 'Semua', icon: '⭐' },
    { id: SERVICE_CATEGORIES.HAIR, name: 'Hair', icon: '💇' },
    { id: SERVICE_CATEGORIES.TREATMENT, name: 'Treatment', icon: '🧖' },
    { id: SERVICE_CATEGORIES.NAIL, name: 'Nail Care', icon: '💅' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Memuat layanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="bg-dark-800/50 backdrop-blur-lg border-b border-dark-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/customer" className="text-dark-300 hover:text-dark-100">
              ←
            </a>
            <h1 className="text-xl font-semibold text-dark-100">Layanan Kami</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Category Filter */}
        <Card variant="glass">
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200
                    ${selectedCategory === category.id
                      ? 'bg-primary-600/20 border border-primary-600/30'
                      : 'bg-dark-700/30 border border-dark-600/30 hover:bg-dark-700/50'
                    }
                  `}
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-xs text-dark-300">{category.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-dark-100">
              {categories.find(c => c.id === selectedCategory)?.name || 'Semua Layanan'}
            </h2>
            <Badge variant="secondary">
              {filteredServices.length} layanan
            </Badge>
          </div>

          {filteredServices.length > 0 ? (
            <ServiceGrid services={filteredServices} />
          ) : (
            <Card variant="dark">
              <CardContent className="text-center py-8">
                <p className="text-dark-400">Tidak ada layanan di kategori ini</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <Card variant="glass" className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div className="flex-1">
                <h3 className="text-dark-100 font-medium mb-1">Cara Mendapatkan Poin</h3>
                <p className="text-dark-300 text-sm">
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