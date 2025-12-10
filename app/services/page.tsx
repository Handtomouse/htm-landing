import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Web Design & Next.js Development Sydney | Hand To Mouse',
  description: 'Full-service web design and development in Sydney. Specializing in Next.js, React, modern web design, and creative direction for startups and cultural organizations.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Services() {
  const services = [
    {
      title: 'Web Design',
      description: 'Modern, responsive design that tells your story. I create interfaces that are beautiful, intuitive, and aligned with your brand. Every design decision is made with your users and business goals in mind.',
      keywords: ['UI/UX Design', 'Responsive Design', 'Brand Identity', 'User Experience']
    },
    {
      title: 'Next.js Development',
      description: 'Fast, SEO-friendly websites built with Next.js and React. These modern frameworks deliver exceptional performance, smooth interactions, and excellent search engine visibility. Perfect for businesses that need speed and reliability.',
      keywords: ['React Development', 'Next.js', 'TypeScript', 'Performance Optimization']
    },
    {
      title: 'Creative Direction',
      description: 'Strategic vision that connects your brand with your audience. I help cultural organizations, creative agencies, and mission-driven brands articulate their story through thoughtful digital experiences.',
      keywords: ['Cultural Strategy', 'Brand Strategy', 'Digital Experience', 'Storytelling']
    },
    {
      title: 'Full Website Build',
      description: 'From concept to launch, I handle the entire process. Design, development, content strategy, and deployment—all delivered by one person who understands how the pieces fit together. Faster turnaround, better results.',
      keywords: ['End-to-End Development', 'Full-Stack', 'Launch Support', 'Maintenance']
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Services
        </h1>

        <p className="text-xl mb-16 text-gray-300 max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
          I offer full-service web design and development for startups, agencies, and cultural organizations across Sydney and beyond.
        </p>

        <div className="grid gap-12 md:gap-16">
          {services.map((service, index) => (
            <article key={index} className="border-l-2 border-gray-700 pl-8 hover:border-white transition-colors">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {service.title}
              </h2>

              <p className="text-lg leading-relaxed mb-6 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {service.keywords.map((keyword, i) => (
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
            Ready to start a project?
          </h2>

          <p className="text-lg mb-8 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
            Whether you need a new website, a redesign, or a long-term development partner, let's talk about how I can help.
          </p>

          <a
            href="mailto:hello@handtomouse.org"
            className="inline-block px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Get in touch →
          </a>
        </div>
      </div>
    </main>
  )
}
