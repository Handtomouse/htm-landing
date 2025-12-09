import type { Metadata } from 'next'
import { VT323, Pixelify_Sans, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono'
})

const pixelifySans = Pixelify_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading'
})

const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'HandToMouse - Coming Soon',
  description: 'Independent creative direction and cultural strategy from Sydney. Something special is loading...',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* #3: Font preconnect optimization */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="preload" href="/HTM-LOGO-ICON-WHITE.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/HTM-LOGOS-FULLWORDMARK.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/HTM-PROJECTILE-LINE.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/HTM-MUZZLE-FLASH.svg" as="image" type="image/svg+xml" />
        <link rel="stylesheet" href="https://use.typekit.net/swi6eoo.css" />
      </head>
      <body
        className={`${vt323.variable} ${pixelifySans.variable} ${robotoMono.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-body)',
          background: 'var(--bg)',
          color: 'var(--ink)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
