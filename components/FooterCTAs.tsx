'use client'

import { memo } from 'react'

interface CTAButton {
  label: string
  href?: string
  ariaLabel: string
  disabled?: boolean
  tooltip?: string
  action?: 'contact' // Special action for contact modal
}

interface FooterCTAsProps {
  onContactClick?: () => void
}

const LEFT_BUTTONS: CTAButton[] = [
  { label: 'Portfolio', href: '/NateDon_Portfolio_2025.pdf', ariaLabel: 'Download portfolio PDF' },
  { label: 'Instagram', href: 'https://www.instagram.com/handtomouse.studio/', ariaLabel: 'Visit our Instagram profile' }
]

const RIGHT_BUTTONS: CTAButton[] = [
  { label: 'Email', ariaLabel: 'Get in touch', action: 'contact' },
  { label: 'Wormhole', href: '/wormhole', ariaLabel: 'Enter the wormhole', disabled: false }
]

const FooterCTAs = memo(function FooterCTAs({ onContactClick }: FooterCTAsProps) {
  const handleClick = (button: CTAButton) => {
    if (button.disabled) return

    // Handle special contact action
    if (button.action === 'contact') {
      onContactClick?.()
      return
    }

    // Handle regular href navigation
    const href = button.href
    if (!href) return

    if (href.startsWith('mailto:')) {
      window.location.href = href
    } else if (href.endsWith('.pdf')) {
      // Open PDF in new tab
      window.open(href, '_blank', 'noopener,noreferrer')
    } else if (href.startsWith('/')) {
      // Internal route - use regular navigation
      window.location.href = href
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  const getButtonStyle = (disabled?: boolean) => ({
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(9px, 1.6vw, 12px)',
    color: disabled ? 'rgba(255, 255, 255, 0.2)' : 'var(--muted)',
    background: disabled ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--grid)',
    borderRadius: '999px',
    padding: 'var(--grid-unit) var(--grid-2x)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s var(--ease-luxury)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    minWidth: 'clamp(95px, 14vw, 120px)', // MOBILE FIX: 80px→95px (prevents text overflow on 320px)
    minHeight: '48px', // MOBILE FIX: 44px→48px (better touch target per Apple HIG)
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)',
    touchAction: 'manipulation' as const,
    opacity: disabled ? 0.5 : 1,
    position: 'relative' as const
  })

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        height: 'calc(var(--footer-height) + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--grid)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--grid-2x)',
          flexWrap: 'nowrap',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
          padding: '0 var(--page-padding-x)'
        }}
      >
        {/* All buttons in centered row */}
        {[...LEFT_BUTTONS, ...RIGHT_BUTTONS].map((button) => (
          <button
            key={button.label}
            onClick={() => handleClick(button)}
            className="footer-cta-button"
            aria-label={button.ariaLabel}
            disabled={button.disabled}
            title={button.tooltip}
            style={{
              ...getButtonStyle(button.disabled),
              flexShrink: 0
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </footer>
  )
})

export default FooterCTAs
