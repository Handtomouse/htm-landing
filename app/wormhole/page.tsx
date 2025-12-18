import WormholeContent from '@/components/WormholeContent'
import ErrorBoundary from '@/components/ErrorBoundary'
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Wormhole",
    "description": "Discover random corners of the web through the wormhole - a curated journey to unexpected destinations",
    "url": "https://handtomouse.org/wormhole",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Hand To Mouse",
      "url": "https://handtomouse.org"
    },
    "about": {
      "@type": "Thing",
      "name": "Web Discovery",
      "description": "Interactive web discovery experience"
    }
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
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <ErrorBoundary>
        <WormholeContent />
      </ErrorBoundary>
    </>
  )
}
