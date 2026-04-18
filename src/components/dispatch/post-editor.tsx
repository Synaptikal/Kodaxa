/**
 * post-editor.tsx
 * In-app Dispatch post editor — metadata panel + block canvas.
 * One concern: composing and saving a DispatchPost to Supabase.
 *
 * Used by: /corp/hq/dispatch/new and /corp/hq/dispatch/[slug]/edit
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Block, DispatchPost, DispatchCategory } from '@/types/dispatch';
import { CATEGORY_LABELS } from '@/types/dispatch';
import { savePost, publishPost, unpublishPost, deletePost } from '@/lib/dispatch/actions';
import { BlockEditor } from '@/components/dispatch/block-editor';

const CATEGORIES: DispatchCategory[] = ['charter', 'field_report', 'patch_recap', 'division_brief', 'recruitment'];

const EMPTY_BLOCKS: Record<Block['kind'], Block> = {
  paragraph: { kind: 'paragraph', text: '' },
  heading:   { kind: 'heading',   level: 2, text: '' },
  quote:     { kind: 'quote',     text: '' },
  list:      { kind: 'list',      items: [''] },
  callout:   { kind: 'callout',   tone: 'info', text: '' },
  link_card: { kind: 'link_card', href: '', title: '', description: '' },
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const input = 'w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-200 placeholder:text-sr-subtle focus:border-cyan-700 focus:outline-none';
const lbl   = 'text-[10px] font-mono text-sr-muted uppercase tracking-[0.2em] mb-1 block';

interface PostEditorProps {
  existing?: DispatchPost | null;
}

export function PostEditor({ existing }: PostEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [newBlockKind, setNewBlockKind] = useState<Block['kind']>('paragraph');

  const [meta, setMeta] = useState({
    slug:     existing?.slug     ?? '',
    title:    existing?.title    ?? '',
    category: existing?.category ?? 'division_brief' as DispatchCategory,
    author:   existing?.author   ?? 'Kodaxa Command',
    eyebrow:  existing?.eyebrow  ?? '',
    ref_id:   existing?.ref_id   ?? '',
    tag:      existing?.tag      ?? '',
    summary:  existing?.summary  ?? '',
    tags:     existing?.tags?.join(', ') ?? '',
  });
  const [blocks, setBlocks] = useState<Block[]>(existing?.content ?? []);

  const setField = (k: keyof typeof meta) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setMeta((prev) => {
        const next = { ...prev, [k]: e.target.value };
        // Auto-derive slug from title on new posts
        if (k === 'title' && !existing) next.slug = slugify(e.target.value);
        return next;
      });

  function updateBlock(i: number, b: Block) {
    setBlocks((prev) => prev.map((x, idx) => (idx === i ? b : x)));
  }
  function removeBlock(i: number) {
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function addBlock() {
    setBlocks((prev) => [...prev, { ...EMPTY_BLOCKS[newBlockKind] } as Block]);
  }

  function buildInput() {
    return {
      slug:     meta.slug.trim(),
      title:    meta.title.trim(),
      category: meta.category,
      author:   meta.author.trim() || 'Kodaxa Command',
      eyebrow:  meta.eyebrow.trim() || undefined,
      ref_id:   meta.ref_id.trim()  || undefined,
      tag:      meta.tag.trim()     || undefined,
      summary:  meta.summary.trim(),
      tags:     meta.tags.split(',').map((t) => t.trim()).filter(Boolean),
      content:  blocks,
    };
  }

  function validate() {
    if (!meta.slug.trim()) return 'Slug is required.';
    if (!meta.title.trim()) return 'Title is required.';
    if (!meta.summary.trim()) return 'Summary is required.';
    return null;
  }

  function handleSave() {
    const err = validate();
    if (err) { setNotice({ kind: 'err', text: err }); return; }
    setNotice(null);
    startTransition(async () => {
      const res = await savePost(buildInput());
      if (res.success) {
        setNotice({ kind: 'ok', text: 'Draft saved.' });
        if (!existing) router.push(`/corp/hq/dispatch/${res.data!.slug}/edit`);
      } else {
        setNotice({ kind: 'err', text: res.error ?? 'Save failed.' });
      }
    });
  }

  function handlePublish() {
    const err = validate();
    if (err) { setNotice({ kind: 'err', text: err }); return; }
    setNotice(null);
    startTransition(async () => {
      const saveRes = await savePost(buildInput());
      if (!saveRes.success) { setNotice({ kind: 'err', text: saveRes.error ?? 'Save failed.' }); return; }
      const pubRes = await publishPost(meta.slug.trim());
      if (pubRes.success) {
        router.push(`/dispatch/${meta.slug.trim()}`);
      } else {
        setNotice({ kind: 'err', text: pubRes.error ?? 'Publish failed.' });
      }
    });
  }

  function handleUnpublish() {
    startTransition(async () => {
      const res = await unpublishPost(existing!.slug);
      if (res.success) setNotice({ kind: 'ok', text: 'Post retracted to draft.' });
      else setNotice({ kind: 'err', text: res.error ?? 'Failed.' });
    });
  }

  function handleDelete() {
    if (!confirm('Delete this post permanently?')) return;
    startTransition(async () => {
      const res = await deletePost(existing!.slug);
      if (res.success) router.push('/corp/hq/dispatch');
      else setNotice({ kind: 'err', text: res.error ?? 'Delete failed.' });
    });
  }

  const isPublished = existing?.status === 'published';

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Toolbar */}
      <div className="shrink-0 border-b border-sr-border bg-sr-surface/60 px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-sr-muted">Dispatch Editor</span>
          {existing && (
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 border ${isPublished ? 'text-teal-400 border-teal-700/40 bg-teal-950/30' : 'text-amber-400 border-amber-700/40 bg-amber-950/30'}`}>
              ● {isPublished ? 'Published' : 'Draft'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {notice && (
            <span className={`text-[10px] font-mono ${notice.kind === 'ok' ? 'text-teal-400' : 'text-red-400'}`}>
              {notice.text}
            </span>
          )}
          {existing && isPublished && (
            <button onClick={handleUnpublish} disabled={isPending} className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 disabled:opacity-40 transition-colors">
              Retract
            </button>
          )}
          {existing && (
            <button onClick={handleDelete} disabled={isPending} className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-red-800/40 text-red-500 hover:bg-red-950/30 disabled:opacity-40 transition-colors">
              Delete
            </button>
          )}
          <button onClick={handleSave} disabled={isPending} className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-sr-border text-sr-muted hover:text-slate-200 hover:border-slate-600 disabled:opacity-40 transition-colors">
            {isPending ? 'Saving…' : 'Save Draft'}
          </button>
          <button onClick={handlePublish} disabled={isPending} className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-cyan-700/60 text-cyan-300 bg-cyan-900/20 hover:bg-cyan-900/40 disabled:opacity-40 transition-colors">
            {isPending ? 'Working…' : isPublished ? 'Save & Republish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Metadata panel */}
        <aside className="w-72 shrink-0 border-r border-sr-border bg-sr-surface/20 overflow-y-auto p-4 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-sr-muted">Metadata</p>

          <div><span className={lbl}>Title *</span>
            <input value={meta.title} onChange={setField('title')} className={input} placeholder="Transmission title…" />
          </div>
          <div><span className={lbl}>Slug *</span>
            <input value={meta.slug} onChange={setField('slug')} className={input} placeholder="auto-derived-from-title" />
          </div>
          <div><span className={lbl}>Category</span>
            <select value={meta.category} onChange={setField('category')} className={input}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div><span className={lbl}>Author</span>
            <input value={meta.author} onChange={setField('author')} className={input} placeholder="Kodaxa Command" />
          </div>
          <div><span className={lbl}>Eyebrow (optional)</span>
            <input value={meta.eyebrow} onChange={setField('eyebrow')} className={input} placeholder="Division // Report #007" />
          </div>
          <div><span className={lbl}>Ref ID (optional)</span>
            <input value={meta.ref_id} onChange={setField('ref_id')} className={input} placeholder="KDXA-015" />
          </div>
          <div><span className={lbl}>Display Tag (optional)</span>
            <input value={meta.tag} onChange={setField('tag')} className={input} placeholder="DEPLOYMENT, ADVISORY…" />
          </div>
          <div><span className={lbl}>Summary *</span>
            <textarea value={meta.summary} onChange={setField('summary')} rows={3} className={`${input} resize-none`} placeholder="One-paragraph summary shown on the index…" />
          </div>
          <div><span className={lbl}>Tags (comma-separated)</span>
            <input value={meta.tags} onChange={setField('tags')} className={input} placeholder="commerce, crafting, update" />
          </div>
        </aside>

        {/* Block canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-sr-muted mb-3">
            Content Blocks · {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          </p>

          {blocks.length === 0 && (
            <div className="border border-sr-border bg-sr-surface/20 p-6 text-center">
              <p className="text-xs font-mono text-sr-muted">No blocks yet. Add one below.</p>
            </div>
          )}

          {blocks.map((block, i) => (
            <BlockEditor
              key={i}
              block={block}
              index={i}
              isFirst={i === 0}
              isLast={i === blocks.length - 1}
              onUpdate={(b) => updateBlock(i, b)}
              onRemove={() => removeBlock(i)}
              onMoveUp={() => moveBlock(i, -1)}
              onMoveDown={() => moveBlock(i, 1)}
            />
          ))}

          {/* Add block */}
          <div className="flex items-center gap-2 pt-2 border-t border-sr-border/60">
            <select
              value={newBlockKind}
              onChange={(e) => setNewBlockKind(e.target.value as Block['kind'])}
              className="bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none"
            >
              {(Object.keys(EMPTY_BLOCKS) as Block['kind'][]).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <button
              onClick={addBlock}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-sr-border text-sr-muted hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
              + Add Block
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
