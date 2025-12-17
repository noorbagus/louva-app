'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)

  const handleLogout = () => {
    // In a real app, this would clear auth state
    if (confirm('Are you sure you want to logout?')) {
      // Redirect to login page
      window.location.href = '/'
    }
  }

  const handleClearCache = () => {
    if (confirm('Clear all cached data?')) {
      // Clear localStorage/sessionStorage
      localStorage.clear()
      sessionStorage.clear()
      alert('Cache cleared successfully')
    }
  }

  const handleExportData = () => {
    alert('Exporting all data... This may take a few minutes.')
  }

  const handleBackupNow = () => {
    alert('Creating backup... You will be notified when complete.')
  }

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
      </div>

      {/* Account Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Account</h2>
        <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)]">
          <Link href="/admin/profile">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">person</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Profile Settings</h3>
                  <p className="text-sm text-[var(--text-muted)]">Update your profile information</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>

          <Link href="/admin/change-password">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">lock</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Change Password</h3>
                  <p className="text-sm text-[var(--text-muted)]">Update your password</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>

          <Link href="/admin/security">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">security</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Security Settings</h3>
                  <p className="text-sm text-[var(--text-muted)]">Two-factor authentication</p>
                </div>
              </div>
              <Badge className="bg-[var(--success)] text-white">Enabled</Badge>
            </div>
          </Link>
        </Card>
      </div>

      {/* Application Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Application</h2>
        <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)]">
          <Link href="/admin/salon-info">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">store</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Salon Information</h3>
                  <p className="text-sm text-[var(--text-muted)]">Business details and contact</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-[var(--text-primary)]">palette</span>
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">Theme Settings</h3>
                <p className="text-sm text-[var(--text-muted)]">Dark mode</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-[var(--accent)]' : 'bg-[var(--surface-lighter)]'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <Link href="/admin/language">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">language</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Language</h3>
                  <p className="text-sm text-[var(--text-muted)]">English (US)</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>
        </Card>
      </div>

      {/* Data Management */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Data</h2>
        <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)]">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-[var(--text-primary)]">backup</span>
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">Auto Backup</h3>
                <p className="text-sm text-[var(--text-muted)]">Daily at 2:00 AM</p>
              </div>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoBackup ? 'bg-[var(--accent)]' : 'bg-[var(--surface-lighter)]'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                autoBackup ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer" onClick={handleBackupNow}>
            <div className="flex items-center gap-3">
              <span className="material-icons text-[var(--text-primary)]">cloud_upload</span>
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">Backup Now</h3>
                <p className="text-sm text-[var(--text-muted)]">Last backup: 2 hours ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Backup
            </Button>
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer" onClick={handleExportData}>
            <div className="flex items-center gap-3">
              <span className="material-icons text-[var(--text-primary)]">file_download</span>
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">Export Data</h3>
                <p className="text-sm text-[var(--text-muted)]">Download all data as CSV</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer" onClick={handleClearCache}>
            <div className="flex items-center gap-3">
              <span className="material-icons text-[var(--text-primary)]">delete_forever</span>
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">Clear Cache</h3>
                <p className="text-sm text-[var(--text-muted)]">Remove temporary files</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </Card>
      </div>

      {/* Support */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Support</h2>
        <Card className="bg-[var(--surface-light)] border-[var(--border)] divide-y divide-[var(--border)]">
          <Link href="/admin/help">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">help</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Help Center</h3>
                  <p className="text-sm text-[var(--text-muted)]">FAQs and documentation</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>

          <Link href="/admin/report-issue">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">bug_report</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Report Issue</h3>
                  <p className="text-sm text-[var(--text-muted)]">Report bugs or issues</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>

          <Link href="/admin/about">
            <div className="p-5 flex items-center justify-between hover:bg-[var(--surface-lighter)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-icons text-[var(--text-primary)]">info</span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">About</h3>
                  <p className="text-sm text-[var(--text-muted)]">Version 1.0.0</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">chevron_right</span>
            </div>
          </Link>
        </Card>
      </div>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        className="w-full bg-[var(--error)] hover:bg-[var(--error-dark)]"
      >
        <span className="material-icons mr-2">logout</span>
        Logout
      </Button>
    </div>
  )
}