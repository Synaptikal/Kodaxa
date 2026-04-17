/**
 * build-encoder.ts
 * Encode/decode builds to/from URL-safe strings for sharing.
 * One concern: serializing build state into compact URL params.
 *
 * Format: ?s=id1,id2&a=id3&t=prof:s1:s2|prof2:s3&st=50:30:20&n=My+Build
 * This lets anyone share a build by copying the URL — no account needed.
 */

import type { Build, BuildSnapshot, ToolSlot, StatAllocation } from '@/types/build';

const SEPARATOR = ',';
const TOOL_SEPARATOR = '|';
const FIELD_SEPARATOR = ':';

/** Encode a Build into URL search params */
export function encodeBuild(build: Build): string {
  const snapshot: BuildSnapshot = {
    s: build.activeSkills.join(SEPARATOR),
    a: build.atrophiedSkills.join(SEPARATOR),
    t: encodeToolSlots(build.toolSlots),
    st: encodeStats(build.stats),
    n: build.name,
  };

  const params = new URLSearchParams();
  if (snapshot.s) params.set('s', snapshot.s);
  if (snapshot.a) params.set('a', snapshot.a);
  if (snapshot.t) params.set('t', snapshot.t);
  if (snapshot.st) params.set('st', snapshot.st);
  if (snapshot.n) params.set('n', snapshot.n);

  return params.toString();
}

/** Decode URL search params back into a partial Build */
export function decodeBuild(searchParams: URLSearchParams): Build {
  const activeSkills = decodeList(searchParams.get('s'));
  const atrophiedSkills = decodeList(searchParams.get('a'));
  const toolSlots = decodeToolSlots(searchParams.get('t'));
  const stats = decodeStats(searchParams.get('st'));
  const name = searchParams.get('n') ?? 'Imported Build';

  return {
    name,
    activeSkills,
    atrophiedSkills,
    toolSlots,
    stats,
    updatedAt: new Date().toISOString(),
  };
}

/** Generate a shareable URL path for a build */
export function buildShareUrl(build: Build, origin: string): string {
  const encoded = encodeBuild(build);
  return `${origin}/planner?${encoded}`;
}

// --- Internal helpers ---

function decodeList(value: string | null): string[] {
  if (!value) return [];
  return value.split(SEPARATOR).filter(Boolean);
}

function encodeToolSlots(slots: ToolSlot[]): string {
  return slots
    .filter((s) => s.toolName)
    .map((s) => {
      const specials = s.activeSpecials.filter(Boolean).join(FIELD_SEPARATOR);
      return specials
        ? `${s.professionId}${FIELD_SEPARATOR}${specials}`
        : s.professionId;
    })
    .join(TOOL_SEPARATOR);
}

function decodeToolSlots(value: string | null): ToolSlot[] {
  if (!value) return emptyToolSlots();

  const slots = value.split(TOOL_SEPARATOR).map((chunk) => {
    const parts = chunk.split(FIELD_SEPARATOR);
    return {
      toolName: parts[0] ?? '',
      professionId: parts[0] ?? '',
      activeSpecials: [parts[1], parts[2]] as [string?, string?],
    };
  });

  // Pad to 5 slots
  while (slots.length < 5) {
    slots.push({ toolName: '', professionId: '', activeSpecials: [undefined, undefined] });
  }

  return slots.slice(0, 5);
}

function encodeStats(stats: StatAllocation): string {
  return `${stats.health}${FIELD_SEPARATOR}${stats.stamina}${FIELD_SEPARATOR}${stats.focus}`;
}

function decodeStats(value: string | null): StatAllocation {
  if (!value) return { health: 34, stamina: 33, focus: 33 };
  const [h, s, f] = value.split(FIELD_SEPARATOR).map(Number);
  return {
    health: h || 34,
    stamina: s || 33,
    focus: f || 33,
  };
}

/** Create 5 empty tool slots */
export function emptyToolSlots(): ToolSlot[] {
  return Array.from({ length: 5 }, () => ({
    toolName: '',
    professionId: '',
    activeSpecials: [undefined, undefined] as [string?, string?],
  }));
}

/** Create a default empty build */
export function emptyBuild(): Build {
  return {
    name: 'New Build',
    activeSkills: [],
    atrophiedSkills: [],
    toolSlots: emptyToolSlots(),
    stats: { health: 34, stamina: 33, focus: 33 },
    updatedAt: new Date().toISOString(),
  };
}
