'use client'

import { useState } from 'react'
import HwButton from './HwButton'

export default function EmailCaptureForm() {
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
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to submit. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            style={{
              fontFamily: 'var(--font-body)',
              background: 'var(--panel)',
              color: 'var(--ink)',
              borderColor: 'var(--grid)'
            }}
            className="
              flex-1 px-4 py-3
              border-2 rounded-none
              text-base
              placeholder:text-[var(--muted)]
              focus:outline-none
              focus:border-accent
              focus:shadow-[0_0_8px_rgba(255,157,35,0.3)]
              transition-all duration-[var(--duration-fast)]
              disabled:opacity-50
            "
          />
          <HwButton
            type="submit"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'SENDING...' : status === 'success' ? 'SUBSCRIBED' : 'NOTIFY ME'}
          </HwButton>
        </div>

        {message && (
          <p
            className={`text-center text-sm ${
              status === 'success' ? 'text-accent' : 'text-red-500'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {message}
          </p>
        )}
      </form>

      <p
        className="mt-4 text-center text-xs"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--muted)'
        }}
      >
        We&apos;ll send you one email when the full site launches. No spam.
      </p>
    </div>
  )
}
