'use client'

import { useState, useEffect } from 'react'
import TerminalTypewriter from '@/components/TerminalTypewriter'
import BattleSystem from '@/components/BattleSystem'
import FooterCTAs from '@/components/FooterCTAs'
import ContactModal from '@/components/ContactModal'

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
      console.error('Subscription error:', error)
    }
  }

  return (
    <>
      <main
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
