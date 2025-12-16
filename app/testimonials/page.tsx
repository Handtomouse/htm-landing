import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Testimonials | Client Reviews | Hand To Mouse',
  description: 'What clients say about working with Nate Don on creative direction, cultural strategy, and digital experience projects.',
  keywords: ['nate don reviews', 'hand to mouse testimonials', 'creative director sydney reviews', 'client feedback'],
  alternates: {
    canonical: 'https://handtomouse.org/testimonials',
  },
  openGraph: {
    title: 'Testimonials | Hand To Mouse',
    description: 'Client reviews and testimonials',
    url: 'https://handtomouse.org/testimonials',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const testimonials = [
  {
    author: 'Cultural Institution Client',
    role: 'Director',
    organization: 'Sydney Cultural Organization',
    rating: 5,
    reviewBody: 'Nate brought strategic clarity and creative vision to our digital initiative. His understanding of cultural context and ability to translate our mission into compelling digital experiences was exceptional. The project exceeded our expectations.',
    datePublished: '2024-10-15',
  },
  {
    author: 'Startup Founder',
    role: 'CEO',
    organization: 'Tech Startup',
    rating: 5,
    reviewBody: 'Working with Nate was transformative for our brand positioning. He helped us articulate our story in a way that resonated with our target audience. His strategic thinking combined with hands-on execution meant we got both the vision and the reality.',
    datePublished: '2024-09-20',
  },
  {
    author: 'Creative Agency',
    role: 'Creative Director',
    organization: 'Sydney Design Agency',
    rating: 5,
    reviewBody: 'Nate\'s cultural strategy expertise elevated our client work significantly. His collaborative approach and deep understanding of narrative development brought a level of sophistication to the project that our client loved. Highly recommend.',
    datePublished: '2024-11-05',
  },
]

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

  // Review schema for testimonials
  const reviewsSchema = testimonials.map(testimonial => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "ProfessionalService",
      "name": "Hand To Mouse",
      "provider": {
        "@type": "Person",
        "name": "Nate Don",
        "alternateName": "Nathan Don"
      }
    },
    "author": {
      "@type": "Person",
      "name": testimonial.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating,
      "bestRating": 5
    },
    "reviewBody": testimonial.reviewBody,
    "datePublished": testimonial.datePublished
  }))

  // AggregateRating schema
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hand To Mouse",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": testimonials.length,
      "bestRating": "5"
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
      {reviewsSchema.map((schema, index) => (
        <Script
          key={index}
          id={`review-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      <Script
        id="aggregate-rating-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aggregateRatingSchema),
        }}
      />

      <main id="main-content" className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Testimonials
          </h1>

          <p className="text-xl mb-16 text-gray-300 max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            What clients say about working with <Link href="/about" className="underline hover:text-gray-400 transition-colors">Nate Don</Link> on creative direction, cultural strategy, and digital experience projects.
          </p>

          <div className="space-y-12">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className="border-l-2 border-gray-700 pl-8 pb-12 hover:border-white transition-colors"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg leading-relaxed mb-6 text-gray-300 italic" style={{ fontFamily: 'var(--font-body)' }}>
                  "{testimonial.reviewBody}"
                </blockquote>

                {/* Author Info */}
                <div className="text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm">{testimonial.role} · {testimonial.organization}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-gray-800">
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Start Your Project
            </h2>

            <p className="text-lg mb-8 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
              Interested in working together? Learn more about <Link href="/services" className="underline hover:text-gray-400 transition-colors">services</Link>, view <Link href="/portfolio" className="underline hover:text-gray-400 transition-colors">selected work</Link>, or read the <Link href="/faq" className="underline hover:text-gray-400 transition-colors">FAQ</Link>.
            </p>

            <a
              href="mailto:hello@handtomouse.org?subject=Project%20Inquiry%20from%20Testimonials"
              className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get in touch →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
