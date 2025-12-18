'use client'

import { useState, useEffect } from 'react'
import { Service, SelectedService } from '@/lib/types'
import { supabase } from '@/lib/supabase-frontend'

interface ServiceSelectorProps {
  selectedServices: SelectedService[]
  onServiceToggle: (service: SelectedService) => void
  activeMissions?: any[]
}

export function ServiceSelector({ selectedServices, onServiceToggle, activeMissions = [] }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Debug logs
  console.log('🔍 ServiceSelector render:', {
    selectedServicesCount: selectedServices.length,
    selectedServiceIds: selectedServices.map(s => s.id),
    activeMissionsCount: activeMissions.length,
    servicesCount: services.length
  })

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

const transformedServices = data.map(s => ({
  id: s.id,              // ← Fixed: use s.id instead of s.service_id
  service_id: s.id,      // ← Fixed: use s.id instead of s.service_id
  name: s.name,
  category: s.category as any,
  price: s.min_price,
  point_multiplier: s.points_multiplier,
  description: s.description || '',
  is_active: s.is_active,
  created_at: s.created_at,
  updated_at: s.updated_at || new Date().toISOString()
}))

      console.log('🔍 Services fetched:', transformedServices.length)
      setServices(transformedServices as any)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceClick = (service: Service) => {
    console.log('🔍 Service clicked:', {
      serviceId: service.service_id,
      serviceName: service.name,
      currentlySelected: selectedServices.some(s => s.id === service.service_id),
      isMissionService: activeMissions.some(m => m.service_id === service.service_id)
    })

    const selectedService: SelectedService = {
      id: service.service_id,
      name: service.name,
      price: service.price,
      points: Math.floor(service.price / 1000 * service.point_multiplier),
      isMissionService: activeMissions.some(m => m.service_id === service.service_id)
    }

    console.log('🔍 Calling onServiceToggle with:', selectedService)
    onServiceToggle(selectedService)
  }

  const isServiceSelected = (serviceId: string) => {
    const selected = selectedServices.some(s => s.id === serviceId)
    console.log(`🔍 isServiceSelected(${serviceId}):`, selected)
    return selected
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
    'Nail Care': 'colorize',
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
              const isSelected = isServiceSelected(service.service_id)
              const points = Math.floor(service.price / 1000 * service.point_multiplier)
              const serviceId = service.service_id
              const missionForService = activeMissions.find(m => m.service_id === serviceId)

              return (
                <div
                  key={serviceId}
                  onClick={() => {
                    console.log('🔍 DIV clicked for service:', serviceId)
                    handleServiceClick(service)
                  }}
                  className={`bg-[var(--surface-light)] border rounded-2xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--surface-lighter)]'
                      : 'border-[var(--border)] hover:bg-[var(--surface-lighter)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-[var(--text-primary)]">{service.name}</h4>
                        {missionForService && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                            🎯 +{missionForService.bonus_points}
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">SELECTED</span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-muted)]">
                        Rp {service.price.toLocaleString()}
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