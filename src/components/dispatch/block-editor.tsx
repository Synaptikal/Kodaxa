/**
 * block-editor.tsx
 * Inline editor for a single typed Block.
 * One concern: render edit controls for each block kind.
 *
 * Used by post-editor.tsx — receives block + mutation callbacks.
 */

'use client';

import type { Block } from '@/types/dispatch';

interface BlockEditorProps {
  block: Block;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (b: Block) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const input  = 'w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-200 placeholder:text-sr-subtle focus:border-cyan-700 focus:outline-none';
const label  = 'text-[10px] font-mono text-sr-muted uppercase tracking-[0.2em] mb-1 block';
const ctrl   = 'px-1.5 py-0.5 text-[10px] font-mono border border-sr-border text-sr-muted hover:text-slate-200 hover:border-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed';

export function BlockEditor({ block, index, isFirst, isLast, onUpdate, onRemove, onMoveUp, onMoveDown }: BlockEditorProps) {
  return (
    <div className="border border-sr-border bg-sr-surface/30 group">
      {/* Block header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-sr-border/60 bg-sr-surface/60">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-sr-muted">
          {block.kind}
          <span className="ml-2 text-sr-subtle">#{index + 1}</span>
        </span>
        <div className="flex gap-1">
          <button onClick={onMoveUp}   disabled={isFirst}  className={ctrl} title="Move up">↑</button>
          <button onClick={onMoveDown} disabled={isLast}   className={ctrl} title="Move down">↓</button>
          <button onClick={onRemove}                        className={`${ctrl} hover:text-red-400 hover:border-red-800/50`} title="Remove">✕</button>
        </div>
      </div>

      {/* Block-specific fields */}
      <div className="p-3 space-y-2">
        <BlockFields block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

function BlockFields({ block, onUpdate }: { block: Block; onUpdate: (b: Block) => void }) {
  switch (block.kind) {
    case 'paragraph':
      return (
        <div>
          <span className={label}>Text</span>
          <textarea
            value={block.text}
            rows={3}
            onChange={(e) => onUpdate({ ...block, text: e.target.value })}
            className={`${input} resize-y`}
            placeholder="Paragraph text…"
          />
        </div>
      );

    case 'heading':
      return (
        <div className="grid grid-cols-[100px,1fr] gap-2">
          <div>
            <span className={label}>Level</span>
            <select
              value={block.level}
              onChange={(e) => onUpdate({ ...block, level: Number(e.target.value) as 2 | 3 })}
              className={input}
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </div>
          <div>
            <span className={label}>Text</span>
            <input
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className={input}
              placeholder="Heading text…"
            />
          </div>
        </div>
      );

    case 'quote':
      return (
        <>
          <div>
            <span className={label}>Quote</span>
            <textarea
              value={block.text}
              rows={2}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className={`${input} resize-none`}
              placeholder="Quoted text…"
            />
          </div>
          <div>
            <span className={label}>Attribution (optional)</span>
            <input
              value={block.cite ?? ''}
              onChange={(e) => onUpdate({ ...block, cite: e.target.value || undefined })}
              className={input}
              placeholder="e.g. Director Vasquez, Q1 Review"
            />
          </div>
        </>
      );

    case 'list':
      return (
        <>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-mono text-sr-muted cursor-pointer">
              <input
                type="checkbox"
                checked={!!block.ordered}
                onChange={(e) => onUpdate({ ...block, ordered: e.target.checked })}
                className="accent-cyan-500"
              />
              Ordered list
            </label>
          </div>
          <div>
            <span className={label}>Items — one per line</span>
            <textarea
              value={block.items.join('\n')}
              rows={Math.max(3, block.items.length + 1)}
              onChange={(e) => onUpdate({ ...block, items: e.target.value.split('\n') })}
              className={`${input} resize-y`}
              placeholder={"Item one\nItem two\nItem three"}
            />
          </div>
        </>
      );

    case 'callout':
      return (
        <>
          <div>
            <span className={label}>Tone</span>
            <select
              value={block.tone}
              onChange={(e) => onUpdate({ ...block, tone: e.target.value as 'info' | 'warn' | 'success' })}
              className={input}
            >
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div>
            <span className={label}>Text</span>
            <textarea
              value={block.text}
              rows={2}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className={`${input} resize-none`}
              placeholder="Callout content…"
            />
          </div>
        </>
      );

    case 'link_card':
      return (
        <>
          <div>
            <span className={label}>Link URL</span>
            <input
              value={block.href}
              onChange={(e) => onUpdate({ ...block, href: e.target.value })}
              className={input}
              placeholder="/route or https://…"
            />
          </div>
          <div>
            <span className={label}>Card Title</span>
            <input
              value={block.title}
              onChange={(e) => onUpdate({ ...block, title: e.target.value })}
              className={input}
              placeholder="Link card heading…"
            />
          </div>
          <div>
            <span className={label}>Description</span>
            <textarea
              value={block.description}
              rows={2}
              onChange={(e) => onUpdate({ ...block, description: e.target.value })}
              className={`${input} resize-none`}
              placeholder="Brief description of the destination…"
            />
          </div>
        </>
      );
  }
}
