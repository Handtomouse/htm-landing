import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'FAQ | Web Design & Development Questions | Hand To Mouse',
  description: 'Frequently asked questions about web design, Next.js development, and working with Hand To Mouse in Sydney.',
  keywords: ['web design faq', 'nextjs development questions', 'freelance web developer sydney', 'web design cost'],
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
    answer: 'I offer full-service web design and development, specializing in Next.js and React. This includes custom website design, frontend development, creative direction, and technical consulting. I work with startups, creative agencies, and cultural organizations across Sydney and beyond.',
  },
  {
    question: 'How much does a website cost?',
    answer: 'Project costs vary based on scope and complexity. A simple marketing site typically starts around $3,000-$5,000, while custom web applications can range from $10,000-$30,000+. I provide detailed quotes after understanding your specific needs and goals.',
  },
  {
    question: 'How long does it take to build a website?',
    answer: 'Timeline depends on project scope. A standard marketing website takes 2-4 weeks from kickoff to launch. More complex applications can take 6-12 weeks. I provide a detailed timeline and milestones during the proposal stage.',
  },
  {
    question: 'Do you work with clients outside Sydney?',
    answer: 'Yes! While I\'m based in Sydney, I work with clients Australia-wide and internationally. All communication happens online, and I\'ve successfully delivered projects for remote teams across multiple time zones.',
  },
  {
    question: 'What makes Next.js better than WordPress or other platforms?',
    answer: 'Next.js offers superior performance, better SEO, and modern development practices. Sites load faster, rank higher in search results, and provide a better user experience. Unlike WordPress, Next.js sites are more secure, easier to maintain, and scale better as your business grows.',
  },
  {
    question: 'Do you provide ongoing maintenance and support?',
    answer: 'Yes, I offer ongoing maintenance packages for hosting, updates, and technical support. We can discuss maintenance options during the project, or you can manage the site yourself - Next.js sites are easier to maintain than traditional platforms.',
  },
  {
    question: 'Can you help with SEO and search rankings?',
    answer: 'Absolutely. All sites I build are optimized for search engines from day one, including proper meta tags, structured data, fast loading times, and mobile optimization. I can also provide ongoing SEO consulting and content strategy.',
  },
  {
    question: 'What\'s your development process?',
    answer: 'I start with discovery and strategy, then move to design, development, and testing before launch. You\'ll see regular progress updates and have opportunities to provide feedback throughout. The process is collaborative and transparent.',
  },
]

export default function FAQ() {
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
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen bg-black text-white px-6 py-20">
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
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:hello@handtomouse.org"
                className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all text-center"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Email me →
              </a>

              <Link
                href="/services"
                className="inline-block px-8 py-4 border-2 border-gray-700 hover:border-white transition-all text-center"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
