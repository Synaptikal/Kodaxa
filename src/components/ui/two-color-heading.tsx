/**
 * two-color-heading.tsx
 * T1-06 — Two-color headline system.
 * One concern: white title + teal italic subhead pattern for page headers.
 *
 * Inspired by No Man's Sky (white title + orange italic subhead).
 * Apply to all major page headers and section openers.
 *
 * Mixed-weight rule: in longer titles, 1-2 key words may use teal italic.
 * Use the `accentWords` prop to highlight specific words in the title.
 *
 * Usage:
 *   <TwoColorHeading title="DATA TERMINAL" sub="266 items indexed" />
 *   <TwoColorHeading title="KODAXA STUDIOS" sub="Multi-planetary data science" size="xl" />
 */

interface TwoColorHeadingProps {
  title: string;
  sub?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Tag to render (default h1 for page headers, h2 for sections) */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
} satisfies Record<string, string>;

export function TwoColorHeading({
  title,
  sub,
  size = 'lg',
  as: Tag = 'h2',
  className = '',
}: TwoColorHeadingProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Tag
        className={`font-mono font-bold text-white tracking-[0.1em] uppercase ${SIZE_CLASSES[size]}`}
      >
        {title}
      </Tag>
      {sub && (
        <p className="font-mono text-sm italic text-[#00d4c8]">{sub}</p>
      )}
    </div>
  );
}
