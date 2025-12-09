'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

// Pages that should NOT show the dashboard layout (sidebar + header)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  // For public routes (landing, login, register), render without sidebar/header
  if (isPublicRoute) {
    return <div className="min-h-screen">{children}</div>
  }

  // For all other routes (dashboard pages), render with sidebar and header
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
