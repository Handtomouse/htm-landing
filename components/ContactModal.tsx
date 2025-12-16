'use client'

import { useState, useEffect, useRef } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [formStartTime, setFormStartTime] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportHeight, setViewportHeight] = useState('100dvh')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)

  // Error states for real-time validation
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // XSS sanitization helper
  const sanitizeInput = (input: string) => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Email validation helper
  const validateEmail = (email: string) => {
    if (!email) return ''
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!regex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  // Character count color coding
  const getCountColor = () => {
    if (charCount > 990) return 'var(--warning-critical)'
    if (charCount > 950) return 'var(--warning-high)'
    if (charCount > 800) return 'var(--warning-medium)'
    return 'var(--muted)'
  }

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // iOS keyboard viewport fix
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`)
      } else {
        setViewportHeight(`${window.innerHeight}px`)
      }
    }
    window.visualViewport?.addEventListener('resize', handleResize)
    return () => window.visualViewport?.removeEventListener('resize', handleResize)
  }, [])

  // Track when form is opened (for bot prevention)
  useEffect(() => {
    if (isOpen && !formStartTime) {
      setFormStartTime(Date.now())
    }
  }, [isOpen, formStartTime])

  // Modal slide-in animation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  // ESC key handler for modal close
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Focus trap inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    // Save the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element on open
    setTimeout(() => firstElement?.focus(), 100)

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      // Restore focus when modal closes
      if (previousFocusRef.current && !isOpen) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  // Session storage draft saving
  useEffect(() => {
    if (isOpen && (name || email || subject || message)) {
      sessionStorage.setItem('contactDraft', JSON.stringify({ name, email, subject, message }))
    }
  }, [name, email, subject, message, isOpen])

  // Load draft on mount
  useEffect(() => {
    if (isOpen) {
      try {
        const draft = sessionStorage.getItem('contactDraft')
        if (draft) {
          const { name: draftName, email: draftEmail, subject: draftSubject, message: draftMessage } = JSON.parse(draft)
          if (!name) setName(draftName || '')
          if (!email) setEmail(draftEmail || '')
          if (!subject) setSubject(draftSubject || '')
          if (!message) {
            setMessage(draftMessage || '')
            setCharCount((draftMessage || '').length)
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [isOpen])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 1000) {
      setMessage(text)
      setCharCount(text.length)
      if (text.length >= 10) {
        setErrors(prev => ({ ...prev, message: '' }))
      }
    }
  }

  // Network retry mechanism
  const handleSubmitWithRetry = async (e: React.FormEvent, retryCount = 0): Promise<void> => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setStatus('loading')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizeInput(name.trim()),
          email: sanitizeInput(email.trim()),
          subject: sanitizeInput(subject.trim()),
          message: sanitizeInput(message.trim()),
          timestamp: formStartTime,
          consent: consent
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage(data.message || 'Thanks! We\'ll get back to you soon.')
        sessionStorage.removeItem('contactDraft')
        // Don't clear form immediately - let user see what they sent
        setTimeout(() => {
          setName('')
          setEmail('')
          setSubject('')
          setMessage('')
          setCharCount(0)
          setConsent(false)
          setStatus('idle')
          setStatusMessage('')
          setFormStartTime(null)
          onClose()
        }, 3000)
      } else {
        setStatus('error')
        setStatusMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      // Network error - retry up to 2 times
      if (retryCount < 2) {
        await new Promise(r => setTimeout(r, 1000))
        return handleSubmitWithRetry(e, retryCount + 1)
      }
      setStatus('error')
      setStatusMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    handleSubmitWithRetry(e, 0)
  }

  if (!isOpen) return null

  const isFormValid =
    name.trim().length >= 2 &&
    validateEmail(email) === '' &&
    email.includes('@') &&
    subject.trim().length >= 2 &&
    message.trim().length >= 10 &&
    message.trim().length <= 1000 &&
    consent

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: viewportHeight,
        backgroundColor: 'rgba(11, 11, 11, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        paddingTop: 'max(var(--grid-3x), env(safe-area-inset-top))',
        paddingBottom: 'max(var(--grid-3x), env(safe-area-inset-bottom))',
        paddingLeft: 'max(var(--grid-3x), env(safe-area-inset-left))',
        paddingRight: 'max(var(--grid-3x), env(safe-area-inset-right))'
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgba(11, 11, 11, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 157, 35, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? 'var(--grid-2x)' : 'clamp(var(--grid-2x), 2vh, var(--grid-3x))',
          maxWidth: 'min(600px, calc(100vw - var(--grid-4x)))',
          width: '100%',
          maxHeight: '85dvh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(255, 157, 35, 0.15), inset 0 1px 0 rgba(255, 157, 35, 0.1)',
          position: 'relative',
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'max(var(--grid-unit), env(safe-area-inset-top))',
            right: 'max(var(--grid-unit), env(safe-area-inset-right))',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '16px',
            minWidth: '48px',
            minHeight: '48px',
            lineHeight: 1,
            transition: 'color 0.2s'
          }}
          aria-label="Close contact form modal"
        >
          ×
        </button>

        {/* Title */}
        <h2
          id="contact-modal-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 5vw, 32px)',
            color: 'var(--accent)',
            marginBottom: 'var(--grid-2x)',
            textAlign: 'center'
          }}
        >
          Get In Touch
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            color: 'var(--muted)',
            marginBottom: isMobile ? 'var(--grid-unit)' : 'var(--grid-2x)',
            textAlign: 'center',
            lineHeight: 1.6,
            display: isMobile ? 'none' : 'block'
          }}
        >
          Have a project in mind? Let's talk.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: 'var(--grid-2x)' }}>
            <label
              htmlFor="contact-name"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                color: 'var(--muted)',
                marginBottom: 'var(--grid-unit)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (e.target.value.trim().length >= 2) {
                  setErrors(prev => ({ ...prev, name: '' }))
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim().length < 2 && e.target.value.length > 0) {
                  setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }))
                }
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Your Name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              disabled={status === 'loading' || status === 'success'}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: name ? 'rgba(255, 157, 35, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: errors.name ? '1px solid #ff6b6b' : '1px solid var(--grid)',
                borderLeft: name && !errors.name ? '3px solid var(--accent)' : undefined,
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
            />
            {errors.name && (
              <p id="name-error" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: '#ff6b6b',
                marginTop: 'var(--grid-unit)'
              }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: 'var(--grid-2x)' }}>
            <label
              htmlFor="contact-email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                color: 'var(--muted)',
                marginBottom: 'var(--grid-unit)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                const error = validateEmail(e.target.value)
                setErrors(prev => ({ ...prev, email: error }))
              }}
              onBlur={(e) => {
                const error = validateEmail(e.target.value)
                setErrors(prev => ({ ...prev, email: error }))
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="your@email.com"
              required
              autoComplete="email"
              disabled={status === 'loading' || status === 'success'}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: email ? 'rgba(255, 157, 35, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: errors.email ? '1px solid #ff6b6b' : '1px solid var(--grid)',
                borderLeft: email && !errors.email ? '3px solid var(--accent)' : undefined,
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
            />
            {errors.email && (
              <p id="email-error" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: '#ff6b6b',
                marginTop: 'var(--grid-unit)'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div style={{ marginBottom: 'var(--grid-2x)' }}>
            <label
              htmlFor="contact-subject"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                color: 'var(--muted)',
                marginBottom: 'var(--grid-unit)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Subject *
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (e.target.value.trim().length >= 2) {
                  setErrors(prev => ({ ...prev, subject: '' }))
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim().length < 2 && e.target.value.length > 0) {
                  setErrors(prev => ({ ...prev, subject: 'Subject must be at least 2 characters' }))
                }
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="What's this about?"
              required
              minLength={2}
              maxLength={200}
              disabled={status === 'loading' || status === 'success'}
              aria-invalid={errors.subject ? 'true' : 'false'}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: subject ? 'rgba(255, 157, 35, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: errors.subject ? '1px solid #ff6b6b' : '1px solid var(--grid)',
                borderLeft: subject && !errors.subject ? '3px solid var(--accent)' : undefined,
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
            />
            {errors.subject && (
              <p id="subject-error" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: '#ff6b6b',
                marginTop: 'var(--grid-unit)'
              }}>
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div style={{ marginBottom: 'var(--grid-2x)' }}>
            <label
              htmlFor="contact-message"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                color: getCountColor(),
                marginBottom: 'var(--grid-unit)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Message * ({charCount}/1000)
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={handleMessageChange}
              onBlur={(e) => {
                if (e.target.value.trim().length < 10 && e.target.value.length > 0) {
                  setErrors(prev => ({ ...prev, message: 'Message must be at least 10 characters' }))
                }
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Tell us about your project..."
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              disabled={status === 'loading' || status === 'success'}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: message ? 'rgba(255, 157, 35, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: errors.message ? '1px solid #ff6b6b' : '1px solid var(--grid)',
                borderLeft: message && !errors.message ? '3px solid var(--accent)' : undefined,
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none',
                resize: 'vertical',
                minHeight: 'clamp(80px, 12vh, 120px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
            />
            {errors.message && (
              <p id="message-error" style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: '#ff6b6b',
                marginTop: 'var(--grid-unit)'
              }}>
                {errors.message}
              </p>
            )}
            {charCount < 10 && charCount > 0 && !errors.message && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'var(--muted)',
                marginTop: 'var(--grid-unit)',
                opacity: 0.7
              }}>
                Minimum 10 characters
              </p>
            )}
          </div>

          {/* GDPR Consent Checkbox */}
          <div style={{ marginBottom: 'var(--grid-2x)' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--muted)',
              lineHeight: 1.6
            }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                disabled={status === 'loading' || status === 'success'}
                style={{
                  marginTop: '4px',
                  minWidth: '18px',
                  minHeight: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--accent)'
                }}
              />
              <span>I consent to processing my data for contact purposes as per the Privacy Policy *</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            ref={lastFocusableRef}
            type="submit"
            disabled={!isFormValid || status === 'loading' || status === 'success'}
            aria-label={status === 'loading' ? 'Sending message' : status === 'success' ? 'Message sent successfully' : 'Send contact message'}
            style={{
              width: '100%',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: status === 'success' ? '#4CAF50' : 'var(--ink)',
              background: status === 'success'
                ? 'rgba(76, 175, 80, 0.1)'
                : !isFormValid || status === 'loading'
                ? 'rgba(255, 157, 35, 0.3)'
                : 'var(--accent)',
              border: 'none',
              padding: 'clamp(var(--grid-2x), 2.5vh, var(--grid-3x)) var(--grid-4x)',
              minHeight: '48px',
              cursor: !isFormValid || status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: !isFormValid || status === 'loading' || status === 'success' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (isFormValid && (status === 'idle' || status === 'error')) {
                e.currentTarget.style.background = 'rgba(255, 157, 35, 0.8)'
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid && (status === 'idle' || status === 'error')) {
                e.currentTarget.style.background = 'var(--accent)'
              }
            }}
          >
            {status === 'loading' && (
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.6s linear infinite'
              }} />
            )}
            {status === 'loading' ? 'SENDING...' : status === 'success' ? '✓ SENT' : 'SEND MESSAGE'}
          </button>

          {/* Status Message with ARIA Live Region */}
          {statusMessage && (
            <div role="status" aria-live="polite" aria-atomic="true">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  color: status === 'success' ? '#4CAF50' : '#ff6b6b',
                  marginTop: 'var(--grid-2x)',
                  textAlign: 'center'
                }}
              >
                {statusMessage}
              </p>
            </div>
          )}
        </form>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  )
}
