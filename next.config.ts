import type { NextConfig } from 'next';

// NOTE: 'unsafe-eval' is required by Three.js/R3F for WebGL shader compilation.
// NOTE: 'unsafe-inline' on script-src is required by Next.js inline hydration scripts.
// NOTE: worker-src blob: is required by @xyflow/react for its web worker edge routing.
// TODO: Tighten script-src with nonces once Next.js nonce support is stable in v16.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://i0.wp.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://raw.githack.com",
  "worker-src blob:",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/starsreach.com/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy',   value: CSP },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
