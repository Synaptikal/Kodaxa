/**
 * section-divider.tsx
 * T1-01 — Cyberpunk-style `// PATH.NOTATION` section dividers.
 * One concern: structural section breaks with optional timestamp.
 *
 * Color: accent (teal) = Kodaxa corporate chrome.
 * Muted: sr-muted token (WCAG AA compliant) for timestamp/secondary text.
 */

interface SectionDividerProps {
  /** Dot-notation path label, e.g. "TOOL.REGISTRY" or "DISPATCH.FEED" */
  path: string;
  /** Optional right-aligned timestamp or metadata string */
  timestamp?: string;
  className?: string;
}

export function SectionDivider({ path, timestamp, className = '' }: SectionDividerProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-accent/20 pb-1 mb-6 mt-8 ${className}`}
    >
      <span className="font-mono text-xs text-accent/60 tracking-[0.2em] uppercase select-none">
        // {path}
      </span>
      {timestamp && (
        <span className="font-mono text-xs text-sr-muted tracking-[0.15em]">
          {timestamp}
        </span>
      )}
    </div>
  );
}
