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
  title: 'Independent creative direction and cultural strategy from Sydney | Hand To Mouse',
  description: 'Sydney-based creative director and web developer specializing in modern web design and cultural projects for startups, agencies, and cultural organizations.',
  openGraph: {
    title: 'Hand To Mouse | Creative Direction + Code',
    description: 'Independent creative direction and cultural strategy from Sydney. Modern web design and development for startups, agencies, and cultural organizations.',
    url: 'https://handtomouse.org',
    siteName: 'Hand To Mouse',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hand To Mouse | Creative Direction + Code',
    description: 'Independent creative direction and cultural strategy from Sydney',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Enable safe area insets on notched devices
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
          minHeight: '100dvh',
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
