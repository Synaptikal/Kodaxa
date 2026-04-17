'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { BuildingCanvas } from './viewport/building-canvas';
import { BuildingToolbar } from './toolbar/building-toolbar';
import { LayerPanel } from './panels/layer-panel';
import { PalettePanel } from './panels/palette-panel';
import { BomPanel } from './panels/bom-panel';
import { HazardPanel } from './panels/hazard-panel';
import { SkillsPanel } from './panels/skills-panel';
import { useBuildingState } from '@/hooks/use-building-state';
import { decodeBuildingState, generateBuildingShareUrl } from '@/lib/building/building-encoder';
import { ALL_TILES } from '@/data/building';
import { BuildingOnboarding } from './onboarding/building-onboarding';

export function BuildingShell() {
  const searchParams = useSearchParams();
  const hook = useBuildingState();
  const isLoadedRef = useRef(false);

  // On mount, load state from URL if present
  useEffect(() => {
    if (!isLoadedRef.current && searchParams && searchParams.size > 0) {
      const decoded = decodeBuildingState(searchParams);
      hook.loadState(decoded);
      isLoadedRef.current = true;
    }
  }, [searchParams]);

  // Sync state back to URL when layout changes
  useEffect(() => {
    if (!isLoadedRef.current && searchParams.size > 0) return;
    const newUrl = generateBuildingShareUrl(hook.state, window.location.origin);
    if (window.location.href !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [hook.state.cells, hook.state.name, hook.state.activeLayer, hook.state.claimX, hook.state.claimZ]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) return;

      const k = e.key.toLowerCase();
      if (k === 'r')                    hook.rotateTile();
      else if (k === 'q')               hook.setMode('place');
      else if (k === 'e')               hook.setMode('erase');
      else if (k === 'f')               hook.setMode('fill');
      else if (k === 's')               hook.setMode('select');
      else if (k === 'i')               hook.setMode('eyedropper');
      else if (k === 'v')               hook.setMode('pan');
      else if (k === 'm')               hook.setMode('measure');
      else if (k === 'z' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); hook.undo(); }
      else if (k === 'y' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); hook.redo(); }
      else if (k === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) { e.preventDefault(); hook.redo(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hook]);

  // Compute tile cap count (only tiles where countedInCap = true)
  const tileMap = ALL_TILES.reduce((m, t) => { m.set(t.id, t); return m; }, new Map<string, typeof ALL_TILES[0]>());
  const tileCount = hook.state.cells.filter((c) => tileMap.get(c.tileId)?.countedInCap !== false).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-sr-bg text-slate-200">
      <NavHeader />

      <div className="flex-1 flex overflow-hidden relative">

        {/* First-visit orientation tour + persistent ? button */}
        <BuildingOnboarding />

        {/* Left Panel: Layers + Claim Config */}
        <div className="w-60 border-r border-sr-border bg-sr-surface flex flex-col z-10">
          {/* Claim size configurator */}
          <div className="px-3 py-2 border-b border-sr-border">
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-2">
              Claim Size
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[7px] font-mono text-slate-600 uppercase tracking-widest block mb-0.5">W</label>
                <input
                  type="number"
                  min={4}
                  max={32}
                  value={hook.state.claimX}
                  onChange={(e) => hook.setClaimSize(parseInt(e.target.value, 10) || 10, hook.state.claimZ)}
                  className="w-full bg-sr-bg border border-sr-border px-2 py-1 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none"
                />
              </div>
              <span className="text-slate-600 font-mono text-xs mt-4">×</span>
              <div className="flex-1">
                <label className="text-[7px] font-mono text-slate-600 uppercase tracking-widest block mb-0.5">D</label>
                <input
                  type="number"
                  min={4}
                  max={32}
                  value={hook.state.claimZ}
                  onChange={(e) => hook.setClaimSize(hook.state.claimX, parseInt(e.target.value, 10) || 10)}
                  className="w-full bg-sr-bg border border-sr-border px-2 py-1 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none"
                />
              </div>
              <span className="text-[8px] font-mono text-slate-700 mt-4">units</span>
            </div>
          </div>

          <LayerPanel
            layers={hook.state.layers}
            activeLayer={hook.state.activeLayer}
            hiddenLayers={hook.state.hiddenLayers ?? []}
            cells={hook.state.cells}
            onSetActiveLayer={hook.setActiveLayer}
            onRenameLayer={hook.renameLayer}
            onToggleLayerVisibility={hook.toggleLayerVisibility}
          />
        </div>

        {/* Center: 3D Viewport */}
        <div className="flex-1 relative bg-sr-bg">
          <BuildingCanvas
            state={hook.state}
            onPlaceCell={hook.placeCell}
            onPlaceCellBatch={hook.placeCellBatch}
            onEraseCell={hook.eraseCell}
            onEraseCellBatch={hook.eraseCellBatch}
            onEyedropCell={hook.eyedropCell}
            onPickUpCell={hook.pickUpCell}
          />

          <BuildingToolbar
            mode={hook.state.mode}
            onSetMode={hook.setMode}
            canUndo={hook.canUndo}
            canRedo={hook.canRedo}
            onUndo={hook.undo}
            onRedo={hook.redo}
            onRotate={hook.rotateTile}
            tileCount={tileCount}
          />
        </div>

        {/* Right Panel: Palette + Analysis */}
        <div className="w-80 border-l border-sr-border bg-sr-bg flex flex-col z-10 overflow-y-auto">
          <PalettePanel
            selectedTileId={hook.state.selectedTileId}
            onSelectTile={hook.selectTile}
          />
          <HazardPanel
            cells={hook.state.cells}
            claimX={hook.state.claimX}
            claimZ={hook.state.claimZ}
          />
          <BomPanel
            cells={hook.state.cells}
          />
          <SkillsPanel
            cells={hook.state.cells}
          />
        </div>

      </div>
    </div>
  );
}
