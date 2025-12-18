'use client'

import { useState, useEffect } from 'react'
import TerminalTypewriter from '@/components/TerminalTypewriter'
import BattleSystem from '@/components/BattleSystem'
import FooterCTAs from '@/components/FooterCTAs'
import ContactModal from '@/components/ContactModal'
import Script from 'next/script'

export default function Home() {
  // #5: Lazy load decorative effects after initial paint
  const [showEffects, setShowEffects] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    // Defer non-critical effects for faster initial render
    const timer = setTimeout(() => setShowEffects(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleEmailSubmit = async (email: string) => {
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Subscription error:', error)
      }
    }
  }

  return (
    <>
      {/* SEO Structured Data - WebSite with Sitelinks Searchbox */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hand To Mouse",
            "alternateName": "HandToMouse",
            "url": "https://handtomouse.org",
            "description": "Independent creative direction and cultural strategy from Sydney"
          })
        }}
      />

      {/* SEO Structured Data - Organization */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hand To Mouse",
            "alternateName": "HandToMouse",
            "url": "https://handtomouse.org",
            "logo": "https://handtomouse.org/HTM-LOGO-ICON-WHITE.svg",
            "description": "Independent creative direction and cultural strategy from Sydney",
            "founder": {
              "@type": "Person",
              "name": "Nate Don",
              "alternateName": "Nathan Don",
              "jobTitle": "Creative Director & Cultural Strategist"
            },
            "sameAs": [
              "https://www.linkedin.com/in/nate-don",
              "https://github.com/handtomouse"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Sydney",
              "addressRegion": "NSW",
              "addressCountry": "AU"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "hello@handtomouse.org",
              "contactType": "Customer Service",
              "availableLanguage": ["English"]
            }
          })
        }}
      />

      {/* SEO Structured Data - Person (Founder) */}
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Nate Don",
            "alternateName": "Nathan Don",
            "jobTitle": "Creative Director & Cultural Strategist",
            "description": "Independent creative director and cultural strategist based in Sydney, working with startups, agencies, and cultural organizations to create meaningful digital experiences.",
            "url": "https://handtomouse.org",
            "sameAs": [
              "https://www.linkedin.com/in/nate-don",
              "https://github.com/handtomouse",
              "https://twitter.com/handtomouse",
              "https://www.instagram.com/handtomouse.studio"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Hand To Mouse",
              "url": "https://handtomouse.org"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Sydney",
              "addressRegion": "NSW",
              "addressCountry": "AU"
            },
            "knowsAbout": [
              "Creative Direction",
              "Cultural Strategy",
              "Brand Strategy",
              "Digital Strategy",
              "Experience Design",
              "Content Strategy"
            ]
          })
        }}
      />

      {/* SEO Structured Data - LocalBusiness + ProfessionalService */}
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["ProfessionalService", "LocalBusiness"],
            "name": "Hand To Mouse",
            "alternateName": "HandToMouse",
            "description": "Independent creative direction and cultural strategy from Sydney. Working with startups, agencies, and cultural organizations to create meaningful digital experiences.",
            "url": "https://handtomouse.org",
            "email": "hello@handtomouse.org",
            "image": "https://handtomouse.org/HTM-LOGO-ICON-WHITE.svg",
            "logo": "https://handtomouse.org/HTM-LOGO-ICON-WHITE.svg",
            "founder": {
              "@type": "Person",
              "name": "Nate Don",
              "alternateName": "Nathan Don",
              "jobTitle": "Creative Director & Cultural Strategist",
              "sameAs": [
                "https://www.linkedin.com/in/nate-don",
                "https://github.com/handtomouse",
                "https://www.instagram.com/handtomouse.studio"
              ]
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Sydney",
              "addressRegion": "NSW",
              "addressCountry": "AU",
              "postalCode": "2000"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-33.8688",
              "longitude": "151.2093"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Sydney"
              },
              {
                "@type": "State",
                "name": "New South Wales"
              },
              {
                "@type": "Country",
                "name": "Australia"
              }
            ],
            "priceRange": "$$-$$$",
            "currenciesAccepted": "AUD",
            "paymentAccepted": "Invoice, Bank Transfer",
            "knowsAbout": [
              "Creative Direction",
              "Cultural Strategy",
              "Brand Strategy",
              "Digital Strategy",
              "Experience Design",
              "Content Strategy",
              "Cultural Projects",
              "Storytelling",
              "Strategic Planning"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Creative Direction & Cultural Strategy Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Creative Direction",
                    "description": "Strategic creative vision and direction for digital experiences, brands, and cultural projects",
                    "serviceType": "Creative"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Cultural Strategy",
                    "description": "Cultural strategy and narrative development for organizations and creative initiatives",
                    "serviceType": "Strategy"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Digital Experience Design",
                    "description": "End-to-end digital experience design and development for meaningful engagement",
                    "serviceType": "Design & Development"
                  }
                }
              ]
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            }
          })
        }}
      />

      <main
        id="main-content"
        className="screen-curve"
        style={{
          background: '#000',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100dvh - var(--footer-height))',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          paddingLeft: 'var(--page-padding-x)',
          paddingRight: 'var(--page-padding-x)',
          paddingTop: 'var(--page-padding-y)'
        }}
      >
        {/* #5: Lazy-loaded decorative effects */}
        {showEffects && (
          <>
            <div className="light-leak" />
            <div className="film-grain" />
          </>
        )}

        {/* Screen Curve Inner Container with Bezel Shadow */}
        <div className="screen-curve-inner bezel-shadow" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BattleSystem>
            <TerminalTypewriter onEmailSubmit={handleEmailSubmit} />
          </BattleSystem>
        </div>
      </main>

      {/* Footer CTAs */}
      <FooterCTAs onContactClick={() => setIsContactModalOpen(true)} />

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  )
}
