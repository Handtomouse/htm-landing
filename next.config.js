/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net vitals.vercel-insights.com va.vercel-scripts.com; style-src 'self' 'unsafe-inline' use.typekit.net; font-src 'self' use.typekit.net data:; img-src 'self' data: blob:; connect-src 'self' vitals.vercel-insights.com; frame-ancestors 'self';"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Old Squarespace pages redirect to new site
      {
        source: '/portfolio-1',
        destination: '/services',
        permanent: true, // 301 redirect (tells Google page moved permanently)
      },
      {
        source: '/gallery-3',
        destination: '/services',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig;
