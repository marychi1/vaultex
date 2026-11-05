import type { Metadata, Viewport } from 'next'
import EnvironmentBanner from '@/components/EnvironmentBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'VAULTEX | Bank wires and shipping',
  description: 'VAULTEX provides bank-wire service information and separate domestic parcel-shipping tools.',
  keywords: 'bank wire transfers, FedEx parcel shipping',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'VAULTEX' },
  openGraph: { title: 'VAULTEX | Bank wires and shipping', description: 'Bank-wire service information and separate domestic parcel-shipping tools.', type: 'website' },
}

export const viewport: Viewport = {
  themeColor: '#17392E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <EnvironmentBanner />
        {children}
      </body>
    </html>
  )
}
