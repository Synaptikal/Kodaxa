'use client';

import { 
  useSessionLogs, 
  useKlaatuLedger, 
  useSkillProgress 
} from '@/hooks/use-dashboard';
import { SessionLogger } from '@/components/dashboard/session-logger';
import { BalanceSummary } from '@/components/dashboard/balance-summary';
import { SessionHistory } from '@/components/dashboard/session-history';
import { SkillProgressGrid } from '@/components/dashboard/skill-progress-grid';
import { KlaatuFlowChart } from '@/components/dashboard/klaatu-flow-chart';

/**
 * DashboardPanel
 * Client component that hydrates local data and orchestrates the dashboard widgets.
 */
export default function DashboardPanel() {
  const { 
    sessions, hydrated: sessionsHydrated, addSession, deleteSession, 
    totalDuration
  } = useSessionLogs();
  
  const { 
    hydrated: klaatuHydrated, addEntry: addKlaatu, 
    balance, income, expenses 
  } = useKlaatuLedger();
  
  const { 
    progress, hydrated: skillsHydrated, logXp, resetProfession 
  } = useSkillProgress();

  const isHydrated = sessionsHydrated && klaatuHydrated && skillsHydrated;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  // Handle new session logging & sync to other hooks
  const handleLogSession = (session: {
    date: string;
    duration_minutes: number;
    activities: { type: string; detail: string; planet?: string }[];
    klaatu_earned: number;
    klaatu_spent: number;
    xp_gained: Record<string, number>;
    notes?: string;
  }) => {
    // 1. Add session
    addSession({
      date: session.date,
      duration_minutes: session.duration_minutes,
      activities: session.activities as any,
      klaatu_earned: session.klaatu_earned,
      klaatu_spent: session.klaatu_spent,
      xp_gained: session.xp_gained,
      notes: session.notes,
    });

    // 2. Add Klaatu entries
    if (session.klaatu_earned > 0) {
      addKlaatu('mission', session.klaatu_earned, 'Session earnings');
    }
    if (session.klaatu_spent > 0) {
      addKlaatu('other', -session.klaatu_spent, 'Session expenses');
    }

    // 3. Log XP
    Object.entries(session.xp_gained).forEach(([profId, xp]) => {
      if (xp > 0) {
        logXp(profId, profId.split('.')[0], xp); // Note: Should ideally use a map for prof names if not cached
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <BalanceSummary 
        balance={balance}
        income={income}
        expenses={expenses}
        sessionCount={sessions.length}
        totalDuration={totalDuration}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Logger & Skills */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <SessionLogger onSubmit={handleLogSession} />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <SkillProgressGrid progress={progress} onReset={resetProfession} />
          </div>
        </div>

        {/* Right Column: Flow Chart & History */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <KlaatuFlowChart sessions={sessions} />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <SessionHistory sessions={sessions} onDelete={deleteSession} />
          </div>
        </div>
      </div>
    </div>
  );
}
