import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Shoopy - Control Panel',
  description: 'Complete e-commerce management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        <div className="flex min-h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}



