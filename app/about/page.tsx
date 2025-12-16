import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Independent Creative Direction & Cultural Strategy | Hand To Mouse',
  description: 'Sydney creative director and cultural strategist. Working with startups, agencies, and cultural organizations to create meaningful experiences.',
  keywords: ['about hand to mouse', 'tom hand', 'creative director sydney', 'cultural strategy', 'independent creative director', 'sydney creative services'],
  alternates: {
    canonical: 'https://handtomouse.org/about',
  },
  openGraph: {
    title: 'About | Hand To Mouse',
    description: 'Independent creative direction and cultural strategy from Sydney.',
    url: 'https://handtomouse.org/about',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function About() {
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
        "name": "About",
        "item": "https://handtomouse.org/about"
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          About Hand To Mouse
        </h1>

        <div className="space-y-6 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Creative Direction & Cultural Strategy</h2>

          <p>
            Hand To Mouse is independent creative direction and cultural strategy from Sydney. I work with
            startups, creative agencies, and cultural organizations to create digital experiences that are
            meaningful, strategic, and built to resonate.
          </p>

          <p>
            I bridge the gap between vision and execution. Whether you need strategic direction for a
            cultural project, brand positioning for a startup, or end-to-end creative leadership for
            a digital experience—I bring both the strategic thinking and the ability to see it through.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">About Nate Don</h2>

          <p>
            I'm Nate Don, an independent creative director and cultural strategist based in Sydney.
            I help startups, agencies, and cultural organizations create digital experiences that are
            meaningful, strategic, and built to resonate with their audiences.
          </p>

          <p>
            My approach combines strategic thinking with hands-on execution. I don't just develop the
            creative vision—I see it through to reality. Whether that's crafting brand positioning for
            a new startup, directing a cultural initiative for a museum, or leading the digital strategy
            for a creative agency's client, I bring both the creative direction and the technical capability
            to make it happen.
          </p>

          <p>
            I believe great work comes from deep understanding: understanding your mission, your audience,
            and the cultural context you're operating in. That's why every project starts with listening,
            research, and collaborative discovery before moving into strategy and execution.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">The Approach</h2>

          <p>
            Every project starts with deep understanding. What story are we telling? Who needs to hear it?
            What cultural context matters? From there, I develop strategic direction that connects your
            mission with your audience, and create experiences that bring that strategy to life.
          </p>

          <p>
            I specialize in <Link href="/services" className="underline hover:text-gray-400 transition-colors">cultural strategy, narrative development, and experience design</Link>. Whether you're
            a museum launching a digital initiative, a startup defining your brand positioning, or an agency
            needing creative direction for a client project—I work collaboratively to create work that matters.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Who I Work With</h2>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Startups & founders</strong> who need strategic creative direction and brand positioning</li>
            <li><strong>Creative agencies</strong> seeking specialized cultural strategy and creative direction</li>
            <li><strong>Cultural organizations</strong> (museums, galleries, festivals, arts groups) developing digital initiatives</li>
            <li><strong>Mission-driven brands</strong> looking to connect authentically with their communities</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Let's Create Something Meaningful</h2>

          <p>
            If you're looking for creative direction that's strategic, culturally intelligent, and built
            to last—someone who can guide your project from concept to reality—let's talk. Have questions? Check out the <Link href="/faq" className="underline hover:text-gray-400 transition-colors">FAQ page</Link>.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <a
              href="mailto:hello@handtomouse.org?subject=Inquiry%20from%20About%20Page"
              className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get in touch →
            </a>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
