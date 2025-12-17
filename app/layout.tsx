import type { Metadata } from 'next'
import { VT323, Pixelify_Sans, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',  // Optimize font loading for better CLS
})

const pixelifySans = Pixelify_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',  // Optimize font loading for better CLS
})

const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',  // Optimize font loading for better CLS
})

export const metadata: Metadata = {
  title: 'Independent creative direction and cultural strategy from Sydney | Hand To Mouse',
  description: 'Independent creative direction and cultural strategy from Sydney. Working with startups, agencies, and cultural organizations to create meaningful digital experiences.',
  keywords: ['creative direction sydney', 'cultural strategy', 'creative director sydney', 'cultural projects sydney', 'digital strategy', 'independent creative director', 'cultural organizations', 'brand strategy sydney'],
  authors: [{ name: 'Nate Don' }],
  creator: 'Hand To Mouse',
  publisher: 'Hand To Mouse',
  metadataBase: new URL('https://handtomouse.org'),
  alternates: {
    canonical: 'https://handtomouse.org',
  },
  openGraph: {
    title: 'Hand To Mouse | Independent Creative Direction & Cultural Strategy',
    description: 'Independent creative direction and cultural strategy from Sydney. Working with startups, agencies, and cultural organizations.',
    url: 'https://handtomouse.org',
    siteName: 'Hand To Mouse',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/HTM-LOGO-ICON-WHITE.svg',
        width: 512,
        height: 512,
        alt: 'Hand To Mouse Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hand To Mouse | Independent Creative Direction',
    description: 'Independent creative direction and cultural strategy from Sydney',
    creator: '@handtomouse',
    images: ['/HTM-LOGO-ICON-WHITE.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ['32edcb2607debf2d', 'T1Njy_42-2WkRsw8GooZ189Prrs_B_krrb7gR8XHo1o'],
  },
  icons: {
    icon: [
      { url: '/HTM-LOGO-ICON-WHITE.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/HTM-LOGO-ICON-WHITE.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Enable safe area insets on notched devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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

        {/* Performance: Preconnect to Vercel Analytics */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Critical asset preloading */}
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
