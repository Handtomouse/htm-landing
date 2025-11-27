'use client'

import Image from 'next/image'
import BBOSCard from '@/components/BBOSCard'
import EmailCaptureForm from '@/components/EmailCaptureForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* BB-OS Frame/Container */}
      <div
        className="w-full max-w-5xl mx-auto border-2 rounded-none overflow-hidden"
        style={{
          borderColor: 'var(--grid)',
          background: 'var(--panel)'
        }}
      >
        {/* Status Bar (Optional BB-OS Chrome) */}
        <div
          className="h-10 border-b flex items-center justify-between px-4"
          style={{
            borderColor: 'var(--grid)',
            background: 'var(--bg)'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.75rem' }}>
            HTM://LOADING
          </span>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.75rem' }}>
              ●●● ◐ 88%
            </span>
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>●</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-12 space-y-[8vh]">

          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* HTM Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/HTM-LOGO-ICON-01.svg"
                alt="HandToMouse"
                width={120}
                height={120}
                className="pixel-art glow-orange-box transition-all duration-[var(--duration-slow)]"
                priority
              />
            </div>

            {/* Title with Glow */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider glow-orange"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent)'
              }}
            >
              HANDTOMOUSE
            </h1>

            {/* Subtitle */}
            <p
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink)'
              }}
            >
              LOADING...
            </p>

            {/* Description */}
            <p
              className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--muted)'
              }}
            >
              Independent creative direction and cultural strategy from Sydney.
              <br />
              Something special is being built. Get notified when we launch.
            </p>
          </div>

          {/* Spacer */}
          <div className="h-[4vh]" />

          {/* Email Capture in BB-OS Card */}
          <BBOSCard className="p-6 md:p-8" glow>
            <h2
              className="text-xl md:text-2xl mb-6 text-center"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent)'
              }}
            >
              GET NOTIFIED
            </h2>
            <EmailCaptureForm />
          </BBOSCard>

          {/* Spacer */}
          <div className="h-[6vh]" />

          {/* Footer */}
          <footer
            className="border-t pt-8 space-y-4"
            style={{ borderColor: 'var(--grid)' }}
          >
            <p
              className="text-center text-xs"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--muted)'
              }}
            >
              © {new Date().getFullYear()} HandToMouse Studio
            </p>
            <div className="flex gap-6 justify-center">
              <a
                href="https://github.com/Handtomouse"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-[var(--duration-fast)] hover:scale-105"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted)',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,157,35,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.textShadow = 'none'
                }}
              >
                GITHUB
              </a>
              <a
                href="https://instagram.com/handtomouse"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-[var(--duration-fast)] hover:scale-105"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted)',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,157,35,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.textShadow = 'none'
                }}
              >
                INSTAGRAM
              </a>
            </div>
          </footer>

        </div>
      </div>
    </main>
  )
}
