'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { CustomerInfo } from '@/components/admin/CustomerInfo'
import { formatDate, formatCurrency } from '@/lib/utils'
import { User, Search, Plus, Edit, Trash2, X, CheckCircle } from 'lucide-react'
import type { Customer } from '@/lib/types'

// Mock data
const mockCustomers: Customer[] = [
  {
    customer_id: 'cust-001',
    name: 'Sari Dewi',
    phone: '+628123456789',
    email: 'sari.dewi@email.com',
    total_points: 2450,
    membership_level: 'Silver',
    created_at: '2024-01-15T10:00:00Z',
    last_visit: '2024-01-20T14:30:00Z'
  },
  {
    customer_id: 'cust-002',
    name: 'Maya Putri',
    phone: '+628987654321',
    email: 'maya.putri@email.com',
    total_points: 8750,
    membership_level: 'Gold',
    created_at: '2024-01-10T08:00:00Z',
    last_visit: '2024-01-21T16:20:00Z'
  },
  {
    customer_id: 'cust-003',
    name: 'Rina Indah',
    phone: '+628765432109',
    email: 'rina.indah@email.com',
    total_points: 560,
    membership_level: 'Bronze',
    created_at: '2024-01-05T14:30:00Z',
    last_visit: '2024-01-18T10:15:00Z'
  },
  {
    customer_id: 'cust-004',
    name: 'Linda Sari',
    phone: '+628234567890',
    email: 'linda.sari@email.com',
    total_points: 1890,
    membership_level: 'Silver',
    created_at: '2024-01-12T11:00:00Z',
    last_visit: '2024-01-19T13:45:00Z'
  },
  {
    customer_id: 'cust-005',
    name: 'Dewi Kartika',
    phone: '+628345678901',
    email: 'dewi.kartika@email.com',
    total_points: 320,
    membership_level: 'Bronze',
    created_at: '2024-01-18T09:30:00Z',
    last_visit: '2024-01-22T15:00:00Z'
  }
]

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers)
      setFilteredCustomers(mockCustomers)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
    setFilteredCustomers(filtered)
  }, [searchQuery, customers])

  const handleAddCustomer = () => {
    if (!newCustomerForm.name || !newCustomerForm.phone || !newCustomerForm.email) {
      alert('Please fill all fields')
      return
    }

    const newCustomer: Customer = {
      customer_id: `cust-${Date.now()}`,
      name: newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email,
      total_points: 0,
      membership_level: 'Bronze',
      created_at: new Date().toISOString(),
      last_visit: new Date().toISOString()
    }

    setCustomers([newCustomer, ...customers])
    setNewCustomerForm({ name: '', phone: '', email: '' })
    setIsAddModalOpen(false)
  }

  const handleEditCustomer = (customer: Customer) => {
    // For demo purposes, just show the customer info
    setSelectedCustomer(customer)
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.customer_id !== customerId))
    }
  }

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => {
      const lastVisit = new Date(c.last_visit || c.created_at)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastVisit > thirtyDaysAgo
    }).length,
    new: customers.filter(c => {
      const createdDate = new Date(c.created_at)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return createdDate > sevenDaysAgo
    }).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#93BEE1] mx-auto mb-4"></div>
          <p className="text-[#b0b8c1]">Loading customers...</p>
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
              <h1 className="text-xl font-semibold text-white">Customer Management</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#1B3B32] hover:bg-[#2d5548] text-white border-[#1B3B32]"
            >
              + Add
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card variant="dark" className="bg-[#1a2832]">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7785] w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="pl-10 bg-[#0a1620] border-[#2d3748] text-white placeholder-[#6b7785]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="dark" className="bg-[#1a2832] text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-[#93BEE1]">{customerStats.total}</p>
              <p className="text-xs text-[#6b7785] mt-1">Total</p>
            </CardContent>
          </Card>
          <Card variant="dark" className="bg-[#1a2832] text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-[#00d4aa]">{customerStats.active}</p>
              <p className="text-xs text-[#6b7785] mt-1">Active</p>
            </CardContent>
          </Card>
          <Card variant="dark" className="bg-[#1a2832] text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-[#ffa726]">{customerStats.new}</p>
              <p className="text-xs text-[#6b7785] mt-1">New</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        {selectedCustomer ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
                className="text-[#93BEE1] border-[#93BEE1]"
              >
                ← Back to List
              </Button>
              <h2 className="text-lg font-semibold text-white">Customer Details</h2>
            </div>
            <CustomerInfo
              customer={selectedCustomer}
              onEdit={() => alert('Edit functionality coming soon')}
              onDelete={() => {
                handleDeleteCustomer(selectedCustomer.customer_id)
                setSelectedCustomer(null)
              }}
            />
          </>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.customer_id}
                variant="dark"
                className="bg-[#1a2832] hover:bg-[#243442] transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#93BEE1] flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{customer.name}</h3>
                        <p className="text-[#6b7785] text-xs">
                          {customer.membership_level} • {customer.total_points.toLocaleString('id-ID')} pts • Last: {formatDate(customer.last_visit || customer.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => handleEditCustomer(customer)}
                        className="text-[#93BEE1] border-[#93BEE1] hover:bg-[#93BEE1]/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteCustomer(customer.customer_id)}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCustomers.length === 0 && (
              <Card variant="dark" className="bg-[#1a2832]">
                <CardContent className="text-center py-8">
                  <p className="text-[#6b7785]">No customers found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Name</label>
            <Input
              value={newCustomerForm.name}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
              placeholder="Enter customer name"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Phone</label>
            <Input
              value={newCustomerForm.phone}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
              placeholder="Enter phone number"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Email</label>
            <Input
              value={newCustomerForm.email}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
              placeholder="Enter email address"
              type="email"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCustomer}
              className="flex-1 bg-gradient-to-r from-[#93BEE1] to-[#7ba6d3]"
            >
              Add Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}