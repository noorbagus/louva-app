'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
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
      const response = await fetch('/api/admin/services?active=true')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
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
        {/* Category Filter - Square Grid */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                aspect-square
                ${selectedCategory === category.id
                  ? 'bg-[var(--primary)]/20 border-[var(--primary)]/30 text-[var(--primary)]'
                  : 'bg-[var(--surface-light)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-lighter)]'
                }
              `}
            >
              <i className="material-icons text-2xl mb-2">{category.icon}</i>
              <span className="text-xs font-medium text-center leading-tight">{category.name}</span>
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
                   categoryName === 'Treatment' ? 'spa' : 
                   categoryName === 'Nail Care' ? 'colorize' : 'spa'}
                </i>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{categoryName}</h2>
              </div>
              
              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {categoryServices.map((service) => (
                    <Card key={service.service_id} className="p-4 hover:shadow-lg transition-shadow">
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
                            {Math.floor((service.price || 0) / 1000)} pts
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="material-icons text-4xl text-[var(--text-muted)] mb-2">spa</i>
                  <p className="text-[var(--text-muted)]">No services available in this category</p>
                </div>
              )}
            </div>
          )
        })}

        {/* No Services Message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <i className="material-icons text-6xl text-[var(--text-muted)] mb-4">spa</i>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Services Found</h3>
            <p className="text-[var(--text-muted)]">
              {selectedCategory === 'all' 
                ? 'No services are currently available'
                : `No services available in ${categories.find(c => c.id === selectedCategory)?.name} category`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}