'use client';

import type { CorpRole } from '@/types/corp';
import { ROLE_LABELS, ROLE_COLORS } from '@/types/corp';

interface RoleBadgeProps {
  role: CorpRole;
  size?: 'xs' | 'sm';
  className?: string;
}

export function RoleBadge({ role, size = 'sm', className = '' }: RoleBadgeProps) {
  const c = ROLE_COLORS[role];
  const text = size === 'xs'
    ? 'text-[8px] px-1.5 py-0.5 tracking-[0.2em]'
    : 'text-[9px] px-2 py-0.5 tracking-[0.25em]';

  return (
    <span className={`inline-flex items-center font-mono font-bold uppercase border ${text} ${c.text} ${c.border} ${c.bg} ${className}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
