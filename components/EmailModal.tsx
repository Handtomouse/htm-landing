'use client'

import { useState } from 'react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks! We\'ll notify you when we launch.')
        setEmail('')
        // Auto-close after 2 seconds on success
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setMessage('')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to submit. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
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
          padding: 'clamp(var(--grid-2x), 4vw, var(--grid-6x))',
          maxWidth: 'min(500px, 100% - 2rem)',
          width: '100%',
          maxHeight: '90dvh',
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
            top: 'max(var(--grid-2x), env(safe-area-inset-top))',
            right: 'max(var(--grid-2x), env(safe-area-inset-right))',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '10px',
            minWidth: '44px',
            minHeight: '44px',
            lineHeight: 1,
            transition: 'color 0.2s'
          }}
          aria-label="Close email signup modal"
        >
          ×
        </button>

        {/* Title */}
        <h2
          id="email-modal-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 4vw, 28px)',
            color: 'var(--accent)',
            marginBottom: 'var(--grid-2x)',
            textAlign: 'center'
          }}
        >
          Stay Updated
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: 'var(--muted)',
            marginBottom: 'var(--grid-4x)',
            textAlign: 'center',
            lineHeight: 1.6
          }}
        >
          Enter your email to be notified when we launch. No spam, just one email.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            style={{
              width: '100%',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--ink)',
              border: '1px solid var(--grid)',
              padding: 'var(--grid-2x)',
              marginBottom: 'var(--grid-2x)',
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

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            aria-label={status === 'loading' ? 'Sending email' : status === 'success' ? 'Successfully subscribed' : 'Subscribe to notifications'}
            style={{
              width: '100%',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(10px, 1.8vw, 12px)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: status === 'success' ? '#4CAF50' : 'var(--ink)',
              background: status === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'var(--accent)',
              border: 'none',
              padding: 'var(--grid-2x) var(--grid-4x)',
              minHeight: '44px',
              cursor: status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: status === 'loading' || status === 'success' ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (status === 'idle' || status === 'error') {
                e.currentTarget.style.background = 'rgba(255, 157, 35, 0.8)'
              }
            }}
            onMouseLeave={(e) => {
              if (status === 'idle' || status === 'error') {
                e.currentTarget.style.background = 'var(--accent)'
              }
            }}
          >
            {status === 'loading' ? 'SENDING...' : status === 'success' ? '✓ SUBSCRIBED' : 'NOTIFY ME'}
          </button>

          {message && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: status === 'success' ? '#4CAF50' : '#ff6b6b',
                marginTop: 'var(--grid-2x)',
                textAlign: 'center'
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
