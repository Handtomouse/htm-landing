import { MetadataRoute } from 'next'
import { cases } from '@/lib/cases'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://handtomouse.org'
  const currentDate = new Date()

  // Existing entries preserved (META-03: additive extension only)
  const existing: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        `${baseUrl}/HTM-LOGO-ICON-WHITE.svg`,
        `${baseUrl}/HTM-LOGOS-FULLWORDMARK.svg`,
      ],
    },
    {
      url: `${baseUrl}/wormhole`,
      lastModified: currentDate,
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

  // /work gallery entry (META-03)
  const workGallery: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/work`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // 19 case detail entries (META-03)
  const workCases: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${baseUrl}/work/${c.k}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...existing, ...workGallery, ...workCases]
}
