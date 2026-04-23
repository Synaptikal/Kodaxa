/**
 * section-divider.tsx
 * T1-01 — Cyberpunk-style `// PATH.NOTATION` section dividers.
 * One concern: structural section breaks with optional timestamp.
 *
 * Replaces bare <hr> and standalone section headings site-wide.
 * Inspired by Cyberpunk 2077 `/// .NEWS.MODULE_HIGHLIGHT` status bars.
 */

interface SectionDividerProps {
  /** Dot-notation path label, e.g. "TOOL.REGISTRY" or "DISPATCH.FEED" */
  path: string;
  /** Optional right-aligned timestamp or metadata string */
  timestamp?: string;
  /** Additional wrapper class overrides */
  className?: string;
}

export function SectionDivider({ path, timestamp, className = '' }: SectionDividerProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-[#00d4c8]/20 pb-1 mb-6 mt-8 ${className}`}
    >
      <span className="font-mono text-xs text-[#00d4c8]/60 tracking-[0.2em] uppercase select-none">
        // {path}
      </span>
      {timestamp && (
        <span className="font-mono text-xs text-[#64748b] tracking-[0.15em]">
          {timestamp}
        </span>
      )}
    </div>
  );
}
