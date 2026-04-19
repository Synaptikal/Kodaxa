import { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import DashboardPanel from './dashboard-panel';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Kodaxa HQ',
  description: 'Log play sessions, track skill progress, and monitor Klaatu flow.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-900/50">
      <NavHeader />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Track your daily Stars Reach sessions, monitor Klaatu income versus expenses, 
              and map your skill progression over time. All data is securely stored locally 
              in your browser.
            </p>
          </div>
          
        {/* Client-side panel wrapper */}
        <DashboardPanel />
      </main>
    </div>
  );
}
