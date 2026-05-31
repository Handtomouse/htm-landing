// app/work/fonts.ts
// Centralized font loading for the portfolio sub-app (/work/*).
// Per locked default #7: next/font/google self-hosts at build time,
// CSP-compliant (no external font CDN needed).
import { Inter, VT323, Geist_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  // Weights 100 + 200 are used in canonical stat blocks and gallery h2 elements.
  weight: ['100', '200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-vt323',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['200', '400', '600'],
  display: 'swap',
  variable: '--font-geist-mono',
});

// ArgentPixelCF intentionally omitted per Decision A3-adobe (Plan 01 Task 3).
// This face will be loaded via an Adobe Fonts web project kit (use.typekit.net).
// See the TODO(adobe-fonts-kit) marker in app/work/layout.tsx for the insertion point.
// In portfolio.css, --font-display uses "argent-pixel-cf" (Adobe's slug) with
// var(--font-vt323) as the graceful fallback until the kit loads.
