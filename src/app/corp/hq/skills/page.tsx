import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUserProfile, getMemberSkills } from '@/lib/corp/queries';
import { SkillMatrix } from '@/components/corp/skill-matrix';

export const metadata: Metadata = { title: 'Member Skill Directory — Kodaxa HQ' };

export default async function SkillsPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/auth/sign-in');

  const members = await getMemberSkills();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-sr-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Member Skill Directory</h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse corporate roster capabilities and specializations to find crafters equipped for your orders.
          </p>
        </div>
      </div>
      <SkillMatrix members={members as Parameters<typeof SkillMatrix>[0]['members']} />
    </div>
  );
}
