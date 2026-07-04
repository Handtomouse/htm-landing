import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { cases } from '@/lib/cases'

export const metadata: Metadata = {
  title: 'Testimonials | Client Quotes | Hand To Mouse',
  description: 'What clients say about working with Nate Don on creative direction, cultural strategy, and digital experience projects.',
  keywords: ['nate don reviews', 'hand to mouse testimonials', 'creative director sydney reviews', 'client feedback'],
  alternates: {
    canonical: 'https://handtomouse.org/testimonials',
  },
  openGraph: {
    title: 'Testimonials | Hand To Mouse',
    description: 'Client quotes from real projects',
    url: 'https://handtomouse.org/testimonials',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Real, attributed quotes only - sourced from the case archive (lib/cases.json).
// Cases without an attributed quote are excluded by design.
const quotes = cases
  .filter((c) => c.testimonial && c.testimonial.a)
  .map((c) => ({
    slug: c.k,
    project: c.t,
    q: c.testimonial!.q,
    a: c.testimonial!.a,
  }))

export default function Testimonials() {
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
        "name": "Testimonials",
        "item": "https://handtomouse.org/testimonials"
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

      <main id="main-content" className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Testimonials
          </h1>

          <p className="text-xl mb-16 text-[var(--muted)] max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            What clients say about working with <Link href="/about" className="underline hover:text-[var(--accent)] transition-colors">Nate Don</Link> on creative direction, cultural strategy, and digital experience projects. Every quote below is attributed and drawn from a real project in <Link href="/work" className="underline hover:text-[var(--accent)] transition-colors">the archive</Link>.
          </p>

          <div className="space-y-12">
            {quotes.map((quote) => (
              <article
                key={quote.slug}
                className="border-l-2 border-[var(--grid)] pl-8 hover:border-[var(--accent)] transition-colors"
              >
                <blockquote className="text-lg leading-relaxed mb-6 text-[var(--muted)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                  "{quote.q}"
                </blockquote>

                <div className="text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                  <p className="font-semibold text-white">{quote.a}</p>
                  <p className="text-sm">
                    <Link href={`/work/${quote.slug}`} className="underline hover:text-[var(--accent)] transition-colors">
                      View the {quote.project} case
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-gray-800">
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Start Your Project
            </h2>

            <p className="text-lg mb-8 text-[var(--muted)]" style={{ fontFamily: 'var(--font-body)' }}>
              Interested in working together? Learn more about <Link href="/services" className="underline hover:text-[var(--accent)] transition-colors">services</Link>, view <Link href="/work" className="underline hover:text-[var(--accent)] transition-colors">selected work</Link>, or read the <Link href="/faq" className="underline hover:text-[var(--accent)] transition-colors">FAQ</Link>.
            </p>

            <a
              href="mailto:hello@handtomouse.org?subject=Project%20Inquiry%20from%20Testimonials"
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
