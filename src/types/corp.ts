/**
 * types/corp.ts
 * Type definitions for the Kodaxa Studios corp system.
 * Covers roles, commissions, and recruitment applications.
 */

// ── Roles ─────────────────────────────────────────────────────────────

export type CorpRole = 'ceo' | 'officer' | 'associate' | 'contractor' | 'client';

export const ROLE_LABELS: Record<CorpRole, string> = {
  ceo:        'Director',
  officer:    'Division Head',
  associate:  'Operative',
  contractor: 'Contracted Specialist',
  client:     'Client',
};

export const ROLE_COLORS: Record<CorpRole, { text: string; border: string; bg: string }> = {
  ceo:        { text: 'text-amber-300',  border: 'border-amber-600/50',  bg: 'bg-amber-900/20'  },
  officer:    { text: 'text-violet-300', border: 'border-violet-600/50', bg: 'bg-violet-900/20' },
  associate:  { text: 'text-teal-300',   border: 'border-teal-600/50',   bg: 'bg-teal-900/20'   },
  contractor: { text: 'text-cyan-300',   border: 'border-cyan-600/50',   bg: 'bg-cyan-900/20'   },
  client:     { text: 'text-slate-400',  border: 'border-slate-600/50',  bg: 'bg-slate-800/20'  },
};

// Permission helpers
export const canAccessHQ       = (r: CorpRole) => r !== 'client';
export const canManageRoster   = (r: CorpRole) => r === 'ceo' || r === 'officer';
export const canAdminister     = (r: CorpRole) => r === 'ceo';
export const canPostDispatch   = (r: CorpRole) => r === 'ceo' || r === 'officer';
export const isKodaxaMember    = (r: CorpRole) => r !== 'client';

// ── Commissions ───────────────────────────────────────────────────────

export type CommissionStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'cancelled';

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  pending:   'AWAITING RESPONSE',
  accepted:  'IN PROGRESS',
  completed: 'DELIVERED',
  declined:  'DECLINED',
  cancelled: 'CANCELLED',
};

export const COMMISSION_STATUS_COLORS: Record<CommissionStatus, string> = {
  pending:   'text-amber-400  border-amber-600/40  bg-amber-900/15',
  accepted:  'text-teal-400   border-teal-600/40   bg-teal-900/15',
  completed: 'text-cyan-400   border-cyan-600/40   bg-cyan-900/15',
  declined:  'text-red-400    border-red-600/40    bg-red-900/15',
  cancelled: 'text-slate-500  border-slate-600/40  bg-slate-800/15',
};

export interface Commission {
  id: string;
  client_id: string;
  assignee_id: string;
  title: string;
  description: string;
  item_type: string | null;
  quantity: number;
  budget_hint: string | null;
  planet: string | null;
  delivery_hint: string | null;
  deadline_hint: string | null;
  client_notes: string | null;
  assignee_notes: string | null;
  status: CommissionStatus;
  created_at: string;
  updated_at: string;
  // Joined
  client?: { id: string; display_name: string; in_game_name: string } | null;
  assignee?: { id: string; display_name: string; in_game_name: string } | null;
}

// ── Applications ──────────────────────────────────────────────────────

export type ApplicationTrack = 'crafter' | 'data_contributor' | 'builder' | 'other';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type Availability = 'casual' | 'semi_active' | 'active';

export const TRACK_LABELS: Record<ApplicationTrack, string> = {
  crafter:          'Crafter / Producer',
  data_contributor: 'Data Contributor',
  builder:          'Infrastructure / Builder',
  other:            'Other',
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  casual:      'Casual',
  semi_active: 'Semi-Active',
  active:      'Active',
};

export interface CorpApplication {
  id: string;
  applicant_id: string | null;
  in_game_name: string;
  discord_handle: string | null;
  track: ApplicationTrack;
  motivation: string;
  professions: string[] | null;
  availability: Availability | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── HQ stats ──────────────────────────────────────────────────────────

export interface HQStats {
  openCommissions: number;
  activeMembers: number;
  pendingApplications: number;
  completedThisMonth: number;
}
