'use client';

import { useState, useTransition } from 'react';
import { RoleBadge } from '@/components/corp/role-badge';
import { setMemberRole } from '@/lib/corp/actions';
import type { CorpRole } from '@/types/corp';
import { ROLE_LABELS, canAdminister } from '@/types/corp';

interface RosterMember {
  id: string;
  display_name: string;
  in_game_name: string;
  role: CorpRole;
  home_planet: string | null;
  commission_status: string;
  created_at: string;
}

interface RosterPanelProps {
  members: RosterMember[];
  currentUserId: string;
  currentUserRole: CorpRole;
}

const ROLE_ORDER: CorpRole[] = ['ceo', 'officer', 'associate', 'contractor'];

export function RosterPanel({ members, currentUserId, currentUserRole }: RosterPanelProps) {
  const [search, setSearch] = useState('');

  const filtered = members.filter((m) =>
    m.display_name.toLowerCase().includes(search.toLowerCase()) ||
    m.in_game_name.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = ROLE_ORDER.reduce<Record<CorpRole, RosterMember[]>>((acc, role) => {
    acc[role] = filtered.filter((m) => m.role === role);
    return acc;
  }, {} as Record<CorpRole, RosterMember[]>);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-1">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">Corp HQ // Roster Manifest</p>
        <h1 className="text-xl font-bold font-mono text-slate-100">Roster Manifest</h1>
        <p className="text-xs text-slate-500">{members.length} personnel on record</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
        className="w-full max-w-sm bg-sr-bg border border-sr-border px-3 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none"
      />

      {ROLE_ORDER.map((role) => {
        const group = grouped[role];
        if (group.length === 0) return null;
        return (
          <div key={role} className="space-y-2">
            <div className="flex items-center gap-3">
              <RoleBadge role={role} size="xs" />
              <span className="text-[8px] font-mono text-slate-600">({group.length})</span>
              <div className="h-px flex-1 bg-sr-border" />
            </div>
            <div className="space-y-1">
              {group.map((m) => (
                <RosterRow
                  key={m.id}
                  member={m}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-xs text-slate-600 font-mono text-center py-8 border border-sr-border">
          No personnel matching search
        </p>
      )}
    </div>
  );
}

function RosterRow({
  member, currentUserId, currentUserRole,
}: {
  member: RosterMember;
  currentUserId: string;
  currentUserRole: CorpRole;
}) {
  const [isPending, startTransition] = useTransition();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const isSelf = member.id === currentUserId;
  const canChangeRole = canAdminister(currentUserRole) && !isSelf;

  const ASSIGNABLE: CorpRole[] = ['officer', 'associate', 'contractor', 'client'];

  function assignRole(role: CorpRole) {
    setShowRoleMenu(false);
    startTransition(async () => {
      await setMemberRole(member.id, role);
    });
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 border border-sr-border bg-sr-surface/40 hover:bg-sr-surface/80 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-slate-200 truncate">
          {member.display_name}
          {isSelf && <span className="text-[8px] text-slate-600 ml-1.5">(you)</span>}
        </p>
        <p className="text-[9px] font-mono text-slate-600">{member.in_game_name}</p>
      </div>
      {member.home_planet && (
        <span className="text-[9px] font-mono text-slate-600 hidden sm:inline shrink-0">{member.home_planet}</span>
      )}
      <span className="text-[8px] font-mono text-slate-700 shrink-0">
        {new Date(member.created_at).toLocaleDateString()}
      </span>
      {canChangeRole && (
        <div className="relative shrink-0">
          <button
            onClick={() => setShowRoleMenu((v) => !v)}
            disabled={isPending}
            className="text-[8px] font-mono text-slate-600 hover:text-slate-400 border border-slate-700 px-2 py-0.5 transition-colors disabled:opacity-40"
          >
            {isPending ? '...' : 'REASSIGN'}
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-sr-bg border border-sr-border shadow-xl min-w-[160px] py-1">
              {ASSIGNABLE.map((r) => (
                <button
                  key={r}
                  onClick={() => assignRole(r)}
                  className="w-full text-left px-3 py-1.5 text-[9px] font-mono text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
