import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Hand To Mouse - Creative Director & Web Developer Sydney',
  description: 'Learn about Tom, a Sydney-based creative director and web developer who bridges the gap between design vision and technical execution.',
  keywords: ['about hand to mouse', 'tom hand', 'sydney web developer', 'creative director sydney', 'design and development'],
  alternates: {
    canonical: 'https://handtomouse.org/about',
  },
  openGraph: {
    title: 'About | Hand To Mouse',
    description: 'Creative direction meets clean code. Sydney-based design and development.',
    url: 'https://handtomouse.org/about',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          About Hand To Mouse
        </h1>

        <div className="space-y-6 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Creative Direction Meets Clean Code</h2>

          <p>
            Hand To Mouse is where creative vision meets technical execution. Based in Sydney, I work with
            startups, creative agencies, and cultural organizations to create modern web experiences that
            are both beautiful and built to last.
          </p>

          <p>
            Most designers don't code. Most developers don't design. I do both. This means faster turnaround,
            better communication, and websites that work exactly as intended—no lost-in-translation moments
            between design handoff and final build.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">The Approach</h2>

          <p>
            Every project starts with understanding your goals. What problem are we solving? Who are we
            reaching? What makes this different? From there, I craft a design that tells your story,
            then build it with modern technology that's fast, accessible, and maintainable.
          </p>

          <p>
            I specialize in Next.js and React—modern frameworks that create lightning-fast, SEO-friendly
            websites. Whether you need a portfolio, a marketing site, or a full web application, I build
            with performance and user experience at the core.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Who I Work With</h2>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Startups & founders</strong> who need to move fast and launch strong</li>
            <li><strong>Creative agencies</strong> looking for a reliable development partner</li>
            <li><strong>Cultural organizations</strong> (museums, galleries, arts groups) who value thoughtful design</li>
            <li><strong>Small businesses</strong> ready to upgrade their digital presence</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Let's Build Something</h2>

          <p>
            If you're looking for someone who can take your project from concept to launch—someone who
            understands both the creative vision and the technical reality—let's talk.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <a
              href="mailto:hello@handtomouse.org"
              className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get in touch →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
