/**
 * palette-panel.tsx
 * Tile/block selection palette with subcategory groups, shape codes, search, and skill filters.
 * One concern: letting the player quickly find and select any building piece.
 */

'use client';

import { useState, useMemo } from 'react';
import { LockIcon, SearchIcon, XIcon } from 'lucide-react';
import type { TileCategory, TileSubcategory, TileDef } from '@/types/building';
import { ALL_TILES } from '@/data/building';

interface PalettePanelProps {
  selectedTileId: string | null;
  onSelectTile: (tileId: string | null) => void;
}

type FilterMode = 'all' | 'no_skill' | 'architect' | 'civil_engineering' | 'forestry';

const TABS: { id: TileCategory; label: string }[] = [
  { id: 'instaformer', label: 'Instaformer' },
  { id: 'fabricator',  label: 'Fabricator' },
  { id: 'paver',       label: 'Paver' },
];

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: 'all',              label: 'All' },
  { id: 'no_skill',         label: 'No Skill' },
  { id: 'architect',        label: 'Architect' },
  { id: 'civil_engineering',label: 'Civil Eng.' },
];

/** Display order for subcategory groups within each tab */
const SUBCATEGORY_ORDER: TileSubcategory[] = [
  'blocks', 'slopes',
  'structural', 'walls', 'roofing', 'access', 'supports', 'lighting', 'decor',
  'paths', 'roads',
];

const SUBCATEGORY_LABELS: Record<TileSubcategory, string> = {
  blocks:     'Blocks',
  slopes:     'Slopes / Wedges',
  structural: 'Structural',
  roofing:    'Roofing',
  walls:      'Walls & Windows',
  access:     'Access & Railings',
  supports:   'Pillars & Supports',
  lighting:   'Lighting',
  decor:      'Décor & Props',
  paths:      'Paths',
  roads:      'Roads',
};

/** 3-letter shape code badge */
const SHAPE_CODE: Record<TileSubcategory, string> = {
  blocks:     'BLK',
  slopes:     'SLP',
  structural: 'STR',
  roofing:    'ROF',
  walls:      'WLL',
  access:     'ACS',
  supports:   'SUP',
  lighting:   'LGT',
  decor:      'DCR',
  paths:      'PTH',
  roads:      'RD ',
};

function applyFilter(tiles: TileDef[], filter: FilterMode): TileDef[] {
  switch (filter) {
    case 'no_skill':         return tiles.filter((t) => !t.requiredSkillId);
    case 'architect':        return tiles.filter((t) => t.requiredTree === 'architect');
    case 'civil_engineering':return tiles.filter((t) => t.requiredTree === 'civil_engineering');
    case 'forestry':         return tiles.filter((t) => t.requiredTree === 'forestry');
    default:                 return tiles;
  }
}

function applySearch(tiles: TileDef[], query: string): TileDef[] {
  if (!query.trim()) return tiles;
  const q = query.toLowerCase();
  return tiles.filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    t.description?.toLowerCase().includes(q)
  );
}

export function PalettePanel({ selectedTileId, onSelectTile }: PalettePanelProps) {
  const [activeTab, setActiveTab]   = useState<TileCategory>('instaformer');
  const [filter, setFilter]         = useState<FilterMode>('all');
  const [search, setSearch]         = useState('');

  const groupedTiles = useMemo(() => {
    const byCategory = ALL_TILES.filter((t) => t.category === activeTab);
    const filtered   = applyFilter(byCategory, filter);
    const searched   = applySearch(filtered, search);

    // Group by subcategory in display order
    const groups = new Map<TileSubcategory, TileDef[]>();
    for (const sub of SUBCATEGORY_ORDER) {
      const tiles = searched.filter((t) => t.subcategory === sub);
      if (tiles.length > 0) groups.set(sub, tiles);
    }
    return groups;
  }, [activeTab, filter, search]);

  const totalVisible = useMemo(() => {
    let count = 0;
    groupedTiles.forEach((tiles) => { count += tiles.length; });
    return count;
  }, [groupedTiles]);

  return (
    <div className="flex flex-col shrink-0 basis-[48%] border-b border-sr-border bg-sr-bg">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2 border-b border-sr-border">
        <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-1">
          Building Palette
        </p>

        {/* Category tabs */}
        <div className="flex gap-1 mb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFilter('all'); setSearch(''); }}
              className={`flex-1 py-1 text-[9px] font-mono font-bold uppercase tracking-widest transition-colors border ${
                activeTab === tab.id
                  ? 'bg-cyan-600/20 border-cyan-700/60 text-cyan-300'
                  : 'bg-sr-surface border-sr-border text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pieces…"
            className="w-full bg-sr-surface border border-sr-border pl-6 pr-6 py-1.5 text-[10px] font-mono text-slate-300 placeholder:text-slate-700 focus:border-cyan-700 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Skill filters */}
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest border transition-colors ${
                filter === f.id
                  ? 'bg-cyan-600/20 border-cyan-700/60 text-cyan-300'
                  : 'bg-sr-surface border-sr-border text-slate-600 hover:text-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
          {totalVisible > 0 && (
            <span className="ml-auto text-[8px] font-mono text-slate-700 self-center">
              {totalVisible} piece{totalVisible !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── Tile groups ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {groupedTiles.size === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[10px] font-mono text-slate-700">No pieces match.</p>
          </div>
        ) : (
          Array.from(groupedTiles.entries()).map(([sub, tiles]) => (
            <div key={sub}>
              {/* Group header */}
              <div className="px-3 py-1.5 bg-sr-surface border-b border-sr-border flex items-center gap-2">
                <span className="text-[8px] font-mono font-bold text-slate-500 bg-sr-bg border border-sr-border px-1.5 py-0.5 tracking-widest">
                  {SHAPE_CODE[sub]}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">
                  {SUBCATEGORY_LABELS[sub]}
                </span>
                <span className="ml-auto text-[8px] font-mono text-slate-700">{tiles.length}</span>
              </div>

              {/* Tile rows */}
              {tiles.map((tile) => {
                const isSelected   = selectedTileId === tile.id;
                const requiresSkill = !!tile.requiredSkillId;

                return (
                  <button
                    key={tile.id}
                    onClick={() => onSelectTile(isSelected ? null : tile.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 border-b border-sr-border/50 transition-colors text-left group ${
                      isSelected
                        ? 'bg-cyan-950/30 border-l-2 border-l-cyan-500'
                        : 'bg-transparent hover:bg-sr-surface border-l-2 border-l-transparent'
                    }`}
                    style={
                      isSelected
                        ? undefined
                        : { '--tw-border-opacity': '1' } as React.CSSProperties
                    }
                  >
                    {/* Color swatch */}
                    <div
                      className="w-4 h-4 shrink-0 border border-black/20"
                      style={{ backgroundColor: tile.color }}
                    />

                    {/* Name + badges */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-mono leading-tight truncate ${
                        isSelected ? 'text-cyan-300' : 'text-slate-300 group-hover:text-slate-100'
                      }`}>
                        {tile.name}
                      </p>
                      {tile.description && (
                        <p className="text-[8px] font-mono text-slate-700 truncate leading-tight mt-0.5">
                          {tile.description}
                        </p>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!tile.costsConfirmed && (
                        <span className="text-[7px] font-mono text-amber-600 border border-amber-800/50 px-1 py-0.5 uppercase tracking-widest">
                          ~est
                        </span>
                      )}
                      {requiresSkill && (
                        <span title={`Requires: ${tile.requiredSkillId}`}>
                          <LockIcon className="w-2.5 h-2.5 text-amber-600" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
