'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRScanner } from '@/components/admin/QRScanner'

export default function ScannerPage() {
  const [scannedCustomer, setScannedCustomer] = useState<any>(null)

  const handleScanSuccess = (customerData: any) => {
    setScannedCustomer(customerData)
  }

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <button className="p-2 hover:bg-[var(--surface-light)] rounded-xl transition-colors">
            <span className="material-icons text-[var(--text-primary)]">arrow_back</span>
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Scan Customer QR</h1>
      </div>

      {/* Scanner Content */}
      <QRScanner onScanSuccess={handleScanSuccess} />

      {/* Recent Scans */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Scans</h2>
        <div className="space-y-3">
          <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/30">
                  <img
                    src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
                    alt="Sari Dewi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Sari Dewi</h3>
                  <p className="text-sm text-[var(--text-muted)]">Silver Member • 2 min ago</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">history</span>
            </div>
          </div>

          <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/30">
                  <img
                    src="https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg"
                    alt="Maya Putri"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Maya Putri</h3>
                  <p className="text-sm text-[var(--text-muted)]">Gold Member • 15 min ago</p>
                </div>
              </div>
              <span className="material-icons text-[var(--text-muted)]">history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}