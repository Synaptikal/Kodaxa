/**
 * two-color-heading.tsx
 * T1-06 — Two-color headline system.
 * One concern: white title + teal italic subhead pattern for page headers.
 *
 * Subhead uses accent (teal) = Kodaxa corporate identity color.
 * Applies to all major page headers and division openers.
 */

interface TwoColorHeadingProps {
  title: string;
  sub?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
        <p className="font-mono text-sm italic text-accent">{sub}</p>
      )}
    </div>
  );
}
