'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MembershipConfig } from '@/components/admin/MembershipConfig'

export default function MembershipPage() {
  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-[var(--text-primary)]">
          <i className="material-icons text-xl">arrow_back</i>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Membership Configuration</h1>
      </div>

      {/* Membership Configuration Component */}
      <MembershipConfig />
    </div>
  )
}