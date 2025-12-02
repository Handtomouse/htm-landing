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
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
