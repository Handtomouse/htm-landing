/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
