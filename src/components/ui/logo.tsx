'use client';

interface KodaxaMarkProps {
  size?: number;
  className?: string;
}

/**
 * Kodaxa Studios compass-rose logomark.
 * Approximates the commissioned design: 4 cardinal arms, 4 diagonal points,
 * inner ring, circuit arc traces, and amber-gold radial gradient.
 */
export function KodaxaMark({ size = 24, className = '' }: KodaxaMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Amber-gold radial gradient: bright center fading to deeper amber */}
        <radialGradient id="km-fill" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#fdd87a" />
          <stop offset="45%"  stopColor="#e8a44a" />
          <stop offset="100%" stopColor="#b96e18" />
        </radialGradient>

        {/* Glow filter — applied to the whole group */}
        <filter id="km-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(50,50)" filter="url(#km-glow)">

        {/* ── Cardinal arms (N / E / S / W) ────────────────────────── */}
        {/* Each is a kite: long tip, shoulder, inner base. */}
        {[0, 90, 180, 270].map(rot => (
          <path
            key={rot}
            transform={`rotate(${rot})`}
            d="M 0,-43 L -5.5,-23 L -4,-11 L 4,-11 L 5.5,-23 Z"
            fill="url(#km-fill)"
          />
        ))}

        {/* ── Diagonal points (NE / SE / SW / NW) ──────────────────── */}
        {/* Shorter kite shapes between the cardinal arms. */}
        {[45, 135, 225, 315].map(rot => (
          <path
            key={rot}
            transform={`rotate(${rot})`}
            d="M 0,-27 L -4,-16 L 0,-10 L 4,-16 Z"
            fill="url(#km-fill)"
          />
        ))}

        {/* ── Circuit arc traces (between each cardinal pair) ───────── */}
        {/* Each arc spans 70° centred on the 45° diagonal, at radius 19. */}
        {/* Arc 1: between N and E — 280° → 350° */}
        <path d="M 3.3,-18.7 A 19,19 0 0,1 18.7,-3.3"  stroke="#e8a44a" strokeWidth="1.6" />
        {/* Arc 2: between E and S — 10° → 80° */}
        <path d="M 18.7,3.3  A 19,19 0 0,1 3.3,18.7"   stroke="#e8a44a" strokeWidth="1.6" />
        {/* Arc 3: between S and W — 100° → 170° */}
        <path d="M -3.3,18.7 A 19,19 0 0,1 -18.7,3.3"  stroke="#e8a44a" strokeWidth="1.6" />
        {/* Arc 4: between W and N — 190° → 260° */}
        <path d="M -18.7,-3.3 A 19,19 0 0,1 -3.3,-18.7" stroke="#e8a44a" strokeWidth="1.6" />

        {/* ── Arc endpoint dots (circuit junction markers) ─────────── */}
        {[
          [  3.3, -18.7], [ 18.7,  -3.3],
          [ 18.7,   3.3], [  3.3,  18.7],
          [ -3.3,  18.7], [-18.7,   3.3],
          [-18.7,  -3.3], [ -3.3, -18.7],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.2" fill="#e8a44a" />
        ))}

        {/* ── Inner hub ring ────────────────────────────────────────── */}
        <circle r="9.5" stroke="#e8a44a" strokeWidth="1.4" opacity="0.75" />

        {/* ── Centre dot ────────────────────────────────────────────── */}
        <circle r="3.5" fill="url(#km-fill)" />

      </g>
    </svg>
  );
}
