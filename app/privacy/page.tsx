import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Hand To Mouse',
  description: 'Privacy policy for Hand To Mouse. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://handtomouse.org/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Hand To Mouse',
    description: 'Privacy policy and data protection information',
    url: 'https://handtomouse.org/privacy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Privacy() {
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
        "name": "Privacy Policy",
        "item": "https://handtomouse.org/privacy"
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
            Privacy Policy
          </h1>

          <p className="text-sm text-gray-400 mb-12">
            Last updated: January 2025
          </p>

          <div className="space-y-8 text-[var(--muted)] leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Overview
              </h2>
              <p>
                Hand To Mouse ("we", "us", or "our") respects your privacy and is committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website
                at handtomouse.org or use our contact forms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Information We Collect
              </h2>
              <p className="mb-4">When you use our contact form or subscribe to updates, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Name</strong> - to address you personally in our response</li>
                <li><strong>Email address</strong> - to respond to your inquiry</li>
                <li><strong>Message content</strong> - the subject and message you provide</li>
                <li><strong>IP address</strong> - for security and spam prevention</li>
                <li><strong>Timestamp</strong> - when you submitted the form</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your inquiries and requests</li>
                <li>Send you updates if you've subscribed</li>
                <li>Protect against spam and abuse</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Data Storage & Security
              </h2>
              <p>
                Your data is transmitted securely via HTTPS. Contact form submissions are processed through Resend
                (our email service provider) and delivered to our inbox. We do not store your personal data in
                databases beyond what's necessary to respond to your inquiry. We implement appropriate security
                measures including rate limiting and spam prevention.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Third-Party Services
              </h2>
              <p className="mb-4">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Vercel</strong> - website hosting and analytics</li>
                <li><strong>Resend</strong> - email delivery for contact forms</li>
                <li><strong>Adobe Fonts (TypeKit)</strong> - web fonts</li>
              </ul>
              <p className="mt-4">
                These services may collect anonymous usage data. Please refer to their respective privacy policies
                for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Cookies
              </h2>
              <p>
                This website uses minimal cookies necessary for functionality. We use Vercel Analytics which may
                set anonymous analytics cookies. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:hello@handtomouse.org" className="underline hover:text-[var(--muted)] transition-colors">
                  hello@handtomouse.org
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Contact
              </h2>
              <p>
                If you have questions about this privacy policy or our data practices, please contact us at{' '}
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
              href="/terms"
              className="inline-block px-8 py-4 border-2 border-[var(--grid)] hover:border-white transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 text-center"
              style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
