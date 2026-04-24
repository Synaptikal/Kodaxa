import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kodaxa Studios — Stars Reach Data & Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080c16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,212,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Compass mark — two overlapping diamonds */}
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 28 }}>
          {/* Vertical elongated diamond (N/S) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '30%',
              width: '40%',
              height: '100%',
              background: 'linear-gradient(180deg, #fdd87a 0%, #e8a44a 50%, #b96e18 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
          {/* Horizontal elongated diamond (E/W) */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: 0,
              width: '100%',
              height: '40%',
              background: 'linear-gradient(90deg, #fdd87a 0%, #e8a44a 50%, #b96e18 100%)',
              clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
            }}
          />
          {/* Diagonal cross — top-right / bottom-left */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '80%',
              height: '80%',
              background: '#e8a44a',
              opacity: 0.55,
              clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)',
            }}
          />
          {/* Center hole */}
          <div
            style={{
              position: 'absolute',
              top: '37%',
              left: '37%',
              width: '26%',
              height: '26%',
              borderRadius: '50%',
              background: '#080c16',
            }}
          />
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#e8a44a',
            letterSpacing: '0.25em',
            lineHeight: 1,
          }}
        >
          KODAXA
        </div>

        {/* Studio sub-label */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: '#475569',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          STUDIOS
        </div>

        {/* Divider */}
        <div
          style={{
            width: 320,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #e8a44a50, transparent)',
            margin: '28px 0',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#94a3b8',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          Galaxy-scale data. Crafter-scale precision.
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 13,
            color: '#334155',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          Stars Reach Tools
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
