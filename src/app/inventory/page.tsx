import { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import InventoryPanel from './inventory-panel';

export const metadata: Metadata = {
  title: 'Inventory & Materials | Kodaxa HQ',
  description: 'Manage your personal stockpile, tools, and homestead storage crates.',
};

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-900/50">
      <NavHeader />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              Inventory Manager
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Track your materials stockpile, assign tools to your loadout, and configure your 
              homestead crates. Data is stored locally in your browser for fast access.
            </p>
          </div>
          
        {/* Client-side panel wrapper */}
        <InventoryPanel />
      </main>
    </div>
  );
}
