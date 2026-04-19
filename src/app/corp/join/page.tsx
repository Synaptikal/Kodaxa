import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { NavHeader } from '@/components/ui/nav-header';
import { JoinForm } from '@/components/corp/join-form';

const CREW = 'https://i0.wp.com/starsreach.com/wp-content/uploads/2025/01/Rude-Dudes-w-Attitude_WEBSITE.jpg';
const PORTAL = 'https://i0.wp.com/starsreach.com/wp-content/uploads/2025/02/SR_Through-the-Portal-1.jpg';

export const metadata: Metadata = {
  title: 'Join Kodaxa Studios — Apply',
  description: 'Submit a recruitment application to join Kodaxa Studios, Stars Reach\'s data infrastructure and crafting corporation.',
};

export default function JoinPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-slate-200">
      <NavHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden border border-sr-border bg-sr-surface/30 p-5 space-y-2">
          <Image src={CREW} alt="" fill priority className="object-cover object-center opacity-[0.12] pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-cyan-700">
              Personnel Division — Recruitment
            </p>
            <h1 className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">
              JOIN KODAXA STUDIOS
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We recruit players who want to specialize, produce consistently, and contribute to shared
              infrastructure. Fill out the form below — a Division Head will review your application
              within 48 hours.
            </p>
          </div>
        </div>

        {/* What to expect */}
        <div className="relative overflow-hidden border border-sr-border bg-sr-surface/40 p-4 space-y-2">
          <Image src={PORTAL} alt="" fill className="object-cover opacity-[0.07] pointer-events-none" aria-hidden="true" />
          <p className="relative z-10 text-[9px] font-mono uppercase tracking-widest text-slate-600">What to Expect</p>
          <ul className="relative z-10 space-y-1.5">
            {[
              'Review within 48 hours by a Division Head',
              'Approved applicants receive Operative clearance',
              'Access to Corp HQ — commission board, roster, internal tools',
              'In-game Kodaxa badge on your Commerce Registry profile',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-cyan-700 font-mono shrink-0">◎</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <JoinForm />

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 pt-2">
          <Link href="/corporation" className="hover:text-slate-400 transition-colors">← Corp Profile</Link>
          <Link href="/directory" className="hover:text-slate-400 transition-colors">Commerce Registry</Link>
        </div>

      </main>
    </div>
  );
}
