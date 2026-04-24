import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import FeedbackForm from '@/components/feedback/FeedbackForm';

export const metadata: Metadata = {
  title: 'Feedback — Kodaxa Studios',
  description: 'Submit bug reports, feature requests, data corrections, or general feedback for the Kodaxa Stars Reach toolkit.',
};

const INFO_ITEMS = [
  'Bug reports are triaged within 48 hours and patched in the next deploy',
  'Feature requests are tracked internally — high-demand items get prioritized',
  'Data issues are cross-checked against GUNC reference and official patch notes before correcting',
  'All submissions are visible only to Kodaxa Division Heads and above',
];

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden border border-sr-border bg-sr-surface/30 p-5 space-y-2">
          <Image
            src="/divisions/dispatch-portal.jpg"
            alt="" fill priority
            className="object-cover object-center opacity-[0.12] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-sr-muted/60">
              Kodaxa Studios — Community Relations
            </p>
            <h1 className="text-2xl font-black font-mono text-sr-text tracking-tight">
              SUBMIT FEEDBACK
            </h1>
            <p className="text-sm text-sr-muted leading-relaxed">
              Report bugs, request features, flag incorrect data, or share general thoughts.
              Every submission is read by the Kodaxa team.
            </p>
          </div>
        </div>

        {/* How we use feedback */}
        <div className="border border-sr-border bg-sr-surface/40 p-4 space-y-3">
          <p className="text-[9px] font-mono uppercase tracking-widest text-sr-muted/60">How We Use This</p>
          <ul className="space-y-1.5">
            {INFO_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-sr-muted">
                <span className="text-accent font-mono shrink-0 mt-px">◎</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <FeedbackForm />

        {/* Footer */}
        <div className="flex items-center gap-4 text-xs font-mono text-sr-muted/50 pt-2">
          <Link href="/" className="hover:text-sr-muted transition-colors">← Home</Link>
          <Link href="/corp/join" className="hover:text-sr-muted transition-colors">Join Kodaxa</Link>
          <Link href="/patch-notes" className="hover:text-sr-muted transition-colors">Patch Notes</Link>
        </div>

      </main>
    </div>
  );
}
