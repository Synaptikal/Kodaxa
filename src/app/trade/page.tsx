import { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import TradePanel from './trade-panel';

export const metadata: Metadata = {
  title: 'Trade System | Kodaxa HQ',
  description: 'Manage vendor kiosk listings, track direct trades, and log market prices.',
};

export default function TradePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-900/50">
      <NavHeader />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              Trade System
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Track your vendor kiosk listings to avoid dropping below the item cap. Log your 
              direct sales and field observations of market prices to optimize your trade routes.
            </p>
          </div>
          
        {/* Client-side panel wrapper */}
        <TradePanel />
      </main>
    </div>
  );
}
