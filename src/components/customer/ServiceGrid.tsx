'use client'

import { useState } from 'react'
import { Service } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { formatCurrency } from '@/lib/utils'

interface ServiceGridProps {
  services: Service[]
  onServiceClick?: (service: Service) => void
  selectedCategory?: string
}

export function ServiceGrid({ services, onServiceClick, selectedCategory }: ServiceGridProps) {
  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Hair': return '💇'
      case 'Treatment': return '🧖'
      case 'Nail Care': return '💅'
      default: return '✨'
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredServices.map((service) => (
        <Card
          key={service.service_id}
          variant="dark"
          className="cursor-pointer transition-all duration-200 hover:bg-[#243442] hover:transform hover:translateY(-2px) hover:shadow-lg relative overflow-hidden"
          onClick={() => onServiceClick?.(service)}
        >
          {/* Hover Effect Animation */}
          <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>

          <div className="aspect-square bg-gradient-to-br from-dark-700 to-dark-800 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-4xl transform transition-transform duration-200 hover:scale-110">
                {getServiceIcon(service.category)}
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 leading-tight">{service.name}</h3>

            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-400 font-semibold text-sm">
                {formatCurrency(service.price)}
              </span>
              <Badge variant="secondary" size="sm" className="text-xs">
                {service.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">
                +{Math.floor(service.price * service.point_multiplier / 1000)} pts
              </span>
              {service.point_multiplier > 1 && (
                <Badge variant="warning" size="sm" className="text-xs">
                  {service.point_multiplier}x
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}