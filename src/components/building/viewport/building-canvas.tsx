'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { VoxelGrid } from './voxel-grid';
import { FloorPlane } from './floor-plane';
import { PlacementCursor } from './placement-cursor';
import type { BuildingState } from '@/types/building';
import { getTileMap } from '@/data/building';

interface BuildingCanvasProps {
  state: BuildingState;
  onPlaceCell: (x: number, y: number, z: number) => void;
  onPlaceCellBatch: (coords: {x:number, y:number, z:number}[]) => void;
  onEraseCell: (x: number, y: number, z: number) => void;
  onEraseCellBatch: (y: number, minX: number, maxX: number, minZ: number, maxZ: number) => void;
  onEyedropCell: (x: number, y: number, z: number) => void;
  onPickUpCell: (x: number, y: number, z: number) => void;
}

const SHADOW_CONFIG = { type: THREE.PCFShadowMap };

export function BuildingCanvas({
  state,
  onPlaceCell,
  onPlaceCellBatch,
  onEraseCell,
  onEraseCellBatch,
  onEyedropCell,
  onPickUpCell,
}: BuildingCanvasProps) {
  const [hoverPos, setHoverPos]         = useState<{ x: number; y: number; z: number } | null>(null);
  const [dragStart, setDragStart]       = useState<{ x: number; z: number } | null>(null);
  const [measureAnchor, setMeasureAnchor] = useState<{ x: number; z: number } | null>(null);

  const tileMap = useMemo(() => getTileMap(), []);

  // ── Event handlers ────────────────────────────────────────────────

  const handlePointerOverCell = (x: number, y: number, z: number) => {
    setHoverPos({ x, y, z });
  };

  const handlePointerOut = () => {
    setHoverPos(null);
  };

  const handleClickCell = (x: number, y: number, z: number, isRightClick: boolean) => {
    if (state.mode === 'pan') return;

    // Measure: first click sets anchor, second click clears it
    if (state.mode === 'measure') {
      if (!isRightClick) {
        setMeasureAnchor((prev) => (prev ? null : { x, z }));
      }
      return;
    }

    if (state.mode === 'eyedropper' && !isRightClick) {
      onEyedropCell(x, y, z);
      return;
    }

    if (state.mode === 'select' && !isRightClick) {
      onPickUpCell(x, y, z);
      return;
    }

    if (state.mode === 'fill') {
      if (isRightClick) {
        onEraseCell(x, y, z);
      } else {
        setDragStart({ x, z });
      }
      return;
    }

    if (state.mode === 'erase' && !isRightClick) {
      setDragStart({ x, z });
      return;
    }

    // Standard place / right-click erase
    if (isRightClick) {
      onEraseCell(x, y, z);
    } else if (state.mode === 'place' && state.selectedTileId) {
      onPlaceCell(x, y, z);
    }
  };

  const handlePointerUpCell = (x: number, y: number, z: number, isRightClick: boolean) => {
    if (!dragStart) return;
    if (isRightClick) { setDragStart(null); return; }

    const minX = Math.min(dragStart.x, x);
    const maxX = Math.max(dragStart.x, x);
    const minZ = Math.min(dragStart.z, z);
    const maxZ = Math.max(dragStart.z, z);

    if (state.mode === 'fill' && state.selectedTileId) {
      const coords: {x:number;y:number;z:number}[] = [];
      for (let i = minX; i <= maxX; i++) {
        for (let j = minZ; j <= maxZ; j++) {
          coords.push({ x: i, y, z: j });
        }
      }
      onPlaceCellBatch(coords);
    } else if (state.mode === 'erase') {
      onEraseCellBatch(y, minX, maxX, minZ, maxZ);
    }

    setDragStart(null);
  };

  // ── Derived state for overlays ────────────────────────────────────

  /** Live measurement values shown while hovering in measure mode */
  const measureInfo = useMemo(() => {
    if (!measureAnchor || !hoverPos) return null;
    const dx = hoverPos.x - measureAnchor.x;
    const dz = hoverPos.z - measureAnchor.z;
    const absDx = Math.abs(dx);
    const absDz = Math.abs(dz);
    return {
      w:    absDx,
      d:    absDz,
      diag: Math.round(Math.sqrt(dx * dx + dz * dz) * 10) / 10,
      area: (absDx + 1) * (absDz + 1),
    };
  }, [measureAnchor, hoverPos]);

  /** Tile at the currently hovered cell (for select/eyedropper tooltips) */
  const hoveredCellInfo = useMemo(() => {
    if (state.mode !== 'select' && state.mode !== 'eyedropper') return null;
    if (!hoverPos) return null;
    const cell = state.cells.find(
      (c) => c.x === hoverPos.x && c.y === hoverPos.y && c.z === hoverPos.z
    );
    if (!cell) return null;
    return { cell, tile: tileMap.get(cell.tileId) };
  }, [state.mode, state.cells, hoverPos, tileMap]);

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="w-full h-full absolute inset-0 cursor-crosshair bg-sr-bg">

      {/* ── Measure HUD ────────────────────────────────────────────── */}
      {state.mode === 'measure' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center">
          {!measureAnchor ? (
            <div className="bg-sr-bg border border-sr-border px-3 py-1.5">
              <p className="text-[9px] font-mono text-slate-500">
                Click on the grid to set measure anchor · Right-click to cancel
              </p>
            </div>
          ) : measureInfo ? (
            <div className="bg-sr-bg border border-amber-700/60 px-4 py-2 min-w-[220px]">
              <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-2 text-center">
                Measure · Click anchor to clear
              </p>
              <div className="flex gap-5 justify-center">
                <div className="text-center">
                  <p className="text-amber-400 text-sm font-mono font-bold tabular-nums leading-none">
                    {measureInfo.w}
                  </p>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Width</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 text-sm font-mono font-bold tabular-nums leading-none">
                    {measureInfo.d}
                  </p>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Depth</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-300 text-sm font-mono font-bold tabular-nums leading-none">
                    {measureInfo.diag}
                  </p>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Diag</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm font-mono font-bold tabular-nums leading-none">
                    {measureInfo.area}
                  </p>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Area</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sr-bg border border-amber-700/60 px-3 py-1.5">
              <p className="text-[9px] font-mono text-amber-400">
                Anchor set — hover to measure · Click anchor to clear
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Select / Eyedropper hover label ────────────────────────── */}
      {hoveredCellInfo && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-sr-bg border border-sr-border px-3 py-1.5 text-center">
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600">
              {state.mode === 'select' ? 'Pick up tile' : 'Sample tile'}
            </p>
            <p className="text-[11px] font-mono text-slate-200 mt-0.5">
              {hoveredCellInfo.tile?.name ?? hoveredCellInfo.cell.tileId}
            </p>
          </div>
        </div>
      )}

      {/* ── No tile selected warning (place mode) ──────────────────── */}
      {state.mode === 'place' && !state.selectedTileId && hoverPos && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-sr-bg border border-sr-border px-3 py-1.5">
            <p className="text-[9px] font-mono text-slate-600">
              Select a tile from the palette →
            </p>
          </div>
        </div>
      )}

      {/* ── Three.js Canvas ────────────────────────────────────────── */}
      <Canvas
        shadows={SHADOW_CONFIG as any}
        camera={{ position: [15, 12, 15], fov: 40 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="city" />

        <OrbitControls
          target={[state.claimX / 2, 0, state.claimZ / 2]}
          makeDefault
          enableDamping={false}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />

        <group>
          <VoxelGrid cells={state.cells} activeLayer={state.activeLayer} />

          <FloorPlane
            claimX={state.claimX}
            claimZ={state.claimZ}
            activeLayer={state.activeLayer}
            onPointerOverCell={handlePointerOverCell}
            onPointerOut={handlePointerOut}
            onClickCell={handleClickCell}
            onPointerUpCell={handlePointerUpCell}
          />

          <PlacementCursor
            hoverPos={hoverPos}
            dragStart={dragStart}
            measureAnchor={measureAnchor}
            selectedTileId={state.selectedTileId}
            mode={state.mode}
            currentRotation={state.currentRotation}
          />
        </group>

        <ContactShadows
          position={[state.claimX / 2, -3.1, state.claimZ / 2]}
          opacity={0.4}
          scale={30}
          blur={2}
          far={10}
        />
      </Canvas>
    </div>
  );
}
