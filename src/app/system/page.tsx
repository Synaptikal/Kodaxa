/**
 * system/page.tsx
 * Kodaxa OS — Design System reference. Internal use only.
 * One concern: single source of truth for all visual tokens, components,
 * interaction patterns, and in-world vocabulary used across the site.
 *
 * Not linked from main nav. Access at /system.
 * Server component — no JS required.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import { SectionLabel } from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Design System — Kodaxa OS',
  robots: { index: false, follow: false },
};

// ── Section wrapper ────────────────────────────────────────────────────
function Section({ id, label, sub, children }: {
  id: string; label: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 scroll-mt-16">
      <div className="flex items-baseline gap-3 border-b border-sr-border pb-2">
        <SectionLabel text={label} sub={sub} />
      </div>
      {children}
    </section>
  );
}

// ── Color swatch ───────────────────────────────────────────────────────
function Swatch({ bg, label, hex }: { bg: string; label: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-8 w-full border border-sr-border/40 ${bg}`} />
      <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-[8px] font-mono text-slate-700">{hex}</p>
    </div>
  );
}

// ── Sample contract row ────────────────────────────────────────────────
function ContractRow({ id, item, qty, reward, state, claimer }: {
  id: string; item: string; qty: number; reward: string;
  state: 'queued' | 'claimed' | 'in-fabrication' | 'awaiting-transit' | 'fulfilled' | 'flagged';
  claimer?: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 border-b border-sr-border/40 hover:bg-sr-surface/60 transition-colors group">
      <span className="text-[9px] font-mono text-slate-600 shrink-0 w-28 tracking-wider">{id}</span>
      <span className="text-xs font-mono text-slate-300 flex-1">{item}</span>
      <span className="text-[10px] font-mono text-slate-500 w-8 text-right shrink-0">×{qty}</span>
      <span className="text-[10px] font-mono text-amber-500 w-20 text-right shrink-0">{reward}</span>
      <span className="text-[9px] font-mono text-slate-600 w-24 shrink-0">{claimer ?? '—'}</span>
      <Badge variant={state} className="shrink-0 w-32 justify-center" />
    </div>
  );
}

// ── Vocabulary row ─────────────────────────────────────────────────────
function VocabRow({ generic, inWorld, context }: { generic: string; inWorld: string; context: string }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-4 py-2 border-b border-sr-border/30 text-[10px] font-mono">
      <span className="text-slate-500">{generic}</span>
      <span className="text-cyan-400">{inWorld}</span>
      <span className="text-slate-700">{context}</span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function SystemPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-sr-bg text-sr-text">
      <NavHeader />

      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-8 px-6 py-8">

        {/* ── Sidebar nav ──────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-1 w-44 shrink-0 sticky top-24 self-start">
          <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-700 mb-2">Sections</p>
          {[
            ['colors',    'Color Tokens'],
            ['type',      'Typography'],
            ['divisions', 'Division System'],
            ['badges',    'Status Badges'],
            ['contracts', 'Contract States'],
            ['surfaces',  'Surfaces'],
            ['buttons',   'Buttons'],
            ['inputs',    'Inputs'],
            ['tables',    'Data Tables'],
            ['vocab',     'Vocabulary'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`}
              className="text-[10px] font-mono text-slate-600 hover:text-slate-300 transition-colors py-0.5 border-l border-sr-border/40 pl-2 hover:border-cyan-700">
              {label}
            </a>
          ))}
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="flex-1 space-y-14 min-w-0">

          {/* Page header */}
          <div className="space-y-1">
            <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-slate-700">
              Kodaxa OS · Internal Reference · Not for Distribution
            </p>
            <h1 className="text-2xl font-black font-mono text-slate-200 tracking-tight">
              Design System <span className="text-slate-700">v0.1-α</span>
            </h1>
            <p className="text-xs font-mono text-slate-600 max-w-xl">
              Canonical tokens, components, interaction patterns, and in-world vocabulary.
              All UI decisions defer to this document. Build from here, not from memory.
            </p>
          </div>

          {/* ── 01: Color Tokens ─────────────────────────────────── */}
          <Section id="colors" label="01 — Color Tokens" sub="All palette values defined in globals.css @theme">
            <div className="space-y-4">
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Base surfaces</p>
              <div className="grid grid-cols-6 gap-3">
                <Swatch bg="bg-sr-bg"      label="sr-bg"      hex="#0a0e14" />
                <Swatch bg="bg-sr-surface" label="sr-surface" hex="#111720" />
                <Swatch bg="bg-sr-panel"   label="sr-panel"   hex="#1a2030" />
                <Swatch bg="bg-sr-border"  label="sr-border"  hex="#1e2d40" />
                <Swatch bg="bg-sr-muted"   label="sr-muted"   hex="#6b7a90" />
                <Swatch bg="bg-sr-text"    label="sr-text"    hex="#e8edf5" />
              </div>
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider pt-2">Accent — primary actions, Intelligence division</p>
              <div className="grid grid-cols-6 gap-3">
                <Swatch bg="bg-cyan-950"  label="cyan-950"  hex="#083344" />
                <Swatch bg="bg-cyan-800"  label="cyan-800"  hex="#155e75" />
                <Swatch bg="bg-cyan-600"  label="cyan-600"  hex="#0891b2" />
                <Swatch bg="bg-cyan-400"  label="cyan-400"  hex="#22d3ee" />
                <Swatch bg="bg-teal-600"  label="teal-600"  hex="#0d9488" />
                <Swatch bg="bg-teal-400"  label="teal-400"  hex="#2dd4bf" />
              </div>
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider pt-2">State colors — warnings, contracts, categories</p>
              <div className="grid grid-cols-6 gap-3">
                <Swatch bg="bg-amber-500"   label="amber — warn"    hex="#f59e0b" />
                <Swatch bg="bg-red-500"     label="red — flagged"   hex="#ef4444" />
                <Swatch bg="bg-emerald-500" label="emerald — done"  hex="#10b981" />
                <Swatch bg="bg-sky-500"     label="sky — transit"   hex="#0ea5e9" />
                <Swatch bg="bg-violet-500"  label="violet — dispatch" hex="#8b5cf6" />
                <Swatch bg="bg-purple-500"  label="purple — wip"    hex="#a855f7" />
              </div>
            </div>
          </Section>

          {/* ── 02: Typography ────────────────────────────────────── */}
          <Section id="type" label="02 — Typography" sub="2 fonts max. Sans for body, mono for all data, IDs, labels, and UI chrome.">
            <Panel variant="elevated" className="p-5 space-y-4">
              <div className="space-y-3">
                <p className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Mono — JetBrains Mono · UI chrome, data, labels, IDs</p>
                <div className="space-y-2 border-l-2 border-sr-border pl-4">
                  <p className="text-[8px]  font-mono text-slate-400">text-[8px]  — STATUS DOTS · BADGE LABELS · METADATA</p>
                  <p className="text-[9px]  font-mono text-slate-400">text-[9px]  — Section labels · Division context · Timestamps</p>
                  <p className="text-[10px] font-mono text-slate-400">text-[10px] — Table data · Stat values · Nav items</p>
                  <p className="text-xs     font-mono text-slate-400">text-xs (12px) — Body mono · Code · IDs · Contract refs</p>
                  <p className="text-sm     font-mono text-slate-400">text-sm (14px) — Headings · Tool names · Primary actions</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-sr-border/40">
                <p className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Sans — Inter · Body copy only</p>
                <div className="space-y-2 border-l-2 border-sr-border pl-4">
                  <p className="text-[11px] text-slate-400">text-[11px] — Descriptions, help text, card body copy</p>
                  <p className="text-xs     text-slate-400">text-xs (12px) — Secondary body, footnotes</p>
                  <p className="text-sm     text-slate-400">text-sm (14px) — Primary body copy, paragraph text</p>
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-700 pt-2 border-t border-sr-border/40">
                Rule: if it is a number, ID, label, status, or UI element → mono. If it is a sentence → sans.
              </p>
            </Panel>
          </Section>

          {/* ── 03: Division System ───────────────────────────────── */}
          <Section id="divisions" label="03 — Division System" sub="5 divisions. Each has a canonical accent color applied to badges, nav, and tool cards.">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {([
                { variant: 'operations'  as const, color: 'border-teal-800',   tools: 'Skill Planner · Building · XP Timer' },
                { variant: 'intelligence'as const, color: 'border-cyan-800',   tools: 'Items · Recipes · Atlas · Biome · Creatures' },
                { variant: 'commerce'    as const, color: 'border-amber-800',  tools: 'Crafting · Directory · Makers · Market' },
                { variant: 'dispatch'    as const, color: 'border-violet-800', tools: 'Patch Notes · Newsletters' },
                { variant: 'personnel'   as const, color: 'border-slate-700',  tools: 'Profile · Terminal · Auth' },
              ]).map(({ variant, color, tools }) => (
                <Panel key={variant} variant="elevated" className={`p-4 space-y-2 border-t-2 ${color}`}>
                  <Badge variant={variant} />
                  <p className="text-[9px] font-mono text-slate-600 leading-relaxed">{tools}</p>
                </Panel>
              ))}
            </div>
          </Section>

          {/* ── 04: Status Badges ─────────────────────────────────── */}
          <Section id="badges" label="04 — Status Badges" sub="Tool deployment status. Use Badge component — never write inline badge classes.">
            <Panel variant="elevated" className="p-5">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="live" />
                <Badge variant="new" />
                <Badge variant="soon" />
                <Badge variant="beta" />
                <Badge variant="wip" />
              </div>
              <div className="mt-4 pt-4 border-t border-sr-border/40 space-y-1">
                <p className="text-[9px] font-mono text-slate-600">live — tool is fully operational and in production</p>
                <p className="text-[9px] font-mono text-slate-600">new — launched recently, may have rough edges</p>
                <p className="text-[9px] font-mono text-slate-600">soon — scheduled; not yet accessible</p>
                <p className="text-[9px] font-mono text-slate-600">beta — functional but behind an access gate</p>
                <p className="text-[9px] font-mono text-slate-600">wip — visible in dev builds only</p>
              </div>
            </Panel>
          </Section>

          {/* ── 05: Contract Lifecycle ────────────────────────────── */}
          <Section id="contracts" label="05 — Contract Lifecycle States" sub="Every Artisan Exchange contract moves through exactly these states.">
            {/* State pipeline diagram */}
            <div className="flex flex-wrap items-center gap-1 text-[8px] font-mono text-slate-600 mb-4">
              {(['queued','under-review','claimed','in-fabrication','awaiting-transit','fulfilled'] as const).map((s, i, arr) => (
                <span key={s} className="flex items-center gap-1">
                  <Badge variant={s} />
                  {i < arr.length - 1 && <span className="text-slate-700">→</span>}
                </span>
              ))}
              <span className="ml-2 text-slate-700">·</span>
              <Badge variant="flagged" className="ml-2" />
              <span className="text-slate-700 ml-1">(any stage)</span>
            </div>
            {/* Sample contract table */}
            <Panel variant="surface" className="overflow-hidden">
              <div className="grid grid-cols-[7rem_1fr_2rem_5rem_6rem_8rem] gap-4 px-4 py-2 border-b border-sr-border bg-sr-panel">
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Contract ID</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Item</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider text-right">Qty</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider text-right">Reward</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Claimer</span>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">State</span>
              </div>
              <ContractRow id="KDX-2406-0042" item="Refined Aluminum Plate"  qty={20} reward="480 KL"  state="queued"           />
              <ContractRow id="KDX-2406-0038" item="Composite Hull Segment"  qty={5}  reward="1,200 KL" state="in-fabrication" claimer="Vex_Morrow" />
              <ContractRow id="KDX-2406-0031" item="Bio-Polymer Sealant"     qty={50} reward="220 KL"  state="awaiting-transit" claimer="Oris.7" />
              <ContractRow id="KDX-2406-0024" item="Thermal Regulator Mk.II" qty={3}  reward="3,400 KL" state="fulfilled"      claimer="Cass_Vyne" />
              <ContractRow id="KDX-2406-0019" item="Dark Matter Capacitor"   qty={1}  reward="8,000 KL" state="flagged"        claimer="unknown_node" />
            </Panel>
            <p className="text-[9px] font-mono text-slate-700 mt-2">
              Contract IDs follow format: KDX-[YYMM]-[SEQUENCE]. Currency unit: KL (Klaatu).
            </p>
          </Section>

          {/* ── 06: Surfaces ──────────────────────────────────────── */}
          <Section id="surfaces" label="06 — Surfaces &amp; Panels" sub="4 levels of elevation. Use Panel component — never write bg/border inline.">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { variant: 'ghost'    as const, label: 'ghost',    note: 'border only, no fill. Outermost wrappers.' },
                { variant: 'inset'    as const, label: 'inset',    note: 'sr-bg fill. Recessed content areas.' },
                { variant: 'surface'  as const, label: 'surface',  note: 'sr-surface. Default card / panel.' },
                { variant: 'elevated' as const, label: 'elevated', note: 'sr-panel. Raised above surface.' },
              ]).map(({ variant, label, note }) => (
                <Panel key={variant} variant={variant} className="p-4 space-y-2">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-[9px] font-mono text-slate-600">{note}</p>
                </Panel>
              ))}
            </div>
            <p className="text-[9px] font-mono text-slate-700 mt-2">
              No border-radius on panels. Hard edges only. Rounded corners are SaaS UI language — not ours.
            </p>
          </Section>

          {/* ── 07: Buttons ───────────────────────────────────────── */}
          <Section id="buttons" label="07 — Buttons &amp; Actions" sub="One primary action per panel. Never stack two primary buttons side by side.">
            <Panel variant="elevated" className="p-5">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Primary */}
                <button className="px-4 py-2 text-xs font-mono font-semibold bg-cyan-600/20 border border-cyan-600/60 text-cyan-300 hover:bg-cyan-600/30 hover:border-cyan-500 transition-all tracking-wide">
                  TRANSMIT ORDER
                </button>
                {/* Secondary */}
                <button className="px-4 py-2 text-xs font-mono font-semibold bg-sr-surface border border-sr-border text-slate-300 hover:border-slate-600 hover:text-slate-100 transition-all tracking-wide">
                  AMEND ENTRY
                </button>
                {/* Ghost */}
                <button className="px-4 py-2 text-xs font-mono text-slate-500 border border-sr-border/40 hover:border-sr-border hover:text-slate-400 transition-all tracking-wide">
                  VIEW RECORD
                </button>
                {/* Confirm */}
                <button className="px-4 py-2 text-xs font-mono font-semibold bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/50 transition-all tracking-wide">
                  CONFIRM RECEIPT
                </button>
                {/* Destructive */}
                <button className="px-4 py-2 text-xs font-mono font-semibold bg-red-900/20 border border-red-700/40 text-red-400 hover:bg-red-900/40 transition-all tracking-wide">
                  PURGE RECORD
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-sr-border/40 space-y-1">
                <p className="text-[9px] font-mono text-slate-600">Primary (cyan) — the one action the user should take on this screen</p>
                <p className="text-[9px] font-mono text-slate-600">Secondary (surface) — edit, amend, or navigate to related record</p>
                <p className="text-[9px] font-mono text-slate-600">Ghost — low-priority navigation, view-only actions</p>
                <p className="text-[9px] font-mono text-slate-600">Confirm (emerald) — fulfillment, verification, completion</p>
                <p className="text-[9px] font-mono text-slate-600">Destructive (red) — irreversible actions; require confirmation modal</p>
              </div>
            </Panel>
          </Section>

          {/* ── 08: Inputs ────────────────────────────────────────── */}
          <Section id="inputs" label="08 — Inputs" sub="Terminal prompt aesthetic. No rounded corners. Mono font. Label above, always.">
            <Panel variant="elevated" className="p-5 space-y-5">
              {/* Text input */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-[8px] font-mono uppercase tracking-[0.25em] text-slate-600">
                  ITEM DESIGNATION
                </label>
                <div className="flex items-center border border-sr-border bg-sr-bg focus-within:border-cyan-700 focus-within:ring-1 focus-within:ring-cyan-700/30 transition-all">
                  <span className="px-3 text-[10px] font-mono text-slate-700 border-r border-sr-border py-2 shrink-0">›</span>
                  <input
                    readOnly
                    defaultValue="Refined Aluminum Plate"
                    className="flex-1 px-3 py-2 text-xs font-mono text-slate-300 bg-transparent placeholder-slate-700 focus:outline-none"
                  />
                </div>
              </div>
              {/* Search input */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-[8px] font-mono uppercase tracking-[0.25em] text-slate-600">
                  QUERY ARCHIVE
                </label>
                <div className="flex items-center border border-sr-border bg-sr-bg focus-within:border-cyan-700 transition-all">
                  <span className="px-3 text-[10px] font-mono text-slate-700 border-r border-sr-border py-2 shrink-0">⌕</span>
                  <input
                    readOnly
                    placeholder="Search schematics, items, operatives…"
                    className="flex-1 px-3 py-2 text-xs font-mono text-slate-300 bg-transparent placeholder-slate-700 focus:outline-none"
                  />
                </div>
              </div>
              {/* Select */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-[8px] font-mono uppercase tracking-[0.25em] text-slate-600">
                  OPERATIONAL SECTOR
                </label>
                <select className="w-full px-3 py-2 text-xs font-mono text-slate-300 bg-sr-bg border border-sr-border focus:border-cyan-700 focus:outline-none transition-all appearance-none">
                  <option>All Sectors</option>
                  <option>Cradle</option>
                  <option>Frontier</option>
                </select>
              </div>
              <p className="text-[9px] font-mono text-slate-700 border-t border-sr-border/40 pt-3">
                Rule: labels are always above inputs, always mono, always uppercase with wide tracking.
                The › prompt glyph signals user-editable fields. ⌕ signals search/query fields.
              </p>
            </Panel>
          </Section>

          {/* ── 09: Data Tables ───────────────────────────────────── */}
          <Section id="tables" label="09 — Data Tables" sub="Tabular numbers throughout. Header row on sr-panel, data rows on sr-surface, hover on sr-surface/60.">
            <Panel variant="surface" className="overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_6rem_6rem_8rem] gap-4 px-4 py-2 bg-sr-panel border-b border-sr-border">
                {['Schematic', 'Station', 'Yield', 'Status'].map((h) => (
                  <span key={h} className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{h}</span>
                ))}
              </div>
              {/* Data rows */}
              {[
                { name: 'Composite Hull Segment',  station: 'Fabricator',  yield: '1 unit',    status: 'live' as const },
                { name: 'Bio-Polymer Sealant',      station: 'Chemistry',   yield: '10 units',  status: 'live' as const },
                { name: 'Dark Matter Capacitor',    station: 'Quantum Rig', yield: '1 unit',    status: 'beta' as const },
                { name: 'Thermal Regulator Mk.III', station: 'Fabricator',  yield: '1 unit',    status: 'wip'  as const },
              ].map((row) => (
                <div key={row.name} className="grid grid-cols-[1fr_6rem_6rem_8rem] gap-4 px-4 py-2.5 border-b border-sr-border/40 hover:bg-sr-surface/60 transition-colors">
                  <span className="text-xs font-mono text-slate-300">{row.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{row.station}</span>
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums">{row.yield}</span>
                  <Badge variant={row.status} />
                </div>
              ))}
            </Panel>
          </Section>

          {/* ── 10: Vocabulary Reference ──────────────────────────── */}
          <Section id="vocab" label="10 — In-World Vocabulary" sub="Canonical label mappings. Every visible string in the UI defers to this list.">
            <Panel variant="surface" className="overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-4 py-2 bg-sr-panel border-b border-sr-border">
                {['Generic (never use)', 'Kodaxa In-World', 'Context / Page'].map((h) => (
                  <span key={h} className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{h}</span>
                ))}
              </div>
              <VocabRow generic="Login / Sign In"        inWorld="Establish Uplink"            context="Auth page CTA, nav" />
              <VocabRow generic="Register / Sign Up"     inWorld="Request Access"              context="Auth page secondary CTA" />
              <VocabRow generic="Logout"                 inWorld="Sever Uplink"                context="Terminal / profile menu" />
              <VocabRow generic="Dashboard"              inWorld="Operations Grid"             context="Logged-in home / terminal" />
              <VocabRow generic="Profile"                inWorld="Personnel File"              context="/terminal, directory cards" />
              <VocabRow generic="Settings"               inWorld="Terminal Config"             context="Account settings page" />
              <VocabRow generic="Search"                 inWorld="Query Archive"               context="Search inputs, labels" />
              <VocabRow generic="Submit"                 inWorld="Transmit"                    context="Form primary actions" />
              <VocabRow generic="Save"                   inWorld="Commit"                      context="Edit / amend forms" />
              <VocabRow generic="Cancel"                 inWorld="Abort"                       context="Modal dismiss, cancel edits" />
              <VocabRow generic="Delete"                 inWorld="Purge Record"                context="Destructive actions" />
              <VocabRow generic="Edit"                   inWorld="Amend Entry"                 context="Edit triggers everywhere" />
              <VocabRow generic="Create / New"           inWorld="Issue"                       context="Issue Contract, Issue Request" />
              <VocabRow generic="Messages"               inWorld="Relay Traffic"               context="In-game comms references" />
              <VocabRow generic="Notifications"          inWorld="System Advisories"           context="Alert/notice banners" />
              <VocabRow generic="Players"                inWorld="Operatives"                  context="Directory, corp copy" />
              <VocabRow generic="Members"                inWorld="Personnel"                   context="Corp page, team refs" />
              <VocabRow generic="Recipes"                inWorld="Schematics Archive"          context="Nav label, page headings" />
              <VocabRow generic="Items"                  inWorld="Material Registry"           context="Nav label, page headings" />
              <VocabRow generic="Skills"                 inWorld="Operative Capabilities"      context="Planner headings" />
              <VocabRow generic="Jobs / Listings"        inWorld="Open Contracts"              context="Artisan Exchange queue" />
              <VocabRow generic="Marketplace"            inWorld="Artisan Exchange"            context="Contract board page" />
              <VocabRow generic="Seller / Crafter"       inWorld="Registered Artisan"         context="Directory, contract parties" />
              <VocabRow generic="Buyer / Poster"         inWorld="Contract Issuer"             context="Exchange contract metadata" />
              <VocabRow generic="Planet / Server"        inWorld="Operational Sector"         context="Planet filters, headers" />
              <VocabRow generic="Loading…"               inWorld="Establishing Link…"         context="Loading states, spinners" />
              <VocabRow generic="Error"                  inWorld="System Fault"               context="Error messages, alerts" />
              <VocabRow generic="Success"                inWorld="Confirmed"                  context="Success toasts, completion" />
              <VocabRow generic="Warning"                inWorld="Advisory"                   context="Warning banners, amber states" />
              <VocabRow generic="Not found"              inWorld="Record Not Located"         context="404, empty states" />
              <VocabRow generic="Coming soon"            inWorld="Pending Deployment"         context="Locked tool cards, soon badges" />
              <VocabRow generic="Beta / Preview"         inWorld="Restricted Access"          context="Beta-gated tools" />
            </Panel>
          </Section>

        </main>
      </div>
    </div>
  );
}
