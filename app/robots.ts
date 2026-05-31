import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Only home, wormhole, and portfolio PDF are public for now
      allow: ['/$', '/wormhole', '/work', '/work/*', '/NateDon_Portfolio_2025.pdf'],
      disallow: ['/about', '/services', '/faq', '/portfolio', '/testimonials', '/api/'],
    },
    sitemap: 'https://handtomouse.org/sitemap.xml',
  }
}
