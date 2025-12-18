'use client'

import { useEffect, useState } from 'react'
import { Customer } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { Badge } from '@/components/shared/Badge'
import { supabase } from '@/lib/supabase-frontend'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipLevel: 'Bronze',
    initialPoints: '0'
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    // Filter customers based on search
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform to Customer type
      const transformedCustomers: Customer[] = data.map(user => ({
        id: user.id,
        customer_id: user.id,
        name: user.full_name,
        phone: user.phone || '',
        email: user.email,
        full_name: user.full_name,
        total_points: user.total_points,
        membership_level: user.membership_level as any,
        total_visits: user.total_visits,
        total_spent: user.total_spent,
        qr_code: user.qr_code,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_visit: user.updated_at
      }))

      setCustomers(transformedCustomers)
      setFilteredCustomers(transformedCustomers)

      // Calculate stats
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const newCustomers = transformedCustomers.filter(c =>
        new Date(c.created_at) > thirtyDaysAgo
      ).length

      const activeCustomers = transformedCustomers.filter(c =>
        (c.total_visits || 0) > 0
      ).length

      setStats({
        total: transformedCustomers.length,
        active: activeCustomers,
        new: newCustomers
      })
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMembershipColor = (level: string) => {
    const colors = {
      Bronze: 'bg-[var(--secondary)]',
      Silver: 'bg-[var(--accent)]',
      Gold: 'bg-[var(--warning)]'
    }
    return colors[level as keyof typeof colors] || 'bg-[var(--surface-light)]'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from('users')
          .update({
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            membership_level: formData.membershipLevel,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCustomer.id)

        if (error) throw error
      } else {
        // Create new customer
        const { error } = await supabase
          .from('users')
          .insert({
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            membership_level: formData.membershipLevel,
            total_points: parseInt(formData.initialPoints),
            qr_code: `LOUVA_${formData.email.split('@')[0].toUpperCase()}_${Date.now()}`
          })

        if (error) throw error
      }

      // Reset form and refresh
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipLevel: 'Bronze',
        initialPoints: '0'
      })
      setShowAddModal(false)
      setEditingCustomer(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Failed to save customer')
    }
  }

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      membershipLevel: customer.membership_level,
      initialPoints: customer.total_points.toString()
    })
    setEditingCustomer(customer)
    setShowAddModal(true)
  }

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', customerId)

      if (error) throw error

      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer')
    }
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

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Customer Management</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[var(--secondary)] hover:bg-[var(--secondary-light)]"
        >
          + Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]">
            search
          </span>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
          <div className="text-xs text-[var(--text-muted)]">Total</div>
        </Card>

        <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--success)]">{stats.active}</div>
          <div className="text-xs text-[var(--text-muted)]">Active</div>
        </Card>

        <Card className="text-center p-4 bg-[var(--surface-light)] border-[var(--border)]">
          <div className="text-2xl font-bold text-[var(--warning)]">{stats.new}</div>
          <div className="text-xs text-[var(--text-muted)]">New</div>
        </Card>
      </div>

      {/* Customer List */}
      <div className="space-y-2">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="p-4 hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer"
          >
            <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-3 items-center">
              {/* Avatar */}
              <div className={`w-10 h-10 ${getMembershipColor(customer.membership_level)} rounded-lg overflow-hidden border border-white/30`}>
                {customer.email === 'sari.dewi@example.com' ? (
                  <img
                    src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                    alt={customer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-icons text-white text-lg">person</span>
                )}
              </div>

              {/* Name */}
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{customer.name}</h3>
                <p className="text-xs text-[var(--text-muted)] truncate">{customer.email}</p>
              </div>

              {/* Membership */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                customer.membership_level === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                customer.membership_level === 'Silver' ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {customer.membership_level}
              </span>

              {/* Points */}
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--success)] leading-5">
                  {customer.total_points.toLocaleString()}
                </div>
                <div className="text-xs text-[var(--text-muted)]">points</div>
                        </div>
          </div>

            {/* Details Below */}
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{customer.total_visits || 0} visits</span>
                <span>•</span>
                <span>Last: {formatDate(customer.last_visit || customer.updated_at || '')}</span>
                <span>•</span>
                <span>{customer.phone || 'No phone'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(customer)}
                  className="p-1.5 text-[var(--accent)] hover:bg-[var(--surface)] rounded transition-colors"
                >
                  <span className="material-icons text-lg">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="p-1.5 text-[var(--error)] hover:bg-[var(--surface)] rounded transition-colors"
                >
                  <span className="material-icons text-lg">delete</span>
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-16 text-center">
            <span className="material-icons text-6xl text-[var(--text-muted)] mb-4 block">search_off</span>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-[var(--text-muted)]">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first customer to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingCustomer(null)
          setFormData({
            name: '',
            email: '',
            phone: '',
            membershipLevel: 'Bronze',
            initialPoints: '0'
          })
        }}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
              disabled={!!editingCustomer} // Don't allow editing email for existing customers
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Membership Level
            </label>
            <select
              value={formData.membershipLevel}
              onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
              className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          {!editingCustomer && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Initial Points
              </label>
              <Input
                type="number"
                value={formData.initialPoints}
                onChange={(e) => setFormData({ ...formData, initialPoints: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          )}

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
              {editingCustomer ? 'Update' : 'Add'} Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}