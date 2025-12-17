'use client'

import { useEffect, useState } from 'react'
import { Service } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { Badge } from '@/components/shared/Badge'
import { supabase } from '@/lib/supabase-frontend'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hair',
    description: '',
    minPrice: '',
    maxPrice: '',
    pointsMultiplier: '1.0'
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error

      // Transform to Service type
      const transformedServices: Service[] = data.map(service => ({
        id: service.id,
        service_id: service.id,
        name: service.name,
        category: service.category as any,
        price: service.min_price,
        point_multiplier: service.points_multiplier,
        description: service.description || '',
        is_active: service.is_active,
        created_at: service.created_at,
        updated_at: service.updated_at
      }))

      setServices(transformedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        min_price: parseFloat(formData.minPrice),
        max_price: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
        points_multiplier: parseFloat(formData.pointsMultiplier)
      }

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)

        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert(serviceData)

        if (error) throw error
      }

      // Reset form and refresh
      setFormData({
        name: '',
        category: 'Hair',
        description: '',
        minPrice: '',
        maxPrice: '',
        pointsMultiplier: '1.0'
      })
      setShowAddModal(false)
      setEditingService(null)
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      minPrice: service.price.toString(),
      maxPrice: '',
      pointsMultiplier: service.point_multiplier.toString()
    })
    setEditingService(service)
    setShowAddModal(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', serviceId)

      if (error) throw error

      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
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
    return (
      <div className="px-5 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    )
  }

  const groupedServices = groupServicesByCategory(services.filter(s => s.is_active))

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Service Management</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[var(--secondary)] hover:bg-[var(--secondary-light)]"
        >
          + Add Service
        </Button>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="material-icons text-[var(--accent)]">
                {categoryIcons[category as keyof typeof categoryIcons] || 'spa'}
              </span>
              <h2 className="text-sm font-semibold text-[var(--accent)] uppercase">
                {category} Services
              </h2>
            </div>

            <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)]">
              {categoryServices.map((service) => (
                <div key={service.id} className="p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)]">{service.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      {service.price.toLocaleString()}
                      {service.point_multiplier > 1 && (
                        <span className="ml-2">
                          • {service.point_multiplier}x points
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-[var(--accent)] hover:bg-[var(--surface)] rounded-lg transition-colors"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-[var(--error)] hover:bg-[var(--surface)] rounded-lg transition-colors"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingService(null)
          setFormData({
            name: '',
            category: 'Hair',
            description: '',
            minPrice: '',
            maxPrice: '',
            pointsMultiplier: '1.0'
          })
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Service Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Hair Treatment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              required
            >
              <option value="Hair">Hair</option>
              <option value="Treatment">Treatment</option>
              <option value="Nail">Nail Care</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Price (Rp)
            </label>
            <Input
              type="number"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
              placeholder="100000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Points Multiplier
            </label>
            <select
              value={formData.pointsMultiplier}
              onChange={(e) => setFormData({ ...formData, pointsMultiplier: e.target.value })}
              className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="1">1x (Standard)</option>
              <option value="1.2">1.2x (Silver)</option>
              <option value="1.5">1.5x (Gold)</option>
              <option value="2">2x (VIP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Service description..."
              rows={3}
              className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setShowAddModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}