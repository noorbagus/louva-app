'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import {
  Person,
  Settings,
  Storage,
  Notifications,
  Security,
  Help,
  Info,
  LogOut,
  ChevronRight,
  Download,
  Upload,
  Delete,
  Check,
  X,
  Shield,
  Speed,
  Palette,
  Language,
  Wifi,
  Database
} from 'lucide-react'

export default function SettingsPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [notification, setNotification] = useState('')

  const [profileForm, setProfileForm] = useState({
    name: 'Maya Sari',
    email: 'maya@louva.com',
    phone: '+628123456789',
    role: 'Salon Manager'
  })

  const settingsSections = [
    {
      title: 'Account',
      icon: <Person className="w-5 h-5" />,
      items: [
        {
          label: 'Edit Profile',
          description: 'Update your account information',
          icon: <Person className="w-4 h-4" />,
          action: () => setIsProfileModalOpen(true),
          badge: null
        },
        {
          label: 'Change Password',
          description: 'Update your password',
          icon: <Security className="w-4 h-4" />,
          action: () => alert('Change password functionality coming soon'),
          badge: null
        }
      ]
    },
    {
      title: 'Application',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          label: 'General Settings',
          description: 'App preferences and configurations',
          icon: <Settings className="w-4 h-4" />,
          action: () => alert('General settings coming soon'),
          badge: null
        },
        {
          label: 'Notifications',
          description: 'Manage notification preferences',
          icon: <Notifications className="w-4 h-4" />,
          action: () => alert('Notification settings coming soon'),
          badge: 'On'
        },
        {
          label: 'Appearance',
          description: 'Theme and display options',
          icon: <Palette className="w-4 h-4" />,
          action: () => alert('Appearance settings coming soon'),
          badge: 'Dark'
        },
        {
          label: 'Language',
          description: 'Select your preferred language',
          icon: <Language className="w-4 h-4" />,
          action: () => alert('Language settings coming soon'),
          badge: 'English'
        }
      ]
    },
    {
      title: 'Data Management',
      icon: <Storage className="w-5 h-5" />,
      items: [
        {
          label: 'Export Data',
          description: 'Download all customer and transaction data',
          icon: <Download className="w-4 h-4" />,
          action: () => handleExportData(),
          badge: null
        },
        {
          label: 'Import Data',
          description: 'Import data from previous system',
          icon: <Upload className="w-4 h-4" />,
          action: () => alert('Import functionality coming soon'),
          badge: null
        },
        {
          label: 'Clear Cache',
          description: 'Clear temporary app data',
          icon: <Database className="w-4 h-4" />,
          action: () => handleClearCache(),
          badge: '245 MB'
        },
        {
          label: 'Delete All Data',
          description: 'Permanently delete all data (irreversible)',
          icon: <Delete className="w-4 h-4" />,
          action: () => setIsDeleteDataModalOpen(true),
          badge: null,
          danger: true
        }
      ]
    },
    {
      title: 'System',
      icon: <Info className="w-5 h-5" />,
      items: [
        {
          label: 'System Status',
          description: 'View system health and performance',
          icon: <Speed className="w-4 h-4" />,
          action: () => alert('System status coming soon'),
          badge: 'Healthy'
        },
        {
          label: 'Network Settings',
          description: 'WiFi and connection settings',
          icon: <Wifi className="w-4 h-4" />,
          action: () => alert('Network settings coming soon'),
          badge: 'Connected'
        },
        {
          label: 'Security',
          description: 'Security and privacy settings',
          icon: <Shield className="w-4 h-4" />,
          action: () => alert('Security settings coming soon'),
          badge: null
        }
      ]
    },
    {
      title: 'Support',
      icon: <Help className="w-5 h-5" />,
      items: [
        {
          label: 'Help Center',
          description: 'Get help and support',
          icon: <Help className="w-4 h-4" />,
          action: () => alert('Help center coming soon'),
          badge: null
        },
        {
          label: 'About',
          description: 'App version and information',
          icon: <Info className="w-4 h-4" />,
          action: () => alert('LOUVA Admin v1.0.0\n\n© 2024 LOUVA Salon\nAll rights reserved'),
          badge: 'v1.0.0'
        }
      ]
    }
  ]

  const handleLogout = () => {
    // Simulate logout
    setIsLogoutModalOpen(false)
    setNotification('Logging out...')
    setTimeout(() => {
      setNotification('Logged out successfully')
      setTimeout(() => {
        // Redirect to login
        window.location.href = '/'
      }, 1500)
    }, 1000)
  }

  const handleExportData = () => {
    setNotification('Preparing data export...')
    setTimeout(() => {
      setNotification('Data exported successfully')
      setTimeout(() => setNotification(''), 3000)
    }, 2000)
  }

  const handleClearCache = () => {
    setNotification('Clearing cache...')
    setTimeout(() => {
      setNotification('Cache cleared successfully')
      setTimeout(() => setNotification(''), 3000)
    }, 1500)
  }

  const handleDeleteAllData = () => {
    setNotification('Deleting all data...')
    setTimeout(() => {
      setNotification('All data has been deleted')
      setTimeout(() => setNotification(''), 3000)
      setIsDeleteDataModalOpen(false)
    }, 2000)
  }

  const handleSaveProfile = () => {
    setNotification('Profile updated successfully')
    setTimeout(() => setNotification(''), 3000)
    setIsProfileModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1620] via-[#1a2832] to-[#0a1620]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A8BC2] to-[#5A9BD4] sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white hover:text-[#93BEE1]">
              ←
            </Link>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {notification && (
          <Card variant="glass" className="bg-[#00d4aa]/10 border-[#00d4aa]/20 mb-4">
            <CardContent className="p-4 text-center">
              <p className="text-[#00d4aa]">{notification}</p>
            </CardContent>
          </Card>
        )}

        {settingsSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="text-[#93BEE1]">{section.icon}</div>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>

            <div className="space-y-2">
              {section.items.map((item, index) => (
                <Card
                  key={index}
                  variant="dark"
                  className={`bg-[#1a2832] hover:bg-[#243442] transition-colors cursor-pointer ${
                    item.danger ? 'hover:bg-red-900/20' : ''
                  }`}
                  onClick={item.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.danger ? 'bg-red-900/20 text-red-400' : 'bg-[#0a1620] text-[#93BEE1]'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                            {item.label}
                          </h3>
                          <p className="text-[#6b7785] text-xs">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge
                            variant={item.danger ? 'error' : 'secondary'}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-[#6b7785]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <Card variant="dark" className="bg-[#1a2832] hover:bg-[#243442] transition-colors cursor-pointer">
          <CardContent className="p-4" onClick={() => setIsLogoutModalOpen(true)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-red-400">Logout</h3>
                  <p className="text-[#6b7785] text-xs">Sign out of your account</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6b7785]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Are you sure you want to logout?
          </h3>
          <p className="text-[#b0b8c1] text-sm mb-6">
            You will need to sign in again to access the admin panel
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Data Confirmation Modal */}
      <Modal
        isOpen={isDeleteDataModalOpen}
        onClose={() => setIsDeleteDataModalOpen(false)}
        title="⚠️ Danger Zone"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Delete className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Delete All Data?
          </h3>
          <p className="text-[#b0b8c1] text-sm mb-6">
            This action cannot be undone. All customers, transactions, and settings will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDataModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAllData}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Full Name</label>
            <Input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Enter your full name"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Email</label>
            <Input
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="Enter your email"
              type="email"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Phone</label>
            <Input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="Enter your phone number"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Role</label>
            <Input
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              placeholder="Your role"
              className="bg-[#0a1620] border-[#2d3748]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsProfileModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              className="flex-1 bg-gradient-to-r from-[#93BEE1] to-[#7ba6d3]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}