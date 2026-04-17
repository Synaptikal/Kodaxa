/**
 * post-renderer.tsx
 * Renders a DispatchPost's typed block list as React elements.
 * One concern: block → component mapping.
 *
 * Pure — no client-side state. Safe to render from a server component.
 */

import Link from 'next/link';
import type { Block } from '@/types/dispatch';

export interface PostRendererProps {
  blocks: Block[];
}

export function PostRenderer({ blocks }: PostRendererProps) {
  return (
    <div className="prose-kodaxa space-y-4 text-slate-300 leading-relaxed">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'heading':
      return block.level === 2 ? (
        <h2 className="text-xl font-bold text-slate-100 pt-4 border-t border-slate-800">
          {block.text}
        </h2>
      ) : (
        <h3 className="text-base font-bold text-slate-100 pt-2">
          {block.text}
        </h3>
      );

    case 'paragraph':
      return <p className="text-sm text-slate-300 leading-relaxed">{block.text}</p>;

    case 'quote':
      return (
        <blockquote className="border-l-2 border-amber-700/50 pl-4 py-1 text-sm text-slate-400 italic">
          “{block.text}”
          {block.cite && (
            <footer className="mt-1 text-[11px] not-italic text-slate-500">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 text-sm text-slate-300`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </Tag>
      );
    }

    case 'callout': {
      const tone = CALLOUT_TONES[block.tone];
      return (
        <aside
          className={`rounded-lg border p-3 text-xs leading-relaxed ${tone}`}
        >
          {block.text}
        </aside>
      );
    }

    case 'link_card':
      return (
        <Link
          href={block.href}
          className="block rounded-lg border border-slate-700 bg-slate-900/60 p-3 hover:border-amber-700/50 transition-colors group"
        >
          <p className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
            {block.title} →
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {block.description}
          </p>
        </Link>
      );
  }
}

const CALLOUT_TONES: Record<'info' | 'warn' | 'success', string> = {
  info:    'border-cyan-800/50 bg-cyan-900/20 text-cyan-200',
  warn:    'border-amber-800/50 bg-amber-900/20 text-amber-200',
  success: 'border-emerald-800/50 bg-emerald-900/20 text-emerald-200',
};
