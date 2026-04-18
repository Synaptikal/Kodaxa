/**
 * corporation/page.tsx
 * Kodaxa Studios — corporate identity page.
 * One concern: in-universe corporation profile, divisions, recruitment, and in-game presence.
 *
 * Server component — static content, no data fetching.
 * Written in-universe: Kodaxa Studios is presented as a real operating entity.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';

export const metadata: Metadata = {
  title: 'Corporation Registry — Kodaxa Studios',
  description:
    'Kodaxa Studios is a multi-planetary data infrastructure company operating in Stars Reach. Learn about our divisions, in-game presence, and how to join.',
};

export default function CorporationPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 space-y-10">

        {/* ── Corp identity ──────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-700">
            Corporation Registry — Public Record
          </p>
          <h1 className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">
            KODAXA STUDIOS
          </h1>
          <p className="text-sm text-sr-muted leading-relaxed max-w-2xl">
            Kodaxa Studios is a multi-planetary data science and software firm incorporated under
            Stars Reach galactic business law. We design, build, and operate the data infrastructure
            that crafters, builders, miners, and merchants rely on to operate efficiently across the galaxy.
          </p>
          <p className="text-sm text-sr-muted leading-relaxed max-w-2xl">
            We don&apos;t mine. We don&apos;t fight. We build the systems that help everyone else do those
            things better — and we run a vendor network that keeps the best refined materials and tools
            in circulation.
          </p>
        </div>

        {/* ── Founding charter ───────────────────────────────────────── */}
        <Section label="Founding Charter">
          <div className="space-y-4 text-sm text-sr-muted leading-relaxed">
            <p>
              Kodaxa Studios was established at Stars Reach early access with a single mandate:
              <em className="text-slate-300 not-italic"> build the tools the community needs before the community has to ask for them.</em>
            </p>
            <p>
              The galaxy is new. The patch notes are incomplete. The skill trees are changing weekly.
              Every crafter is flying blind, doing math in a notepad, asking strangers in Discord what
              the refining ratio is. We saw that gap and built a company around closing it.
            </p>
            <p>
              Our public tools are free. Our data is sourced from community contributions, official
              dev communications, and our own in-game testing. We publish everything we learn.
              Kodaxa doesn&apos;t hoard information — we index it and give it back.
            </p>
          </div>
        </Section>

        {/* ── Divisions ──────────────────────────────────────────────── */}
        <Section label="Operating Divisions">
          <div className="grid sm:grid-cols-2 gap-4">
            {DIVISIONS.map((div) => (
              <DivisionCard key={div.name} {...div} />
            ))}
          </div>
        </Section>

        {/* ── In-game presence ───────────────────────────────────────── */}
        <Section label="In-Game Presence">
          <div className="space-y-4 text-sm text-sr-muted leading-relaxed">
            <p>
              Kodaxa Studios operates a physical homestead in Stars Reach — a fully built-out
              headquarters structure serving as our base of operations, meeting location, and
              vendor hub.
            </p>
            <div className="border border-slate-800 bg-slate-900/40 p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <PresenceItem label="Homestead Type" value="Corporate HQ + Vendor Hub" />
                <PresenceItem label="Location" value="Coordinates published at launch" />
                <PresenceItem label="Vendor Kiosk" value="Active — refined materials, tools, consumables" />
                <PresenceItem label="Public Access" value="Open during business hours" />
              </div>
              <p className="text-xs text-sr-muted font-mono pt-1">
                Find us on Discord for real-time location and inventory updates.
              </p>
            </div>
            <p>
              Our vendor kiosk stocks items produced by Kodaxa associates — smelted ingots,
              refined alloys, crafted tools, and consumables from our cooking division.
              All items are produced to specification, not spec-crafted and listed hoping for luck.
            </p>
          </div>
        </Section>

        {/* ── Membership ─────────────────────────────────────────────── */}
        <Section label="Membership & Recruitment">
          <div className="space-y-4 text-sm text-sr-muted leading-relaxed">
            <p>
              Kodaxa is a crafting and data corporation. We recruit players who want to specialize,
              produce consistently, and contribute to shared infrastructure — not players looking for
              a social hub or combat guild.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {RECRUITMENT_TRACKS.map((track) => (
                <div key={track.title} className={`border p-4 space-y-1.5 ${track.border}`}>
                  <p className={`text-[9px] font-mono uppercase tracking-widest font-semibold ${track.color}`}>
                    {track.division}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-200">{track.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{track.description}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/corp/join"
                className="px-4 py-2 bg-amber-800/30 border border-amber-700/40 text-amber-300 text-sm font-mono hover:bg-amber-800/50 transition-all"
              >
                Apply to Kodaxa →
              </Link>
              <Link
                href="/directory"
                className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
              >
                Browse the Commerce Registry →
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Code of conduct ────────────────────────────────────────── */}
        <Section label="Associate Code of Conduct">
          <ul className="space-y-2">
            {CONDUCT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-sr-muted">
                <span className="text-cyan-700 font-mono shrink-0 mt-0.5">§{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

      </main>

      <footer className="border-t border-sr-border bg-sr-surface/30 px-4 py-4">
        <p className="text-xs text-sr-subtle font-mono text-center">
          Kodaxa Studios is an unofficial Stars Reach fan organization. Not affiliated with Playable Worlds.
        </p>
      </footer>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────

const DIVISIONS = [
  {
    name: 'Operations Division',
    color: 'text-teal-400',
    border: 'border-teal-800/40',
    bg: 'bg-teal-900/10',
    description: 'Manages the active tool suite — Skill Planner, Building Planner, and utility trackers. Responsible for build optimization consulting and homestead construction services.',
    tools: ['Skill Planner', 'Building Planner', 'XP Timer'],
  },
  {
    name: 'Intelligence Division',
    color: 'text-cyan-400',
    border: 'border-cyan-800/40',
    bg: 'bg-cyan-900/10',
    description: 'Collects, verifies, and publishes game data. Responsible for the Item Database, Recipe Database, and future data-collection tools including the Resource Atlas.',
    tools: ['Item Database', 'Recipe Database', 'Resource Atlas'],
  },
  {
    name: 'Commerce Division',
    color: 'text-amber-400',
    border: 'border-amber-800/40',
    bg: 'bg-amber-900/10',
    description: 'Operates the Commerce Registry, vendor network, and market intelligence systems. Manages crafter listings, vendor kiosk inventory, and inter-planetary trade coordination.',
    tools: ['Commerce Registry', 'Crafting Calculator', 'Market Prices'],
  },
  {
    name: 'Engineering Division',
    color: 'text-green-400',
    border: 'border-green-800/40',
    bg: 'bg-green-900/10',
    description: 'Constructs and maintains Kodaxa homestead infrastructure. Handles building projects for associates, manages the architectural design tool, and consults on structure planning.',
    tools: ['Building Planner', 'ADI'],
  },
  {
    name: 'Dispatch Division',
    color: 'text-violet-400',
    border: 'border-violet-800/40',
    bg: 'bg-violet-900/10',
    description: 'Manages communications, patch analysis, and public-facing content. Publishes the Kodaxa Dispatch newsletter and maintains relationships with the broader community.',
    tools: ['Patch Notes', 'Kodaxa Dispatch'],
  },
  {
    name: 'Workforce Division',
    color: 'text-slate-400',
    border: 'border-slate-700/40',
    bg: 'bg-slate-800/10',
    description: 'Handles personnel records, skill build consulting, and associate onboarding. Manages the My Terminal member portal and internal workforce intelligence data.',
    tools: ['My Terminal', 'Skill Planner'],
  },
];

const RECRUITMENT_TRACKS = [
  {
    division: 'Commerce Division',
    color: 'text-amber-600',
    border: 'border-amber-800/40',
    title: 'Crafter / Producer',
    description: 'You specialize in a profession and produce goods for the vendor network. Consistent output, quality focus, willing to coordinate with buyers.',
  },
  {
    division: 'Intelligence Division',
    color: 'text-cyan-600',
    border: 'border-cyan-800/40',
    title: 'Data Contributor',
    description: 'You play actively and submit accurate game data — recipes, item stats, resource locations. No coding required. Patch note reactors welcome.',
  },
  {
    division: 'Operations Division',
    color: 'text-teal-600',
    border: 'border-teal-800/40',
    title: 'Infrastructure / Builder',
    description: 'You focus on homestead construction, base design, or resource gathering operations. Willing to contribute to shared infrastructure projects.',
  },
];

const CONDUCT = [
  'Associates represent Kodaxa Studios in all in-game interactions. Conduct yourself as a professional organization, not a player gang.',
  'Data submissions must be accurate and sourced. Do not submit guesses as confirmed data.',
  'Vendor pricing is to be agreed upon with the Commerce Division before listing. We do not price-gouge or undercut the broader market without coordination.',
  'Associates share crafted goods and resources at internal rates when available. Internal economy comes before external market.',
  'Disputes are handled in Discord, not in-game or in public channels. Escalate to the relevant Division Head.',
  'Membership is voluntary and zero-obligation for casual contributors. Active associates are expected to maintain presence across at least one division.',
];

// ── Local components ──────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted shrink-0">{label}</p>
        <div className="h-px flex-1 bg-sr-border" />
      </div>
      {children}
    </section>
  );
}

function DivisionCard({
  name, color, border, bg, description, tools,
}: {
  name: string; color: string; border: string; bg: string; description: string; tools: string[];
}) {
  return (
    <div className={`border p-4 space-y-2.5 ${border} ${bg}`}>
      <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${color}`}>{name}</h3>
      <p className="text-xs text-sr-muted leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-1">
        {tools.map((t) => (
          <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PresenceItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-sr-muted">{label}</p>
      <p className="text-xs text-slate-300 mt-0.5">{value}</p>
    </div>
  );
}
