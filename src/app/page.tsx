import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--secondary)] flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-[var(--surface)] rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">LOUVA Salon</h1>
        <p className="text-[var(--text-secondary)] mb-8">Loyalty Management System</p>

        <div className="space-y-4">
          <Link href="/customer">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-[var(--accent)]/25 transition-all">
              Customer App
            </button>
          </Link>

          <Link href="/admin">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-[var(--secondary)]/25 transition-all">
              Admin App
            </button>
          </Link>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-8">
          Version 1.0.0
        </p>
      </div>
    </div>
  )
}