'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { formatCurrency } from '@/lib/utils'
import { DEFAULT_SERVICES, SERVICE_CATEGORIES } from '@/lib/constants'
import { Plus, Edit, Trash2, X, Search, Spa, ContentCut, Colorize } from 'lucide-react'
import type { Service } from '@/lib/types'

// Mock data
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

const categoryIcons = {
  [SERVICE_CATEGORIES.HAIR]: <ContentCut className="w-5 h-5" />,
  [SERVICE_CATEGORIES.TREATMENT]: <Spa className="w-5 h-5" />,
  [SERVICE_CATEGORIES.NAIL]: <Colorize className="w-5 h-5" />
}

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category: SERVICE_CATEGORIES.HAIR,
    price: '',
    point_multiplier: 1,
    description: ''
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices)
      setFilteredServices(mockServices)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = services

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredServices(filtered)
  }, [searchQuery, selectedCategory, services])

  const handleSaveService = () => {
    if (!newServiceForm.name || !newServiceForm.price) {
      alert('Please fill in required fields')
      return
    }

    const price = parseInt(newServiceForm.price)
    const multiplier = parseFloat(newServiceForm.point_multiplier.toString())

    if (editingService) {
      // Update existing service
      setServices(services.map(s =>
        s.service_id === editingService.service_id
          ? {
              ...s,
              name: newServiceForm.name,
              category: newServiceForm.category,
              price,
              point_multiplier: multiplier,
              description: newServiceForm.description,
              updated_at: new Date().toISOString()
            }
          : s
      ))
    } else {
      // Add new service
      const newService: Service = {
        service_id: `svc-${Date.now()}`,
        name: newServiceForm.name,
        category: newServiceForm.category,
        price,
        point_multiplier: multiplier,
        description: newServiceForm.description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setServices([newService, ...services])
    }

    // Reset form
    setNewServiceForm({
      name: '',
      category: SERVICE_CATEGORIES.HAIR,
      price: '',
      point_multiplier: 1,
      description: ''
    })
    setEditingService(null)
    setIsAddModalOpen(false)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setNewServiceForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      point_multiplier: service.point_multiplier,
      description: service.description
    })
    setIsAddModalOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.service_id !== serviceId))
    }
  }

  const handleEditClick = (e: React.MouseEvent, service: Service) => {
    e.stopPropagation()
    handleEditService(service)
  }

  const handleDeleteClick = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation()
    handleDeleteService(serviceId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#93BEE1] mx-auto mb-4"></div>
          <p className="text-[#b0b8c1]">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A8BC2] to-[#5A9BD4] sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-white hover:text-[#93BEE1]">
                ←
              </Link>
              <h1 className="text-xl font-semibold text-white">Service Management</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditingService(null)
                setIsAddModalOpen(true)
              }}
              className="bg-[#1B3B32] hover:bg-[#2d5548] text-white border-[#1B3B32]"
            >
              + Add
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex bg-[#1a2832] rounded-lg p-1">
          {[
            { id: 'all', name: 'All', icon: '⭐' },
            { id: SERVICE_CATEGORIES.HAIR, name: 'Hair', icon: '💇' },
            { id: SERVICE_CATEGORIES.TREATMENT, name: 'Treatments', icon: '🧖' },
            { id: SERVICE_CATEGORIES.NAIL, name: 'Nail Care', icon: '💅' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-[#93BEE1] text-white'
                  : 'text-[#b0b8c1] hover:text-white hover:bg-[#243442]'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <Card variant="dark" className="bg-[#1a2832]">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7785] w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="pl-10 bg-[#0a1620] border-[#2d3748] text-white placeholder-[#6b7785]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service List */}
        {Object.values(SERVICE_CATEGORIES).map((category) => {
          const categoryServices = filteredServices.filter(s => s.category === category)
          if (categoryServices.length === 0) return null

          return (
            <div key={category} className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-2">
                {categoryIcons[category]}
                <span className="text-[#93BEE1] font-semibold">{category}</span>
              </div>
              <div className="space-y-2">
                {categoryServices.map((service) => {
                  const minPrice = service.price
                  const maxPrice = service.price * 1.5 // Assume range for demo
                  const pointsRange = `${Math.floor(minPrice / 1000)}-${Math.floor(maxPrice / 1000)}`

                  return (
                    <Card
                      key={service.service_id}
                      variant="dark"
                      className="bg-[#1a2832] hover:bg-[#243442] transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{service.name}</h3>
                            <p className="text-[#6b7785] text-sm">
                              Rp {formatCurrency(minPrice)} - {formatCurrency(maxPrice)} • {pointsRange} pts
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<Edit className="w-4 h-4" />}
                              onClick={(e) => handleEditClick(e, service)}
                              className="text-[#93BEE1] border-[#93BEE1] hover:bg-[#93BEE1]/10"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={(e) => handleDeleteClick(e, service.service_id)}
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredServices.length === 0 && (
          <Card variant="dark" className="bg-[#1a2832]">
            <CardContent className="text-center py-8">
              <p className="text-[#6b7785]">No services found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingService(null)
          setNewServiceForm({
            name: '',
            category: SERVICE_CATEGORIES.HAIR,
            price: '',
            point_multiplier: 1,
            description: ''
          })
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Service Name</label>
            <Input
              value={newServiceForm.name}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
              placeholder="e.g. Hair Treatment"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Category</label>
            <select
              value={newServiceForm.category}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value as any })}
              className="w-full bg-[#0a1620] border-[#2d3748] rounded-lg px-4 py-3 text-white"
            >
              <option value={SERVICE_CATEGORIES.HAIR}>Hair Services</option>
              <option value={SERVICE_CATEGORIES.TREATMENT}>Treatments</option>
              <option value={SERVICE_CATEGORIES.NAIL}>Nail Care</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Min Price (Rp)</label>
              <Input
                value={newServiceForm.price}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                placeholder="100000"
                type="number"
                className="bg-[#0a1620] border-[#2d3748]"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">Max Price (Rp)</label>
              <Input
                value={newServiceForm.price ? (parseInt(newServiceForm.price) * 1.5).toString() : ''}
                readOnly
                className="bg-[#243442] border-[#2d3748] text-[#6b7785]"
              />
            </div>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Points Formula</label>
            <select
              value={newServiceForm.point_multiplier}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, point_multiplier: parseFloat(e.target.value) })}
              className="w-full bg-[#0a1620] border-[#2d3748] rounded-lg px-4 py-3 text-white"
            >
              <option value={1}>1 point per 1000 IDR (Standard)</option>
              <option value={1.2}>1.2 points per 1000 IDR (Premium)</option>
              <option value={1.5}>1.5 points per 1000 IDR (VIP)</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={newServiceForm.description}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
              placeholder="Service description..."
              className="w-full bg-[#0a1620] border-[#2d3748] rounded-lg px-4 py-3 text-white placeholder-[#6b7785] resize-vertical h-20"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false)
                setEditingService(null)
                setNewServiceForm({
                  name: '',
                  category: SERVICE_CATEGORIES.HAIR,
                  price: '',
                  point_multiplier: 1,
                  description: ''
                })
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveService}
              className="flex-1 bg-gradient-to-r from-[#93BEE1] to-[#7ba6d3]"
            >
              {editingService ? 'Update' : 'Save'} Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}