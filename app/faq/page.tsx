import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'FAQ | Creative Direction & Cultural Strategy Questions | Hand To Mouse',
  description: 'Frequently asked questions about creative direction, cultural strategy, and working with Hand To Mouse in Sydney.',
  keywords: ['creative direction faq', 'cultural strategy sydney', 'independent creative director', 'creative services cost'],
  alternates: {
    canonical: 'https://handtomouse.org/faq',
  },
  openGraph: {
    title: 'FAQ | Hand To Mouse',
    description: 'Common questions about web design and development services',
    url: 'https://handtomouse.org/faq',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'What services do you offer?',
    answer: 'I offer independent creative direction and cultural strategy for digital experiences, brands, and cultural projects. This includes strategic vision, narrative development, experience design, and end-to-end implementation. I work with startups, creative agencies, and cultural organizations across Sydney and beyond.',
  },
  {
    question: 'What is creative direction?',
    answer: 'Creative direction is the strategic vision that guides how your brand, project, or organization shows up in the world. It\'s about translating your mission and values into compelling experiences that resonate with your audience. I help articulate your story and bring it to life through digital experiences.',
  },
  {
    question: 'What is cultural strategy?',
    answer: 'Cultural strategy is about understanding and leveraging cultural context to create meaningful connections. For cultural organizations, it\'s positioning your work within the broader cultural landscape. For brands, it\'s tapping into cultural movements and values that align with your mission. It\'s strategy rooted in cultural intelligence.',
  },
  {
    question: 'How much do projects cost?',
    answer: 'Project costs vary based on scope and complexity. Strategic consulting engagements typically start around $5,000-$10,000, while comprehensive creative direction and implementation projects range from $15,000-$50,000+. I provide detailed proposals after understanding your specific needs and goals.',
  },
  {
    question: 'Do you work with clients outside Sydney?',
    answer: 'Yes! While I\'m based in Sydney, I work with clients Australia-wide and internationally. All collaboration happens remotely, and I\'ve successfully delivered projects for organizations across multiple time zones and cultural contexts.',
  },
  {
    question: 'What types of organizations do you work with?',
    answer: 'I work with three main types: startups needing strategic brand direction, creative agencies looking for specialized expertise, and cultural organizations (museums, galleries, arts groups, festivals) seeking cultural strategy and digital experiences.',
  },
  {
    question: 'Do you handle implementation or just strategy?',
    answer: 'I do both. I can provide strategic consulting and creative direction, or take projects end-to-end including design and technical implementation. Having both strategy and execution skills means no lost-in-translation moments between vision and reality.',
  },
  {
    question: 'What\'s your process?',
    answer: 'I start with deep discovery to understand your context, audience, and goals. Then we define strategic direction and creative vision. From there, I develop the experience design and implement it (or hand off to your team). The process is collaborative, transparent, and adapted to your needs.',
  },
]

export default function FAQ() {
  // Breadcrumb Schema
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
        "name": "FAQ",
        "item": "https://handtomouse.org/faq"
      }
    ]
  }

  // FAQ Schema for rich snippets in Google search results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main id="main-content" className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Frequently Asked Questions
          </h1>

          <p
            className="text-xl mb-12 text-gray-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Common questions about web design, development, and working together.
          </p>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <article key={index} className="border-b border-gray-800 pb-8">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {faq.question}
                </h2>
                <p
                  className="text-lg leading-relaxed text-gray-300"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-gray-800">
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Still have questions?
            </h2>

            <p
              className="text-lg mb-8 text-gray-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get in touch to discuss your project and see how I can help bring your vision to life.
            View <Link href="/services" className="underline hover:text-white transition-colors">services offered</Link>,
            read <Link href="/about" className="underline hover:text-white transition-colors">about my approach</Link>,
            or explore <Link href="/portfolio" className="underline hover:text-white transition-colors">selected work</Link>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:hello@handtomouse.org?subject=Question%20from%20FAQ%20Page"
                className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all text-center"
                style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
              >
                Email me →
              </a>

              <Link
                href="/testimonials"
                className="inline-block px-8 py-4 border-2 border-gray-700 hover:border-white transition-all text-center"
                style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
              >
                View Testimonials
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
