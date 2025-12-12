import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Creative Direction & Cultural Strategy Sydney | Hand To Mouse',
  description: 'Independent creative direction, cultural strategy, and digital experience design for startups, agencies, and cultural organizations across Sydney and beyond.',
  keywords: ['creative direction sydney', 'cultural strategy', 'brand strategy sydney', 'digital strategy', 'creative services sydney', 'experience design'],
  alternates: {
    canonical: 'https://handtomouse.org/services',
  },
  openGraph: {
    title: 'Services | Creative Direction & Cultural Strategy',
    description: 'Strategic creative direction and cultural strategy from Sydney.',
    url: 'https://handtomouse.org/services',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Services() {
  const services = [
    {
      title: 'Creative Direction',
      description: 'Strategic creative vision that guides how your brand, project, or organization shows up in the world. I help articulate your story, define your visual and narrative language, and ensure every touchpoint reinforces your mission. From concept to execution, I provide the creative leadership that brings your vision to life.',
      keywords: ['Strategic Vision', 'Visual Language', 'Narrative Development', 'Creative Leadership']
    },
    {
      title: 'Cultural Strategy',
      description: 'Strategy rooted in cultural intelligence. I help cultural organizations position their work within the broader cultural landscape, and help brands tap into cultural movements and values that align with their mission. It\'s about creating meaningful connections through cultural context.',
      keywords: ['Cultural Intelligence', 'Positioning', 'Audience Development', 'Cultural Context']
    },
    {
      title: 'Digital Experience Design',
      description: 'End-to-end design and development of digital experiences that engage, inform, and inspire. From interactive exhibitions to brand websites, I create experiences that are both beautiful and meaningful. Strategy, design, and technical execution—all delivered cohesively.',
      keywords: ['Experience Design', 'Interactive Design', 'User Experience', 'Technical Direction']
    },
    {
      title: 'Brand & Content Strategy',
      description: 'Strategic positioning and content frameworks that tell your story authentically. I help startups define their brand voice, cultural organizations develop content strategies, and agencies craft narratives for their clients. From positioning to execution, strategy that resonates.',
      keywords: ['Brand Positioning', 'Content Strategy', 'Messaging', 'Storytelling']
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Services
        </h1>

        <p className="text-xl mb-16 text-gray-300 max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
          I offer strategic creative direction and cultural strategy for startups, agencies, and cultural organizations across Sydney and beyond.
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
            Whether you need creative direction for a new project, cultural strategy for your organization, or end-to-end experience design, let's talk about how I can help.
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
