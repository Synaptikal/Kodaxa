/**
 * directory-filters.tsx
 * Filter and search controls for the crafter directory.
 * One concern: providing search/filter UI that drives directory queries.
 *
 * This is a client component — filters update URL search params
 * so the directory page re-fetches server-side with the new params.
 */

'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { CommissionStatus, DirectoryProfessionCategory } from '@/types/directory';
import { COMMISSION_LABELS } from '@/types/directory';

export interface DirectoryFiltersProps {
  planets: string[];
}

const CATEGORY_OPTIONS: { value: DirectoryProfessionCategory; label: string }[] = [
  { value: 'crafting', label: 'Crafting' },
  { value: 'harvesting', label: 'Harvesting' },
  { value: 'scouting', label: 'Scouting' },
  { value: 'combat', label: 'Combat' },
  { value: 'social', label: 'Social' },
  { value: 'science', label: 'Science' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

const COMMISSION_OPTIONS: CommissionStatus[] = ['open', 'limited', 'closed'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];

export function DirectoryFilters({ planets }: DirectoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page'); // reset to page 0 on filter change
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  const current = (key: string) => searchParams.get(key) ?? '';

  const selectClass =
    'bg-slate-800 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none transition-colors';

  return (
    <div className={`flex flex-wrap gap-2 items-center ${isPending ? 'opacity-60' : ''}`}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search crafters..."
        defaultValue={current('q')}
        onChange={(e) => updateParam('q', e.target.value || null)}
        className="bg-slate-800 border border-slate-600 rounded-md px-3 py-1.5 text-xs text-slate-300 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none w-44"
      />

      {/* Planet */}
      <select
        value={current('planet')}
        onChange={(e) => updateParam('planet', e.target.value || null)}
        className={selectClass}
      >
        <option value="">All Planets</option>
        {planets.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Category */}
      <select
        value={current('category')}
        onChange={(e) => updateParam('category', e.target.value || null)}
        className={selectClass}
      >
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* Commission status */}
      <select
        value={current('status')}
        onChange={(e) => updateParam('status', e.target.value || null)}
        className={selectClass}
      >
        <option value="">Any Status</option>
        {COMMISSION_OPTIONS.map((s) => (
          <option key={s} value={s}>{COMMISSION_LABELS[s]}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={current('sort') || 'newest'}
        onChange={(e) => updateParam('sort', e.target.value)}
        className={selectClass}
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
