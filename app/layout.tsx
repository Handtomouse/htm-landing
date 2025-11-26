import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323'
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
      <body className={`${vt323.variable} font-vt323 bg-black text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
