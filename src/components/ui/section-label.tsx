/**
 * section-label.tsx
 * Standardized section heading for Kodaxa Studios.
 * One concern: the 9px mono uppercase tracking pattern used across all pages.
 *
 * Replaces the inline SectionLabel function copy-pasted in page.tsx and others.
 * Optional sub-text for secondary classification lines.
 */

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
