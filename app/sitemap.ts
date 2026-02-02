import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://handtomouse.org'
  const currentDate = new Date()

  // Only include pages that robots.ts allows (/ and /wormhole)
  return [
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
}
