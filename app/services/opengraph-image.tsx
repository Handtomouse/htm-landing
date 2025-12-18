import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Creative Direction & Cultural Strategy Services in Sydney'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'monospace',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.3,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
            zIndex: 1,
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {/* Page title */}
          <div
            style={{
              fontSize: 56,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Services
          </div>

          {/* Main heading */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1.2,
              maxWidth: 900,
              fontFamily: 'monospace',
            }}
          >
            Creative Direction & Cultural Strategy
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.02em',
              maxWidth: 800,
              fontFamily: 'monospace',
            }}
          >
            For startups, agencies & cultural organizations in Sydney
          </div>

          {/* Bottom bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              fontSize: 24,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
            }}
          >
            handtomouse.org/services
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
