/**
 * items/page.tsx
 * Item Database — searchable reference for all Stars Reach items.
 * One concern: static item data browser with filter and search.
 *
 * Server component: data loaded at build time from src/data/items/.
 * Client filtering delegated to ItemsBrowser child component.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { ItemsBrowser } from '@/components/items/items-browser';
import { getAllItems } from '@/data/items/index';

export const metadata: Metadata = {
  title: 'Data Terminal — Kodaxa Studios',
  description: 'Browse all Stars Reach items, materials, equipment, and consumables. Kodaxa Data Terminal.',
};

export default function ItemsPage() {
  const items = getAllItems();

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <ItemsBrowser items={items} />
    </div>
  );
}
