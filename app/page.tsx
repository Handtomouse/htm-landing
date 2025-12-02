'use client'

import TerminalTypewriter from '@/components/TerminalTypewriter'

export default function Home() {
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
    <main
      className="screen-curve"
      style={{
        background: '#000',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Light Leak Overlay */}
      <div className="light-leak" />

      {/* Film Grain Texture */}
      <div className="film-grain" />

      {/* Screen Curve Inner Container with Bezel Shadow */}
      <div className="screen-curve-inner bezel-shadow" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TerminalTypewriter onEmailSubmit={handleEmailSubmit} />
      </div>
    </main>
  )
}
