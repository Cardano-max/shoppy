import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { LayoutWrapper } from './layout-wrapper'

export const metadata: Metadata = {
  title: 'Shoopy - E-commerce Management Platform',
  description: 'Complete e-commerce management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
