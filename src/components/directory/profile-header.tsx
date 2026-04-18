/**
 * profile-header.tsx
 * Operative dossier header for public crafter profiles.
 * One concern: crafter identity, commission status, and active professions.
 *
 * Hard-edge terminal aesthetic — matches site-wide design language.
 */

import Link from 'next/link';
import type { CrafterProfileFull } from '@/types/directory';
import {
  COMMISSION_LABELS, COMMISSION_COLORS, SKILL_LEVEL_LABELS,
  SPECIES_LABELS, ROLE_LABELS, ROLE_COLORS,
} from '@/types/directory';
import { StarRating } from '@/components/directory/star-rating';

export interface ProfileHeaderProps {
  profile: CrafterProfileFull;
  isOwn: boolean;
}

const PROFESSION_CHIP: Record<string, string> = {
  crafting:       'text-orange-400 border-orange-800/50 bg-orange-950/30',
  harvesting:     'text-lime-400 border-lime-800/50 bg-lime-950/30',
  scouting:       'text-emerald-400 border-emerald-800/50 bg-emerald-950/30',
  combat:         'text-red-400 border-red-800/50 bg-red-950/30',
  social:         'text-sky-400 border-sky-800/50 bg-sky-950/30',
  science:        'text-violet-400 border-violet-800/50 bg-violet-950/30',
  infrastructure: 'text-amber-400 border-amber-800/50 bg-amber-950/30',
};

export function ProfileHeader({ profile, isOwn }: ProfileHeaderProps) {
  return (
    <div className="border border-sr-border bg-sr-surface/30">

      {/* Dossier header bar */}
      <div className="border-b border-sr-border/60 px-5 py-2.5 bg-sr-surface/50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted">
            Operative Dossier
          </span>
          <span className="text-xs font-mono text-sr-subtle">·</span>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-sr-subtle">
            Commerce Registry
          </span>
          <span className="text-xs font-mono text-sr-subtle">·</span>
          <span className="text-xs font-mono uppercase tracking-[0.15em] text-sr-subtle">
            Classification: Public
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${COMMISSION_COLORS[profile.commission_status]}`}>
            {COMMISSION_LABELS[profile.commission_status]}
          </span>
          {profile.role !== 'client' && ROLE_COLORS[profile.role] && (
            <span className={`text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${ROLE_COLORS[profile.role]}`}>
              ● {ROLE_LABELS[profile.role]}
            </span>
          )}
          {profile.is_kodaxa_member && profile.role === 'client' && (
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border border-amber-700/50 bg-amber-900/20 text-amber-400">
              ● Kodaxa Member
            </span>
          )}
          {isOwn && (
            <Link href="/directory/me"
              className="text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors">
              Edit Dossier →
            </Link>
          )}
        </div>
      </div>

      {/* Identity block */}
      <div className="px-5 py-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted">
            Callsign · Operative
          </p>
          <h1 className="text-2xl font-black font-mono text-slate-100 tracking-wide">
            {profile.display_name}
          </h1>
          <p className="text-[10px] font-mono text-slate-500 tracking-[0.15em]">
            @{profile.in_game_name}
            {profile.species && (
              <span className="ml-2 text-sr-muted">
                · {SPECIES_LABELS[profile.species]}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <StarRating rating={profile.average_rating} count={profile.total_reviews} />
        </div>
      </div>

      {/* Operative brief */}
      {profile.bio && (
        <div className="border-t border-sr-border/40 px-5 py-4">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-sr-muted mb-2">
            Operative Brief
          </p>
          <p className="text-sm font-mono text-slate-300 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Field data */}
      {(profile.home_planet || profile.home_sector || profile.homestead_coords ||
        profile.maker_mark || profile.contact_method) && (
        <div className="border-t border-sr-border/40 px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
          {profile.home_planet     && <DossierField label="Home Planet"    value={profile.home_planet} />}
          {profile.home_sector     && <DossierField label="Sector"         value={profile.home_sector} />}
          {profile.homestead_coords && <DossierField label="Homestead"     value={profile.homestead_coords} />}
          {profile.maker_mark      && <DossierField label="Maker's Mark"   value={profile.maker_mark} accent="text-amber-400" />}
          {profile.contact_method  && <DossierField label="Contact Method" value={profile.contact_method} />}
        </div>
      )}

      {/* Active professions */}
      {profile.specializations.length > 0 && (
        <div className="border-t border-sr-border/40 px-5 py-4">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-sr-muted mb-3">
            Active Professions · {profile.specializations.length} registered
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((s) => (
              <div key={s.id}
                className={`flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-mono ${PROFESSION_CHIP[s.category] ?? 'text-slate-400 border-slate-700/50 bg-slate-900/30'}`}>
                <span className="font-semibold">{s.profession_name}</span>
                {s.skill_level && (
                  <span className="opacity-60">· {SKILL_LEVEL_LABELS[s.skill_level]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field label+value pair ──────────────────────────────────────────────

function DossierField({ label, value, accent = 'text-slate-300' }: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">{label}</p>
      <p className={`text-xs font-mono mt-0.5 ${accent}`}>{value}</p>
    </div>
  );
}
