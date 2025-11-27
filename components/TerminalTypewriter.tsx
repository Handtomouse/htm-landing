'use client'

import { useState, useEffect } from 'react'

const MAIN_MESSAGE = "HandToMouse Studio is undergoing a scheduled systems update. We thank you for your patience while our new software is installed."
const EMAIL_PROMPT = "> Enter your email: "
const BUTTON_PROMPT = "> "

export default function TerminalTypewriter({ onEmailSubmit }: { onEmailSubmit?: (email: string) => void }) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clearing' | 'email'>('typing')
  const [email, setEmail] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  // Cursor blink (500ms interval)
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Main typing logic
  useEffect(() => {
    if (phase === 'typing') {
      if (charIndex < MAIN_MESSAGE.length) {
        // Variable speed: slow start, medium middle, fast end
        let delay = 50 // default fast
        if (charIndex < 20) delay = 200 // slow start
        else if (charIndex < 50) delay = 100 // medium

        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + MAIN_MESSAGE[charIndex])
          setCharIndex(prev => prev + 1)
        }, delay)

        return () => clearTimeout(timeout)
      } else {
        // Done typing, pause
        setPhase('pause')
        const pauseTimeout = setTimeout(() => {
          setPhase('clearing')
        }, 4000)
        return () => clearTimeout(pauseTimeout)
      }
    } else if (phase === 'clearing') {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1))
        }, 50) // fast backspace

        return () => clearTimeout(timeout)
      } else {
        // Done clearing, show email form
        setPhase('email')
      }
    }
  }, [phase, charIndex, displayText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onEmailSubmit) {
      onEmailSubmit(email)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl">
        {phase !== 'email' ? (
          // Main message typing
          <p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#ff9d23'
            }}
          >
            {displayText}
            <span
              className="inline-block"
              style={{
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s'
              }}
            >
              █
            </span>
          </p>
        ) : (
          // Email form
          <div
            className="space-y-4"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#ff9d23'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{EMAIL_PROMPT}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="flex-1 bg-transparent border-b-2 border-[#ff9d23] px-2 py-1 text-lg focus:outline-none focus:shadow-[0_2px_8px_rgba(255,157,35,0.5)] transition-shadow"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#ff9d23'
                  }}
                  autoComplete="email"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{BUTTON_PROMPT}</span>
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-[#ff9d23] hover:bg-[#ff9d23]/10 hover:shadow-[0_0_12px_rgba(255,157,35,0.5)] transition-all active:scale-95"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#ff9d23'
                  }}
                >
                  [NOTIFY ME]
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
