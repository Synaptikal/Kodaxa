/**
 * section-label.tsx
 * Standardized section headings for Kodaxa Studios.
 * One concern: the section label pattern used across all pages.
 *
 * Two exports:
 *   SectionLabel     — original simple eyebrow label (no visual flanking)
 *   FlankedLabel     — T1-02 Destiny-style "— LABEL —" with flanking dash lines
 *
 * Replaces the inline SectionLabel function copy-pasted in page.tsx and others.
 */

// ── Simple eyebrow label ──────────────────────────────────────────────

interface SectionLabelProps {
  text: string;
  sub?: string;
  className?: string;
}

export function SectionLabel({ text, sub, className = '' }: SectionLabelProps) {
  return (
    <div className={className}>
      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-sr-muted">{text}</p>
      {sub && <p className="text-[11px] font-mono text-sr-muted mt-0.5">{sub}</p>}
    </div>
  );
}

// ── T1-02 Flanked label — "— LABEL —" with dash lines ────────────────
// Inspired by Destiny 2 / Bungie centered section headers.

interface FlankedLabelProps {
  text: string;
  /** Optional italic sub-line below the flanked header */
  sub?: string;
  className?: string;
}

export function FlankedLabel({ text, sub, className = '' }: FlankedLabelProps) {
  return (
    <div className={`flex flex-col items-center text-center mb-8 ${className}`}>
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-px bg-[#00d4c8]/25" />
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00d4c8]/70 whitespace-nowrap">
          {text}
        </span>
        <div className="flex-1 h-px bg-[#00d4c8]/25" />
      </div>
      {sub && (
        <p className="font-mono text-xs text-[#64748b] tracking-[0.15em] mt-1 italic">{sub}</p>
      )}
    </div>
  );
}
