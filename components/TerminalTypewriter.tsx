'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

const MAIN_MESSAGE = `HandToMouse Studio is
undergoing a scheduled
systems update.

We thank you for your
patience while our new
software is installed...`
const EMAIL_PROMPT = "> Enter your email: "
const BUTTON_PROMPT = "> "
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz_-./\\[]{}!<>=+*?#'

// Seeded random for stable character variations
const seededRandom = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

export default function TerminalTypewriter({ onEmailSubmit }: { onEmailSubmit?: (email: string) => void }) {
  // Convert message to character array for stable layout
  const messageChars = useMemo(() => MAIN_MESSAGE.split(''), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clearing' | 'email'>('typing')
  const [email, setEmail] = useState('')
  const [scrambleChar, setScrambleChar] = useState('')
  const [scrambleCount, setScrambleCount] = useState(0)
  const [justRevealed, setJustRevealed] = useState<number | null>(null)
  const [fadingOut, setFadingOut] = useState<number | null>(null)
  const [theme, setTheme] = useState<'white' | 'amber' | 'green' | 'blue'>('white')
  const [wpm, setWpm] = useState(0)
  const [shakeGlitch, setShakeGlitch] = useState(false)
  const [konamiCode, setKonamiCode] = useState<string[]>([])
  const [turboMode, setTurboMode] = useState(false)
  const [rainbowWave, setRainbowWave] = useState(false)
  const [carriageReturn, setCarriageReturn] = useState(false)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const typingStartTime = useRef<number>(Date.now())
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Cursor blink - variable speed based on phase (fast during typing, slow during pause)
  useEffect(() => {
    const blinkSpeed = phase === 'typing' ? 250 : 500
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, blinkSpeed)
    return () => clearInterval(cursorInterval)
  }, [phase])

  // Clear justRevealed after animation completes
  useEffect(() => {
    if (justRevealed !== null) {
      const timeout = setTimeout(() => setJustRevealed(null), 120)
      return () => clearTimeout(timeout)
    }
  }, [justRevealed])

  // Clear fadingOut after animation completes
  useEffect(() => {
    if (fadingOut !== null) {
      const timeout = setTimeout(() => setFadingOut(null), 80)
      return () => clearTimeout(timeout)
    }
  }, [fadingOut])

  // WPM Calculation
  useEffect(() => {
    if (phase === 'typing' && currentIndex > 0) {
      const timeElapsed = (Date.now() - typingStartTime.current) / 1000 / 60 // minutes
      const wordsTyped = currentIndex / 5 // standard: 5 characters = 1 word
      const calculatedWpm = Math.round(wordsTyped / timeElapsed)
      setWpm(calculatedWpm)
    }
  }, [currentIndex, phase])

  // Shake-to-Glitch Detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      const velocity = Math.sqrt(dx * dx + dy * dy)

      if (velocity > 50) {
        setShakeGlitch(true)
        setTimeout(() => setShakeGlitch(false), 300)
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (acc && (Math.abs(acc.x || 0) > 15 || Math.abs(acc.y || 0) > 15)) {
        setShakeGlitch(true)
        setTimeout(() => setShakeGlitch(false), 300)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }
  }, [])

  // Konami Code Detection
  useEffect(() => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

    const handleKeyDown = (e: KeyboardEvent) => {
      // Theme switching with Ctrl+T
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        const themes: Array<'white' | 'amber' | 'green' | 'blue'> = ['white', 'amber', 'green', 'blue']
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        setTheme(nextTheme)
        document.documentElement.setAttribute('data-theme', nextTheme)
        localStorage.setItem('terminal-theme', nextTheme)
        return
      }

      // Konami code tracking
      const newCode = [...konamiCode, e.key].slice(-10)
      setKonamiCode(newCode)

      if (newCode.join(',') === konamiSequence.join(',')) {
        setTurboMode(true)
        setRainbowWave(true)
        setTimeout(() => setRainbowWave(false), 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiCode, theme])

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal-theme') as 'white' | 'amber' | 'green' | 'blue' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  // Rainbow wave on completion
  useEffect(() => {
    if (phase === 'pause' && currentIndex === messageChars.length) {
      setRainbowWave(true)
      setTimeout(() => setRainbowWave(false), 2000)
    }
  }, [phase, currentIndex, messageChars.length])

  // Clear shake glitch
  useEffect(() => {
    if (shakeGlitch) {
      const timeout = setTimeout(() => setShakeGlitch(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [shakeGlitch])

  // Main typing logic with scramble effect
  useEffect(() => {
    if (phase === 'typing') {
      if (currentIndex < messageChars.length) {
        // Scramble phase: show 1 random character before revealing
        if (scrambleCount < 1) {
          const timeout = setTimeout(() => {
            // Generate random character from scramble set
            const randomChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            setScrambleChar(randomChar)
            setScrambleCount(prev => prev + 1)
          }, turboMode ? 2 : 30 + Math.random() * 20) // TURBO: 2ms, Normal: 30-50ms

          return () => clearTimeout(timeout)
        } else {
          // Reveal actual character immediately
          const currentChar = messageChars[currentIndex]
          // Vary typing speed based on character type for natural feel
          const baseDelay = turboMode ? 2 : 60 + Math.random() * 40 // TURBO: 2ms, Normal: 60-100ms
          // Slight variations for different character types
          const charDelay = currentChar === ' ' ? baseDelay * 0.7 : // Faster through spaces
                           currentChar === '\n' ? baseDelay * 1.5 : // Pause at line breaks
                           currentChar.match(/[.,!?]/) ? baseDelay * 1.3 : // Slight pause at punctuation
                           baseDelay
          const delay = turboMode ? 2 : charDelay

          const timeout = setTimeout(() => {
            setCurrentIndex(prev => prev + 1)
            setScrambleCount(0) // Reset scramble counter
            setScrambleChar('')
            setJustRevealed(currentIndex) // Track for elastic landing animation

            // Trigger carriage return animation on newlines
            if (currentChar === '\n') {
              setCarriageReturn(true)
              setTimeout(() => setCarriageReturn(false), 150)
            }
          }, delay)

          return () => clearTimeout(timeout)
        }
      } else {
        // Done typing, transition to pause
        setPhase('pause')
      }
    } else if (phase === 'pause') {
      // Pause before instant reset
      const pauseTimeout = setTimeout(() => {
        // Instant reset: just set currentIndex to 0 (characters become underscores)
        setCurrentIndex(0)
        setPhase('typing')
        // Reset typing start time for WPM calculation
        typingStartTime.current = Date.now()
      }, 2000)
      return () => clearTimeout(pauseTimeout)
    }
  }, [phase, currentIndex, scrambleCount, messageChars, turboMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onEmailSubmit) {
      onEmailSubmit(email)
    }
  }

  const handleCharClick = (index: number) => {
    // Only allow clicking revealed characters when not actively typing
    if (index < currentIndex && phase !== 'typing') {
      // Would implement re-scramble animation here
      console.log('Clicked character:', index)
    }
  }

  // Email validation
  const isValidEmail = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full scanline-overlay vignette">
        {phase !== 'email' ? (
          <p
            ref={messageRef}
            className="text-lg md:text-xl leading-relaxed px-4"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#EDECEC',
              textAlign: 'center',
              maxWidth: '600px'
            }}
          >
            {messageChars.map((char, i) => {
              // Newlines are always <br> regardless of typing state
              if (char === '\n') return <br key={i} />

              const elements = []

              // Already typed - show actual character with phosphor glow
              if (i < currentIndex) {
                const hueRotate = seededRandom(i, -2, 2)
                const brightness = seededRandom(i + 100, 0.98, 1.02)
                const letterSpacing = seededRandom(i + 200, -0.5, 0.5)

                elements.push(
                  <span
                    key={i}
                    className={`phosphor-glow ${i === justRevealed ? 'char-land' : ''} ${i === fadingOut ? 'char-fade-out' : ''}`}
                    style={{
                      filter: `hue-rotate(${hueRotate}deg) brightness(${brightness})`,
                      letterSpacing: `${letterSpacing}px`,
                      display: 'inline-block',
                      cursor: phase !== 'typing' ? 'pointer' : 'default'
                    }}
                    onClick={() => handleCharClick(i)}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                )
              }
              // Currently typing - show scramble character with motion blur
              else if (i === currentIndex && scrambleChar) {
                elements.push(
                  <span
                    key={i}
                    className="char-scramble"
                    style={{
                      display: 'inline-block',
                      fontWeight: 450
                    }}
                  >
                    {scrambleChar}
                  </span>
                )
              }
              // Not yet typed - show underscore placeholder with pulse
              else {
                elements.push(
                  <span key={i} className="placeholder-pulse">
                    {char === ' ' ? '\u00A0' : '_'}
                  </span>
                )
              }

              // Render cursor after currentIndex position
              if (i === currentIndex && phase === 'typing') {
                elements.push(
                  <span
                    key={`cursor-${i}`}
                    className="inline-block cursor-glow"
                    style={{
                      opacity: showCursor ? 1 : 0,
                      transition: 'opacity 0.1s'
                    }}
                  >
                    █
                  </span>
                )
              }

              return (
                <span key={i} style={{ display: 'inline' }}>
                  {elements}
                </span>
              )
            })}
          </p>
        ) : (
        // Email form
        <div
          className="flex flex-col items-center gap-4 px-4"
          style={{
            fontFamily: 'var(--font-body)',
            color: '#EDECEC'
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{EMAIL_PROMPT}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="bg-transparent px-2 py-1 text-lg focus:outline-none transition-all"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#EDECEC',
                  borderBottom: `2px solid ${
                    email.length === 0
                      ? '#EDECEC'
                      : isValidEmail
                        ? 'var(--accent)'
                        : '#ff4444'
                  }`,
                  boxShadow: email.length > 0
                    ? isValidEmail
                      ? '0 2px 8px rgba(255,157,35,0.5)'
                      : '0 2px 8px rgba(255,68,68,0.5)'
                    : 'none'
                }}
                autoComplete="email"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{BUTTON_PROMPT}</span>
              <button
                type="submit"
                disabled={!isValidEmail}
                className="px-4 py-2 border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#EDECEC',
                  borderColor: isValidEmail ? 'var(--accent)' : '#EDECEC',
                  boxShadow: isValidEmail ? '0 0 12px rgba(255,157,35,0.5)' : 'none'
                }}
              >
                [NOTIFY ME]
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </>
  )
}
