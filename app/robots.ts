import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Content pages are public; legacy /portfolio 301s to /work, APIs stay private
      allow: ['/$', '/wormhole', '/work', '/work/*', '/about', '/services', '/faq', '/testimonials', '/privacy', '/terms', '/NateDon_Portfolio_2025.pdf'],
      disallow: ['/portfolio', '/api/'],
    },
    sitemap: 'https://handtomouse.org/sitemap.xml',
  }
}
