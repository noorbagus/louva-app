import { Customer } from '@/lib/types'

interface CustomerInfoProps {
  customer: Customer
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  const membershipColor = {
    Bronze: 'bg-[var(--warning)] text-[var(--primary)]',
    Silver: 'bg-[var(--accent)] text-white',
    Gold: 'bg-[var(--warning)] text-[var(--primary)]'
  }[customer.membership_level]

  return (
    <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30 backdrop-blur-lg">
          <img
            src="https://images.pexels.com/photos/4921066/pexels-photo-4921066.jpeg"
            alt={customer.full_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{customer.full_name}</h3>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${membershipColor}`}>
            {customer.membership_level} Member
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-[var(--surface)] rounded-2xl p-4">
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--accent)]">{customer.total_points.toLocaleString()}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Current Points</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--text-primary)]">{customer.total_visits || 0}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Total Visits</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--text-primary)]">
            {((customer.total_spent || 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Lifetime Value</div>
        </div>
      </div>
    </div>
  )
}