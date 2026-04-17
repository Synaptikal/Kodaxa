/**
 * pagination-controls.tsx
 * URL-driven pagination for the crafter directory.
 * One concern: prev/next page navigation via search params.
 */

'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface PaginationControlsProps {
  page: number;
  total: number;
  pageSize: number;
}

export function PaginationControls({ page, total, pageSize }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / pageSize);

  const navigate = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 0) {
        params.delete('page');
      } else {
        params.set('page', String(newPage));
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  if (totalPages <= 1) return null;

  const btnBase =
    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40';
  const btnActive =
    'bg-slate-700 text-slate-200 hover:bg-slate-600';

  return (
    <div className={`flex items-center justify-center gap-3 pt-6 ${isPending ? 'opacity-60' : ''}`}>
      <button
        onClick={() => navigate(page - 1)}
        disabled={page === 0 || isPending}
        className={`${btnBase} ${btnActive}`}
      >
        ← Prev
      </button>

      <span className="text-xs text-slate-500">
        Page {page + 1} of {totalPages}
      </span>

      <button
        onClick={() => navigate(page + 1)}
        disabled={page >= totalPages - 1 || isPending}
        className={`${btnBase} ${btnActive}`}
      >
        Next →
      </button>
    </div>
  );
}
