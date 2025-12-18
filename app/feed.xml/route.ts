import { DESTINATIONS } from '@/lib/wormholeData'

export async function GET() {
  const baseUrl = 'https://handtomouse.org'
  const buildDate = new Date().toUTCString()

  // Flatten all destination URLs from all categories
  const allDestinations = Object.entries(DESTINATIONS).flatMap(([category, urls]) =>
    urls.map(url => ({ url, category }))
  )

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hand To Mouse Wormhole Destinations</title>
    <link>${baseUrl}/wormhole</link>
    <description>Curated web destinations from the Hand To Mouse Wormhole</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>

    ${allDestinations.map((dest) => `<item>
      <title>${escapeXml(dest.url.split('/')[2] || dest.url)}</title>
      <link>${escapeXml(dest.url)}</link>
      <description>Wormhole destination in category: ${escapeXml(dest.category)}</description>
      <guid isPermaLink="false">${escapeXml(dest.url)}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>${escapeXml(dest.category)}</category>
    </item>`).join('\n    ')}

  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
