/**
 * profile-header.tsx
 * Header section for a crafter's public profile page.
 * One concern: rendering crafter identity, status, and contact details.
 */

import Link from 'next/link';
import type { CrafterProfileFull } from '@/types/directory';
import { COMMISSION_LABELS, COMMISSION_COLORS, SKILL_LEVEL_LABELS } from '@/types/directory';
import { StarRating } from '@/components/directory/star-rating';

export interface ProfileHeaderProps {
  profile: CrafterProfileFull;
  isOwn: boolean;
}

const CATEGORY_CHIP: Record<string, string> = {
  crafting:       'bg-orange-900/40 text-orange-300',
  harvesting:     'bg-lime-900/40 text-lime-300',
  scouting:       'bg-emerald-900/40 text-emerald-300',
  combat:         'bg-red-900/40 text-red-300',
  social:         'bg-sky-900/40 text-sky-300',
  science:        'bg-violet-900/40 text-violet-300',
  infrastructure: 'bg-amber-900/40 text-amber-300',
};

export function ProfileHeader({ profile, isOwn }: ProfileHeaderProps) {
  const commissionColor = COMMISSION_COLORS[profile.commission_status];
  const commissionLabel = COMMISSION_LABELS[profile.commission_status];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5 space-y-4">
      {/* Name + status row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{profile.display_name}</h1>
          <p className="text-xs text-slate-500 font-mono">{profile.in_game_name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`rounded-full px-3 py-1 text-xs font-medium border ${commissionColor}`}>
            {commissionLabel}
          </span>
          {isOwn && (
            <Link
              href="/directory/me"
              className="rounded-full px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={profile.average_rating} count={profile.total_reviews} />

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-slate-300 leading-relaxed">{profile.bio}</p>
      )}

      {/* Location + contact */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {profile.home_planet && (
          <InfoRow label="Planet" value={profile.home_planet} />
        )}
        {profile.home_sector && (
          <InfoRow label="Sector" value={profile.home_sector} />
        )}
        {profile.homestead_coords && (
          <InfoRow label="Homestead" value={profile.homestead_coords} />
        )}
        {profile.contact_method && (
          <InfoRow label="Contact" value={profile.contact_method} />
        )}
        {profile.maker_mark && (
          <InfoRow label="Maker's Mark" value={profile.maker_mark} />
        )}
      </div>

      {/* Specializations */}
      {profile.specializations.length > 0 && (
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                  CATEGORY_CHIP[s.category] ?? 'bg-slate-700 text-slate-300'
                }`}
              >
                <span className="font-medium">{s.profession_name}</span>
                {s.skill_level && (
                  <span className="opacity-70">· {SKILL_LEVEL_LABELS[s.skill_level]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-300">{value}</span>
    </div>
  );
}
