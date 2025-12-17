'use client'

import { useState } from 'react'
import { Service } from '@/lib/types'
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

  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'Hair Color': 'palette',
      'Hair Cut': 'content_cut', 
      'Haircut': 'content_cut',
      'Keratin Therapy': 'spa',
      'Scalp Detox': 'local_pharmacy',
      'Hair Treatment': 'spa',
      'Nail Art': 'colorize',
      'Manicure': 'brush',
      'Pedicure': 'brush',
      'Facial': 'face',
      'Massage': 'spa'
    }
    return iconMap[serviceName] || 'spa'
  }

  const formatPrice = (price: number, multiplier: number) => {
    if (multiplier > 1) {
      return `${formatCurrency(price)}+`
    }
    return formatCurrency(price)
  }

  return (
    <div className="services-grid">
      {filteredServices.map((service) => (
        <div
          key={service.service_id}
          className="service-grid-item"
          onClick={() => onServiceClick?.(service)}
        >
          <i className="material-icons service-icon">
            {getServiceIcon(service.name)}
          </i>
          <div className="service-title">{service.name}</div>
          <div className="service-price">
            {formatPrice(service.price, service.point_multiplier)}
          </div>
          <div className="service-points">
            {Math.floor(service.price * service.point_multiplier / 1000)} pts
          </div>
        </div>
      ))}
    </div>
  )
}