'use client'

import { useState, useEffect } from 'react'
import { Service, SelectedService } from '@/lib/types'
import { supabase } from '@/lib/supabase-frontend'

interface ServiceSelectorProps {
  selectedServices: SelectedService[]
  onServiceToggle: (service: SelectedService) => void
}

export function ServiceSelector({ selectedServices, onServiceToggle }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (error) throw error

      // Transform to match Service type
      const transformedServices = data.map(s => ({
        id: s.id,
        service_id: s.id,
        name: s.name,
        category: s.category as any,
        price: s.min_price,
        point_multiplier: s.points_multiplier,
        description: s.description || '',
        is_active: s.is_active,
        created_at: s.created_at
      }))

      setServices(transformedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceClick = (service: Service) => {
    const selectedService: SelectedService = {
      id: service.id,
      name: service.name,
      price: service.price,
      points: Math.floor(service.price / 1000 * service.point_multiplier)
    }
    onServiceToggle(selectedService)
  }

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId)
  }

  const groupServicesByCategory = (services: Service[]) => {
    return services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    }, {} as Record<string, Service[]>)
  }

  const categoryIcons = {
    'Hair': 'content_cut',
    'Treatment': 'spa',
    'Nail': 'colorize'
  }

  if (loading) {
    return <div className="animate-pulse space-y-3">Loading services...</div>
  }

  const groupedServices = groupServicesByCategory(services)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Select Services</h2>

      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="material-icons text-[var(--accent)] text-lg">
              {categoryIcons[category as keyof typeof categoryIcons] || 'spa'}
            </span>
            <h3 className="text-sm font-semibold text-[var(--accent)] uppercase">{category} Services</h3>
          </div>

          <div className="space-y-2">
            {categoryServices.map((service) => {
              const isSelected = isServiceSelected(service.id)
              const points = Math.floor(service.price / 1000 * service.point_multiplier)

              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className={`bg-[var(--surface-light)] border rounded-2xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--surface-lighter)]'
                      : 'border-[var(--border)] hover:bg-[var(--surface-lighter)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-[var(--text-primary)]">{service.name}</h4>
                      <p className="text-sm text-[var(--text-muted)]">
                        {service.min_price === service.max_price
                          ? `Rp ${service.price.toLocaleString()}`
                          : `Rp ${service.min_price?.toLocaleString()} - ${service.max_price?.toLocaleString()}`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[var(--success)]">+{points}</div>
                      <div className="text-xs text-[var(--text-muted)]">points</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}