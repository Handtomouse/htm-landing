import WormholeContent from '@/components/WormholeContent'
import Script from 'next/script'

export const metadata = {
  title: 'Wormhole | Hand To Mouse',
  description: 'Discover random corners of the web through the wormhole - a curated journey to unexpected destinations',
  alternates: {
    canonical: 'https://handtomouse.org/wormhole',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function WormholePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://handtomouse.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Wormhole",
        "item": "https://handtomouse.org/wormhole"
      }
    ]
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <WormholeContent />
    </>
  )
}
