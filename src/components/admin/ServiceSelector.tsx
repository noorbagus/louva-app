'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/shared/Card'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '@/lib/types'

interface ServiceSelectorProps {
  services: Service[]
  selectedServices: string[]
  onSelectionChange: (selectedIds: string[]) => void
  className?: string
}

export function ServiceSelector({
  services,
  selectedServices,
  onSelectionChange,
  className
}: ServiceSelectorProps) {
  const toggleService = (serviceId: string) => {
    const isSelected = selectedServices.includes(serviceId)
    let newSelected: string[]

    if (isSelected) {
      newSelected = selectedServices.filter(id => id !== serviceId)
    } else {
      newSelected = [...selectedServices, serviceId]
    }

    onSelectionChange(newSelected)
  }

  const calculatePoints = (service: Service) => {
    return Math.floor(service.price / 1000 * service.point_multiplier)
  }

  const selectedTotal = services
    .filter(s => selectedServices.includes(s.service_id))
    .reduce((sum, service) => sum + service.price, 0)

  const selectedPoints = services
    .filter(s => selectedServices.includes(s.service_id))
    .reduce((sum, service) => sum + calculatePoints(service), 0)

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Select Services</h3>
        <div className="flex justify-between text-sm">
          <span className="text-[#b0b8c1]">Selected: {selectedServices.length} services</span>
          <span className="text-[#93BEE1]">Total: {formatCurrency(selectedTotal)}</span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.service_id)
          const points = calculatePoints(service)

          return (
            <Card
              key={service.service_id}
              variant="dark"
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#93BEE1]/10 border-[#93BEE1]'
                  : 'hover:bg-[#243442]'
              }`}
              onClick={() => toggleService(service.service_id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{service.name}</h4>
                    <p className="text-[#6b7785] text-sm">{service.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-white font-semibold">{formatCurrency(service.price)}</p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <span className="text-[#00d4aa] text-sm font-medium">+{points}</span>
                      <span className="text-[#6b7785] text-xs">pts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedServices.length > 0 && (
        <Card variant="glass" className="mt-4 bg-[#243442]">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#b0b8c1]">Subtotal</span>
                <span className="text-white">{formatCurrency(selectedTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#b0b8c1]">Points to Earn</span>
                <span className="text-[#00d4aa]">+{selectedPoints} pts</span>
              </div>
              <div className="border-t border-[#2d3748] pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold text-lg">{formatCurrency(selectedTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}