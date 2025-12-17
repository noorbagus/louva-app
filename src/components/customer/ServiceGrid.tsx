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

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredServices.map((service) => (
        <Card
          key={service.service_id}
          variant="default"
          className="service-card cursor-pointer hover:shadow-glow"
          onClick={() => onServiceClick?.(service)}
        >
          <div className="aspect-square bg-gradient-to-br from-dark-700 to-dark-800 rounded-lg mb-3 flex items-center justify-center">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-4xl">💇‍♀️</div>
            )}
          </div>

          <h3 className="font-semibold text-dark-100 text-sm mb-1">{service.name}</h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-primary-400 font-semibold text-sm">
              {formatCurrency(service.price)}
            </span>
            <Badge variant="secondary" size="sm">
              {service.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-400">
              {Math.floor(service.price * service.point_multiplier / 1000)} poin
            </span>
            {service.point_multiplier > 1 && (
              <Badge variant="warning" size="sm">
                {service.point_multiplier}x
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}