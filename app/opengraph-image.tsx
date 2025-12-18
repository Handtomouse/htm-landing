import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Hand To Mouse - Independent Creative Direction & Cultural Strategy'
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
        {/* Background grid pattern for BB-OS aesthetic */}
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
            gap: 40,
            zIndex: 1,
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {/* HTM Wordmark */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Hand To Mouse
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.02em',
              maxWidth: 900,
              fontFamily: 'monospace',
            }}
          >
            Independent creative direction and cultural strategy from Sydney
          </div>

          {/* Bottom bar with domain */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              fontSize: 28,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
            }}
          >
            handtomouse.org
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
