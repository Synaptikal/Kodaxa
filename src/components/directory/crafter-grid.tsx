/**
 * crafter-grid.tsx
 * Grid display for a list of crafter summary cards.
 * One concern: rendering the crafter card grid with empty/loading states.
 */

import type { CrafterSummary } from '@/types/directory';
import { CrafterCard } from '@/components/directory/crafter-card';

export interface CrafterGridProps {
  crafters: CrafterSummary[];
  total: number;
}

export function CrafterGrid({ crafters, total }: CrafterGridProps) {
  if (crafters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-400 text-sm mb-1">No crafters found</p>
        <p className="text-slate-600 text-xs">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] text-slate-600 mb-3">
        {total} crafter{total !== 1 ? 's' : ''} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {crafters.map((crafter) => (
          <CrafterCard key={crafter.id} crafter={crafter} />
        ))}
      </div>
    </div>
  );
}
