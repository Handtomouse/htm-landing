'use client'

import { useState, useEffect } from 'react'

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

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track when form is opened (for bot prevention)
  useEffect(() => {
    if (isOpen && !formStartTime) {
      setFormStartTime(Date.now())
    }
  }, [isOpen, formStartTime])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 1000) {
      setMessage(text)
      setCharCount(text.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          timestamp: formStartTime, // For bot prevention
          // Honeypot field intentionally omitted
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage(data.message || 'Thanks! We\'ll get back to you soon.')
        // Clear form
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        setCharCount(0)
        // Auto-close after 2 seconds on success
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setStatusMessage('')
          setFormStartTime(null)
        }, 2000)
      } else {
        setStatus('error')
        setStatusMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Failed to submit. Please try again.')
    }
  }

  if (!isOpen) return null

  const isFormValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    subject.trim().length >= 2 &&
    message.trim().length >= 10 &&
    message.trim().length <= 1000

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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
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
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg)',
          border: '2px solid var(--grid)',
          borderRadius: '0',
          padding: isMobile ? 'clamp(var(--grid-unit), 1.5vh, var(--grid-2x))' : 'clamp(var(--grid-2x), 2.5vh, var(--grid-3x))',
          maxWidth: 'min(600px, calc(100vw - var(--grid-4x)))',
          width: '100%',
          maxHeight: 'clamp(280px, 60dvh, 65dvh)',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
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
            padding: '8px',
            minWidth: '44px',
            minHeight: '44px',
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
            fontSize: 'clamp(22px, 4.5vw, 28px)',
            color: 'var(--accent)',
            marginBottom: isMobile ? 'var(--grid-unit)' : 'var(--grid-2x)',
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
          <div style={{ marginBottom: isMobile ? 'clamp(0.5rem, 1.5vh, var(--grid-unit))' : 'clamp(var(--grid-unit), 2vh, var(--grid-2x))' }}>
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              minLength={2}
              maxLength={100}
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: '1px solid var(--grid)',
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: isMobile ? 'clamp(0.5rem, 1.5vh, var(--grid-unit))' : 'clamp(var(--grid-unit), 2vh, var(--grid-2x))' }}>
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: '1px solid var(--grid)',
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Subject Field */}
          <div style={{ marginBottom: isMobile ? 'clamp(0.5rem, 1.5vh, var(--grid-unit))' : 'clamp(var(--grid-unit), 2vh, var(--grid-2x))' }}>
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
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              required
              minLength={2}
              maxLength={200}
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: '1px solid var(--grid)',
                padding: 'var(--grid-2x)',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 8px rgba(255, 157, 35, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Message Field */}
          <div style={{ marginBottom: isMobile ? 'clamp(0.5rem, 1.5vh, var(--grid-unit))' : 'clamp(var(--grid-unit), 2vh, var(--grid-2x))' }}>
            <label
              htmlFor="contact-message"
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
              Message * ({charCount}/1000)
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Tell us about your project..."
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--ink)',
                border: '1px solid var(--grid)',
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
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--grid)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {charCount < 10 && charCount > 0 && (
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

          {/* Submit Button */}
          <button
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
              opacity: !isFormValid || status === 'loading' || status === 'success' ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (isFormValid && status === 'idle' || status === 'error') {
                e.currentTarget.style.background = 'rgba(255, 157, 35, 0.8)'
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid && status === 'idle' || status === 'error') {
                e.currentTarget.style.background = 'var(--accent)'
              }
            }}
          >
            {status === 'loading' ? 'SENDING...' : status === 'success' ? '✓ SENT' : 'SEND MESSAGE'}
          </button>

          {/* Status Message */}
          {statusMessage && (
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
          )}
        </form>
      </div>
    </div>
  )
}
