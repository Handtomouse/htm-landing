import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Portfolio | Creative Direction & Cultural Strategy Projects | Hand To Mouse',
  description: 'Selected projects by Nate Don: creative direction, cultural strategy, and digital experience design for startups, agencies, and cultural organizations.',
  keywords: ['nate don portfolio', 'nathan don work', 'creative director portfolio sydney', 'cultural strategy projects', 'digital experience design'],
  alternates: {
    canonical: 'https://handtomouse.org/portfolio',
  },
  openGraph: {
    title: 'Portfolio | Nate Don | Hand To Mouse',
    description: 'Selected creative direction and cultural strategy projects',
    url: 'https://handtomouse.org/portfolio',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const portfolioItems = [
  {
    title: 'Cultural Strategy & Digital Experience',
    category: 'Cultural Organizations',
    description: 'Strategic direction and digital experience design for cultural institutions, helping museums and galleries connect with contemporary audiences through meaningful digital initiatives.',
    keywords: ['Cultural Strategy', 'Museum Digital', 'Audience Engagement', 'Experience Design'],
    dateCreated: '2024',
  },
  {
    title: 'Brand Positioning & Creative Direction',
    category: 'Startups',
    description: 'End-to-end brand positioning and creative direction for early-stage startups, from strategic positioning to visual identity and digital presence.',
    keywords: ['Brand Strategy', 'Creative Direction', 'Startup Branding', 'Visual Identity'],
    dateCreated: '2024',
  },
  {
    title: 'Digital Strategy for Creative Agencies',
    category: 'Agency Collaboration',
    description: 'Specialized digital strategy and creative direction for agencies seeking cultural intelligence and narrative development expertise for their client work.',
    keywords: ['Agency Partnership', 'Digital Strategy', 'Cultural Intelligence', 'Narrative Development'],
    dateCreated: '2024',
  },
  {
    title: 'Cultural Projects & Initiatives',
    category: 'Cultural Sector',
    description: 'Strategic creative direction for cultural projects, festivals, and arts organizations looking to develop meaningful digital experiences and audience connections.',
    keywords: ['Cultural Projects', 'Arts Organizations', 'Festival Strategy', 'Cultural Programming'],
    dateCreated: '2024',
  },
]

export default function Portfolio() {
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
        "name": "Portfolio",
        "item": "https://handtomouse.org/portfolio"
      }
    ]
  }

  // CreativeWork schema for portfolio items
  const creativeWorksSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": portfolioItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": item.title,
        "description": item.description,
        "creator": {
          "@type": "Person",
          "name": "Nate Don",
          "alternateName": "Nathan Don",
          "jobTitle": "Creative Director & Cultural Strategist"
        },
        "dateCreated": item.dateCreated,
        "keywords": item.keywords.join(', '),
        "genre": item.category
      }
    }))
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
        id="creative-works-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorksSchema),
        }}
      />

      <main id="main-content" className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Portfolio
          </h1>

          <p className="text-xl mb-4 text-gray-300 max-w-3xl" style={{ fontFamily: 'var(--font-body)' }}>
            Selected projects showcasing creative direction, cultural strategy, and digital experience design.
          </p>

          <p className="text-lg mb-16 text-gray-400 max-w-3xl" style={{ fontFamily: 'var(--font-body)' }}>
            By <Link href="/about" className="underline hover:text-white transition-colors">Nate Don</Link>, independent creative director and cultural strategist.
          </p>

          <div className="grid gap-12 md:gap-16">
            {portfolioItems.map((item, index) => (
              <article
                key={index}
                className="border-l-2 border-gray-700 pl-8 hover:border-white transition-colors"
              >
                <div className="mb-3">
                  <span
                    className="text-sm text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h2>

                <p className="text-lg leading-relaxed mb-6 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {item.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-400"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-gray-800">
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Work Together
            </h2>

            <p className="text-lg mb-8 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
              Interested in working together on a project? Learn more about <Link href="/services" className="underline hover:text-gray-400 transition-colors">services offered</Link> or <Link href="/about" className="underline hover:text-gray-400 transition-colors">read about my approach</Link>.
            </p>

            <a
              href="mailto:hello@handtomouse.org?subject=Project%20Inquiry%20from%20Portfolio"
              className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
              style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
            >
              Get in touch →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
