'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { RoleBadge } from '@/components/corp/role-badge';
import type { CorpRole } from '@/types/corp';
import { canManageRoster, canAdminister, canPostDispatch } from '@/types/corp';

interface HQLayoutProps {
  children: React.ReactNode;
  userRole: CorpRole;
  displayName: string;
  inGameName: string;
}

interface NavEntry {
  href: string;
  label: string;
  sublabel: string;
  glyph: string;
}

export function HQLayout({ children, userRole, displayName, inGameName }: HQLayoutProps) {
  const pathname = usePathname();

  const navEntries: NavEntry[] = [
    { href: '/corp/hq',              label: 'COMMAND CENTER',  sublabel: 'Overview & stats',       glyph: '◈' },
    { href: '/corp/hq/commissions',  label: 'COMMISSION BOARD',sublabel: 'Requests & pipeline',    glyph: '◎' },
    ...(canManageRoster(userRole) ? [
      { href: '/corp/hq/roster',     label: 'ROSTER MANIFEST', sublabel: 'Personnel & clearances', glyph: '◧' },
    ] : []),
    ...(canAdminister(userRole) ? [
      { href: '/corp/hq/admin',      label: 'ADMIN CONTROL',   sublabel: 'Applications & roles',   glyph: '⬡' },
    ] : []),
    ...(canPostDispatch(userRole) ? [
      { href: '/corp/hq/dispatch',   label: 'DISPATCH',         sublabel: 'Transmissions & drafts', glyph: '◉' },
    ] : []),
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-sr-bg text-slate-200">
      <NavHeader />

      {/* HQ identity strip */}
      <div className="border-b border-sr-border bg-sr-surface/60 px-4 py-1.5 flex items-center gap-3">
        <span className="text-xs font-mono text-sr-subtle tracking-[0.3em] uppercase">Kodaxa Studios</span>
        <span className="text-xs text-sr-subtle">·</span>
        <span className="text-xs font-mono text-cyan-800 tracking-[0.3em] uppercase font-semibold">Internal Systems</span>
        <span className="text-xs text-sr-subtle">·</span>
        <span className="text-xs font-mono text-sr-subtle tracking-[0.3em] uppercase">Corp HQ</span>
        <div className="flex-1" />
        <span className="text-xs font-mono text-sr-muted">{inGameName}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-52 border-r border-sr-border bg-sr-surface flex flex-col shrink-0">

          {/* Operative card */}
          <div className="p-4 border-b border-sr-border space-y-1.5">
            <p className="text-xs font-mono text-sr-muted uppercase tracking-widest">Clearance Level</p>
            <RoleBadge role={userRole} />
            <p className="text-xs text-slate-300 font-mono truncate">{displayName}</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-2">
            {navEntries.map((entry) => {
              const isActive = pathname === entry.href;
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`flex items-start gap-2.5 px-4 py-2.5 transition-colors group ${
                    isActive
                      ? 'bg-cyan-900/20 border-l-2 border-l-cyan-500'
                      : 'border-l-2 border-l-transparent hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`text-base leading-none mt-0.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {entry.glyph}
                  </span>
                  <div>
                    <p className={`text-xs font-mono font-bold tracking-widest ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {entry.label}
                    </p>
                    <p className="text-xs font-mono text-sr-muted mt-0.5">{entry.sublabel}</p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-sr-border">
            <Link href="/directory/me" className="text-xs font-mono text-sr-muted hover:text-slate-400 transition-colors">
              ← My Commerce Profile
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
