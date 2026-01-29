import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Hand To Mouse',
  description: 'Terms of service for Hand To Mouse creative direction and cultural strategy services.',
  alternates: {
    canonical: 'https://handtomouse.org/terms',
  },
  openGraph: {
    title: 'Terms of Service | Hand To Mouse',
    description: 'Terms of service and conditions for working together',
    url: 'https://handtomouse.org/terms',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Terms() {
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
        "name": "Terms of Service",
        "item": "https://handtomouse.org/terms"
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

      <main
        id="main-content"
        className="min-h-screen bg-black text-white px-6 py-20"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Terms of Service
          </h1>

          <p className="text-sm text-gray-400 mb-12">
            Last updated: January 2025
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Agreement to Terms
              </h2>
              <p>
                By accessing or using the Hand To Mouse website (handtomouse.org) or engaging our services, you agree
                to be bound by these Terms of Service. If you do not agree to these terms, please do not use our
                website or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Services
              </h2>
              <p className="mb-4">
                Hand To Mouse provides creative direction, cultural strategy, and digital experience design services.
                All services are provided on a project basis with specific terms outlined in individual project
                proposals or contracts.
              </p>
              <p>
                Project scope, deliverables, timelines, and fees will be agreed upon in writing before work begins.
                Any changes to scope may result in adjusted timelines and fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Intellectual Property
              </h2>
              <p className="mb-4">
                Upon full payment, clients receive ownership of final deliverables as specified in the project agreement.
                Hand To Mouse retains the right to use work samples in portfolios and marketing materials unless
                otherwise agreed in writing.
              </p>
              <p>
                All content on this website, including text, graphics, logos, and code, is the property of Hand To Mouse
                and protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Payment Terms
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Deposits are typically required before project commencement</li>
                <li>Invoices are due within 14 days unless otherwise agreed</li>
                <li>Late payments may incur additional fees</li>
                <li>All prices are in Australian Dollars (AUD) unless stated otherwise</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Client Responsibilities
              </h2>
              <p className="mb-4">Clients agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide timely feedback and approvals as outlined in project timelines</li>
                <li>Supply necessary materials, assets, and information for the project</li>
                <li>Ensure they have rights to any materials provided for use in the project</li>
                <li>Communicate changes to requirements promptly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Limitation of Liability
              </h2>
              <p>
                Hand To Mouse provides services "as is" and makes no warranties regarding specific outcomes or results.
                Our liability is limited to the fees paid for the specific services in question. We are not liable for
                indirect, incidental, or consequential damages arising from the use of our services or website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Confidentiality
              </h2>
              <p>
                Both parties agree to keep confidential any proprietary or sensitive information shared during the
                course of a project. This obligation continues after the project concludes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Termination
              </h2>
              <p>
                Either party may terminate a project with written notice. In case of termination, payment is due for
                all work completed up to the termination date. Deposits are non-refundable unless otherwise specified
                in the project agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Governing Law
              </h2>
              <p>
                These terms are governed by the laws of New South Wales, Australia. Any disputes will be resolved
                in the courts of New South Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Changes to Terms
              </h2>
              <p>
                We may update these terms from time to time. Continued use of our website or services after changes
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Contact
              </h2>
              <p>
                For questions about these terms, please contact us at{' '}
                <a href="mailto:hello@handtomouse.org" className="underline hover:text-[var(--muted)] transition-colors">
                  hello@handtomouse.org
                </a>
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-[var(--grid)] flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 text-center"
              style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
            >
              ← Back to Home
            </Link>
            <Link
              href="/privacy"
              className="inline-block px-8 py-4 border-2 border-[var(--grid)] hover:border-white transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 text-center"
              style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
