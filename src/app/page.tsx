import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to appropriate app based on user type
  // For now, redirect to customer app
  redirect('/customer')
}