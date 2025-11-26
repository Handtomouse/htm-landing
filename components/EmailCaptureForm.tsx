'use client'

import { useState } from 'react'

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
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 bg-black border-2 border-bb-orange text-white font-vt323 text-xl placeholder-gray-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 bg-bb-orange text-black font-vt323 text-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'SENDING...' : status === 'success' ? 'SUBSCRIBED' : 'NOTIFY ME'}
          </button>
        </div>

        {message && (
          <p className={`text-center font-vt323 text-lg ${
            status === 'success' ? 'text-bb-orange' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}
      </form>

      <p className="mt-4 text-center text-gray-500 font-vt323 text-sm">
        We&apos;ll send you one email when the full site launches. No spam.
      </p>
    </div>
  )
}
