'use client'

import { useState, useEffect, useMemo, useRef, memo } from 'react'

const MAIN_MESSAGE = `We are currently
undergoing a
scheduled total
systems upgrade

Thanking you for
your patience &
patronage during
this time...`
const TAGLINE_LINE1 = `Independent creative direction`
const TAGLINE_LINE2 = `and cultural strategy from Sydney`
const EMAIL_PROMPT = "> Enter your email: "
const BUTTON_PROMPT = "> "
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz_-./\\[]{}!<>=+*?#'

// Seeded random for stable character variations
const seededRandom = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

const TerminalTypewriter = memo(function TerminalTypewriter({ onEmailSubmit }: { onEmailSubmit?: (email: string) => void }) {
  // Loading stage state: controls the intro animation sequence
  const [loadingStage, setLoadingStage] = useState<'fade-in' | 'center-hold' | 'slide-up' | 'complete'>('fade-in')

  // Ready to type state: true after loading complete + 500ms delay
  const [readyToType, setReadyToType] = useState(false)

  // Detect prefers-reduced-motion on mount
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Loading stage progression: fade-in → center-hold → slide-up → complete
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Stage 1: Fade in (500ms)
    timers.push(setTimeout(() => setLoadingStage('center-hold'), 500))

    // Stage 2: Hold at center (2500ms)
    timers.push(setTimeout(() => setLoadingStage('slide-up'), 3000))

    // Stage 3: Slide up (500ms animation)
    timers.push(setTimeout(() => setLoadingStage('complete'), 3500))

    return () => timers.forEach(clearTimeout)
  }, [])

  // Separate effect: Wait 500ms after loading completes before starting typing
  useEffect(() => {
    if (loadingStage === 'complete') {
      const timer = setTimeout(() => setReadyToType(true), 500)
      return () => clearTimeout(timer)
    }
  }, [loadingStage])

  // Convert message to character array for stable layout
  const messageChars = useMemo(() => MAIN_MESSAGE.split(''), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clearing' | 'email'>('typing')
  const [showTagline, setShowTagline] = useState(false)
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
  // Tagline scramble-decode effect
  const [taglineScramble, setTaglineScramble] = useState<{
    line1: string[]
    line2: string[]
  }>({
    line1: Array(TAGLINE_LINE1.length).fill(''),
    line2: Array(TAGLINE_LINE2.length).fill('')
  })
  const [taglineDecoded, setTaglineDecoded] = useState<{
    line1: boolean[]
    line2: boolean[]
  }>({
    line1: Array(TAGLINE_LINE1.length).fill(false),
    line2: Array(TAGLINE_LINE2.length).fill(false)
  })
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

  // Trigger tagline blur-in when typing reaches 50% (or immediately if reduced motion)
  useEffect(() => {
    const progress = currentIndex / messageChars.length
    if (prefersReducedMotion) {
      // Show immediately if reduced motion
      setShowTagline(true)
    } else if (progress >= 0.5 && !showTagline && phase === 'typing') {
      // Blur in at 50% progress
      setShowTagline(true)
    }
  }, [currentIndex, messageChars.length, showTagline, phase, prefersReducedMotion])

  // Tagline scramble-decode effect
  useEffect(() => {
    if (!showTagline || prefersReducedMotion) return

    // Scramble interval: continuously randomize undecoded characters
    const scrambleInterval = setInterval(() => {
      setTaglineScramble(prev => ({
        line1: prev.line1.map((_, i) =>
          taglineDecoded.line1[i]
            ? TAGLINE_LINE1[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ),
        line2: prev.line2.map((_, i) =>
          taglineDecoded.line2[i]
            ? TAGLINE_LINE2[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
      }))
    }, 40) // 40ms = 25fps scramble refresh rate

    // Decode interval: randomly decode characters
    const decodeInterval = setInterval(() => {
      setTaglineDecoded(prev => {
        const newLine1 = [...prev.line1]
        const newLine2 = [...prev.line2]

        // Decode line 1 characters randomly (15% probability per character per tick)
        newLine1.forEach((decoded, i) => {
          if (!decoded && Math.random() < 0.15) {
            newLine1[i] = true
          }
        })

        // Decode line 2 characters randomly (15% probability per character per tick)
        newLine2.forEach((decoded, i) => {
          if (!decoded && Math.random() < 0.15) {
            newLine2[i] = true
          }
        })

        return { line1: newLine1, line2: newLine2 }
      })
    }, 60) // 60ms decode tick rate

    return () => {
      clearInterval(scrambleInterval)
      clearInterval(decodeInterval)
    }
  }, [showTagline, taglineDecoded, prefersReducedMotion])

  // Main typing logic with scramble effect - only start when ready
  useEffect(() => {
    // Don't start typing until ready (loading complete + 500ms delay)
    if (!readyToType) return

    if (phase === 'typing') {
      if (currentIndex < messageChars.length) {
        // Scramble phase: show 1 random character before revealing
        if (scrambleCount < 1) {
          const timeout = setTimeout(() => {
            // Generate random character from scramble set
            const randomChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            setScrambleChar(randomChar)
            setScrambleCount(prev => prev + 1)
          }, turboMode ? 2 : 10 + Math.random() * 8) // TURBO: 2ms, Normal: 10-18ms

          return () => clearTimeout(timeout)
        } else {
          // Reveal actual character immediately
          const currentChar = messageChars[currentIndex]
          // Vary typing speed based on character type for natural feel
          const baseDelay = turboMode ? 2 : 10 + Math.random() * 8 // TURBO: 2ms, Normal: 10-18ms (~400-500 WPM)
          // Slight variations for different character types
          const charDelay = currentChar === ' ' ? baseDelay * 0.6 : // Faster through spaces
                           currentChar === '\n' ? baseDelay * 1.0 : // No pause at line breaks
                           currentChar.match(/[.,!?]/) ? baseDelay * 1.0 : // No pause at punctuation
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
        setShowTagline(false) // Hide tagline on reset
        // Reset tagline decode state
        setTaglineDecoded({
          line1: Array(TAGLINE_LINE1.length).fill(false),
          line2: Array(TAGLINE_LINE2.length).fill(false)
        })
        // Reset typing start time for WPM calculation
        typingStartTime.current = Date.now()
      }, 2000)
      return () => clearTimeout(pauseTimeout)
    }
  }, [phase, currentIndex, scrambleCount, messageChars, turboMode, readyToType])

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
      if (process.env.NODE_ENV === 'development') {
        console.log('Clicked character:', index)
      }
    }
  }

  // Email validation
  const isValidEmail = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <>
      <div
        className={`scanline-overlay vignette px-4 ${loadingStage === 'fade-in' || loadingStage === 'center-hold' ? 'loading-center-wrapper' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Loading intro: Wordmark + tagline start centered, then slide to final top position */}
        <div
          className={`loading-intro ${loadingStage}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(8px, 1.5vw, 16px)',
            marginBottom: 'clamp(var(--grid-6x), 8vw, var(--grid-12x))'
          }}
        >
          <img
            src="/HTM-LOGOS-WORDMARK.svg"
            alt="Hand To Mouse - Sydney Creative Director and Web Developer"
            className="wordmark-glow"
            style={{
              width: 'clamp(200px, 50.49vw, 336.6px)', // MOBILE FIX: min→clamp with 200px minimum (readable on 320px screens)
              height: 'auto',
              marginBottom: '0'
            }}
          />
          <div
            aria-label="Company tagline"
            className={`tagline-${loadingStage}`}
            style={{
              fontFamily: 'var(--font-body)',
              textAlign: 'center',
              fontSize: 'clamp(10px, 1.4vw, 13px)', // MOBILE FIX: 8.5px→10px minimum (much more readable)
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              maxWidth: 'min(510px, 90vw)',
              color: '#EDECEC'
            }}
          >
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>{TAGLINE_LINE1}</div>
            <div style={{ whiteSpace: 'nowrap' }}>{TAGLINE_LINE2}</div>
          </div>
        </div>

        {/* Hands - only show after loading complete, slide in from sides */}
        {loadingStage === 'complete' && (
          <>
            <div className="logo-container logo-left slide-in-from-left">
              <img
                src="/HTM-LOGO-ICON-WHITE.svg"
                alt="Hand To Mouse hand icon - left"
                style={{ width: 'clamp(50px, 10vw, 144px)', height: 'auto' }}
              />
            </div>

            <div className="logo-container logo-right slide-in-from-right">
              <img
                src="/HTM-LOGO-ICON-WHITE.svg"
                alt="Hand To Mouse hand icon - right"
                style={{ width: 'clamp(50px, 10vw, 144px)', height: 'auto' }}
              />
            </div>
          </>
        )}

        {/* Center Content Wrapper */}
        <div
          className={loadingStage === 'complete' ? 'fade-in-content' : ''}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            opacity: loadingStage === 'complete' ? 1 : 0
          }}
        >
        {/* Center Content */}
        {phase !== 'email' ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              maxWidth: 'min(600px, 90vw)'
            }}
          >
            <p
              ref={messageRef}
              className="leading-relaxed"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontFamily: 'var(--font-body)',
                color: '#EDECEC',
                textAlign: 'center',
                fontSize: 'clamp(16px, 2.5vw, 20px)', // MOBILE FIX: 14px→16px minimum (comfortable reading)
                marginTop: 'clamp(var(--grid-6x), 8vw, var(--grid-12x))'
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
        </div>
        ) : (
        // Email form
        <div
          className="flex flex-col items-center gap-4"
          style={{
            fontFamily: 'var(--font-body)',
            color: '#EDECEC',
            maxWidth: '600px'
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
        {/* End Center Content Wrapper */}
      </div>
    </>
  )
})

export default TerminalTypewriter
