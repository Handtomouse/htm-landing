import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://handtomouse.org'
  const currentDate = new Date()

  // Set more realistic lastModified dates based on content type
  const contentLastModified = new Date('2025-12-18')
  const staticLastModified = new Date('2025-12-01')

  // Only include pages that robots.ts allows (/ and /wormhole)
  return [
    {
      url: baseUrl,
      lastModified: contentLastModified,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        `${baseUrl}/HTM-LOGO-ICON-WHITE.svg`,
        `${baseUrl}/HTM-LOGOS-FULLWORDMARK.svg`,
      ],
    },
    {
      url: `${baseUrl}/wormhole`,
      lastModified: contentLastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
      images: [
        `${baseUrl}/HTM-LOGO-ICON-WHITE.svg`,
        `${baseUrl}/hand-sprite-left.svg`,
        `${baseUrl}/hand-sprite-right.svg`,
        `${baseUrl}/HTM-PROJECTILE-LINE.svg`,
        `${baseUrl}/HTM-MUZZLE-FLASH.svg`,
      ],
    },
  ]
}
