/**
 * app/directory/page.tsx
 * Main crafter directory listing page.
 * One concern: orchestrating server-side data fetch and composing directory UI.
 *
 * Uses server-component searchParams for data fetching so the grid is SSR'd.
 * DirectoryFilters is a client component using useSearchParams — needs Suspense.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import type { CommissionStatus, DirectoryFilters, DirectoryProfessionCategory } from '@/types/directory';
import { getCrafterDirectory, getDirectoryPlanets } from '@/lib/directory/queries';
import { DirectoryFilters as FiltersPanel } from '@/components/directory/directory-filters';
import { CrafterGrid } from '@/components/directory/crafter-grid';
import { PaginationControls } from '@/components/directory/pagination-controls';
import { NavHeader } from '@/components/ui/nav-header';

const BEACH = 'https://i0.wp.com/starsreach.com/wp-content/uploads/2025/01/Beach-Town.jpg';

export const metadata: Metadata = {
  title: 'Commerce Registry – Kodaxa Studios',
  description: 'Find skilled crafters in Stars Reach by profession, planet, and commission status. The Kodaxa Commerce Registry.',
};

const PAGE_SIZE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseFilters(params: Record<string, string | string[] | undefined>): DirectoryFilters {
  const str = (key: string) => {
    const val = params[key];
    return typeof val === 'string' ? val : undefined;
  };

  return {
    searchQuery: str('q') || undefined,
    planet: str('planet') || undefined,
    category: (str('category') as DirectoryProfessionCategory) || undefined,
    commissionStatus: (str('status') as CommissionStatus) || undefined,
    sortBy: (str('sort') as DirectoryFilters['sortBy']) || 'newest',
  };
}

export default async function DirectoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(0, parseInt(String(params.page ?? '0'), 10) || 0);
  const filters = parseFilters(params);

  const [{ crafters, total }, planets] = await Promise.all([
    getCrafterDirectory(filters, page, PAGE_SIZE),
    getDirectoryPlanets(),
  ]);

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page header */}
        <div className="relative overflow-hidden border border-sr-border bg-sr-surface/30 px-5 py-4 mb-6">
          <Image src={BEACH} alt="" fill className="object-cover opacity-[0.1] pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-amber-700 mb-1">
              Commerce Division · Commerce Registry
            </p>
            <h1 className="text-xl font-bold font-mono text-slate-100">Registered Artisans</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Locate registered artisans across the galaxy. Filter by operative capability, sector, or commission status.
            </p>
          </div>
        </div>

        {/* Filters — client component, needs Suspense */}
        <div className="mb-5">
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersPanel planets={planets} />
          </Suspense>
        </div>

        {/* Grid */}
        <CrafterGrid crafters={crafters} total={total} />

        {/* Pagination — client component, needs Suspense */}
        <Suspense fallback={null}>
          <PaginationControls page={page} total={total} pageSize={PAGE_SIZE} />
        </Suspense>

        {/* CTA for unregistered artisans */}
        <div className="relative overflow-hidden mt-10 border border-sr-border bg-sr-surface/40 p-5">
          <Image src={BEACH} alt="" fill className="object-cover opacity-[0.07] pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-1">
                Commerce Registry · Register Operative
              </p>
              <p className="text-sm font-mono text-slate-300">Are you a registered artisan in Stars Reach?</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Issue your listing so contract issuers can locate you by operative capability, sector, and commission status.
              </p>
            </div>
            <a
              href="/directory/me"
              className="shrink-0 inline-block px-5 py-2.5 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 hover:border-cyan-600 transition-all"
            >
              Issue Listing →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex gap-2 flex-wrap">
      {[180, 120, 130, 120, 100].map((w, i) => (
        <div
          key={i}
          className="h-7 bg-sr-surface border border-sr-border animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
