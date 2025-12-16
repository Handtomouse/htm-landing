'use client'

import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg)',
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            padding: 'var(--grid-4x)',
            zIndex: 9999
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              padding: 'var(--grid-6x)',
              border: '1px solid var(--grid)',
              borderRadius: '12px',
              backgroundColor: 'var(--panel)'
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(18px, 4vw, 24px)',
                marginBottom: 'var(--grid-3x)',
                color: 'var(--accent)'
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: 'var(--muted)',
                marginBottom: 'var(--grid-4x)'
              }}
            >
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px, 2vw, 13px)',
                color: 'var(--ink)',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: '999px',
                padding: 'var(--grid-unit) var(--grid-3x)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                minHeight: '44px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
