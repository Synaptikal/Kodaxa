/**
 * footer.tsx
 * T1-10 — Upgraded site footer.
 * One concern: single-row minimal footer with star-glow base.
 *
 * Inspired by No Man's Sky (single-row minimal) + Lando Norris (star-glow base).
 * Replaces the previous 2-column footer.
 *
 * Radial gradient creates a subtle teal ambient glow rising from the base —
 * connects visually to the star field above it.
 */

import Link from 'next/link';

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Dispatch',    href: '/dispatch' },
  { label: 'Corporation', href: '/corporation' },
  { label: 'Commerce',    href: '/directory' },
  { label: 'Discord',     href: 'https://discord.gg/kodaxa' },
];

export function Footer() {
  return (
    <footer
      className="border-t border-[#00d4c8]/20 mt-16 bg-[#0a0d12]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 100%, rgba(0,212,200,0.04) 0%, transparent 60%)',
      }}
    >
      {/* Main row */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left — nav links */}
        <nav className="flex gap-6" aria-label="Footer navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-mono text-xs tracking-[0.2em] uppercase text-[#64748b] hover:text-[#00d4c8] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Center — wordmark */}
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#00d4c8]/50 select-none">
          KODAXA STUDIOS
        </span>

        {/* Right — attribution */}
        <p className="font-mono text-xs text-[#64748b]/50 tracking-[0.1em] text-center sm:text-right">
          Unofficial fan project · Not affiliated with Playable Worlds
        </p>
      </div>

      {/* Legal row */}
      <div className="border-t border-[#1a2535] py-3 text-center">
        <span className="font-mono text-[10px] text-[#64748b]/40 tracking-[0.15em]">
          © KODAXA STUDIOS · ALPHA BUILD · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
