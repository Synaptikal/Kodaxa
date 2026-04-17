'use client';

import { useMemo } from 'react';
import type { BuildingMode } from '@/types/building';
import { getTileMap } from '@/data/building';

interface PlacementCursorProps {
  hoverPos: { x: number; y: number; z: number } | null;
  selectedTileId: string | null;
  mode: BuildingMode;
  currentRotation?: number;
  dragStart?: { x: number; z: number } | null;
  measureAnchor?: { x: number; z: number } | null;
}

/** Thin stretched-box line between two world-space points on the XZ plane */
function MeasureLine({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length < 0.05) return null;

  const cx = (from[0] + to[0]) / 2;
  const cy = (from[1] + to[1]) / 2;
  const cz = (from[2] + to[2]) / 2;
  const angle = Math.atan2(dx, dz); // rotation around Y axis

  return (
    <mesh position={[cx, cy, cz]} rotation={[0, angle, 0]}>
      <boxGeometry args={[0.07, 0.07, length]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.85} />
    </mesh>
  );
}

export function PlacementCursor({
  hoverPos,
  selectedTileId,
  mode,
  currentRotation = 0,
  dragStart,
  measureAnchor,
}: PlacementCursorProps) {
  const tileMap = useMemo(() => getTileMap(), []);

  if (!hoverPos) return null;
  if (mode === 'pan') return null;

  // ── Measure mode ────────────────────────────────────────────────
  if (mode === 'measure') {
    const hy = hoverPos.y + 0.5;
    const hx = hoverPos.x + 0.5;
    const hz = hoverPos.z + 0.5;

    return (
      <>
        {/* Hover dot — amber */}
        <mesh position={[hx, hy, hz]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {measureAnchor && (
          <>
            {/* Anchor dot — green */}
            <mesh position={[measureAnchor.x + 0.5, hy, measureAnchor.z + 0.5]}>
              <sphereGeometry args={[0.25, 10, 10]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            {/* Line between anchor and hover */}
            <MeasureLine
              from={[measureAnchor.x + 0.5, hy, measureAnchor.z + 0.5]}
              to={[hx, hy, hz]}
            />
            {/* Corner markers at anchor X, hover Z and hover X, anchor Z */}
            <mesh position={[measureAnchor.x + 0.5, hy, hz]} >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
            </mesh>
            <mesh position={[hx, hy, measureAnchor.z + 0.5]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
            </mesh>
            {/* Dashed bounding rectangle (thin wireframe box) */}
            {(() => {
              const minX = Math.min(hoverPos.x, measureAnchor.x);
              const maxX = Math.max(hoverPos.x, measureAnchor.x);
              const minZ = Math.min(hoverPos.z, measureAnchor.z);
              const maxZ = Math.max(hoverPos.z, measureAnchor.z);
              const sx = maxX - minX + 1;
              const sz = maxZ - minZ + 1;
              const cx = minX + sx / 2;
              const cz = minZ + sz / 2;
              return (
                <mesh position={[cx, hy, cz]}>
                  <boxGeometry args={[sx, 0.04, sz]} />
                  <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} wireframe />
                </mesh>
              );
            })()}
          </>
        )}
      </>
    );
  }

  // ── Select / Eyedropper — blue wireframe highlight ───────────────
  if (mode === 'select' || mode === 'eyedropper') {
    const color = mode === 'eyedropper' ? '#a78bfa' : '#3b82f6';
    return (
      <mesh position={[hoverPos.x + 0.5, hoverPos.y + 0.5, hoverPos.z + 0.5]}>
        <boxGeometry args={[1.06, 1.06, 1.06]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} wireframe />
      </mesh>
    );
  }

  // ── Fill / Erase drag region ─────────────────────────────────────
  let color = '#ef4444';
  let opacity = 0.5;

  if ((mode === 'place' || mode === 'fill') && selectedTileId) {
    const def = tileMap.get(selectedTileId);
    if (def) {
      color = def.color;
      opacity = 0.7;
    }
  }

  if (dragStart && (mode === 'fill' || mode === 'erase')) {
    const minX = Math.min(dragStart.x, hoverPos.x);
    const maxX = Math.max(dragStart.x, hoverPos.x);
    const minZ = Math.min(dragStart.z, hoverPos.z);
    const maxZ = Math.max(dragStart.z, hoverPos.z);

    const sizeX = maxX - minX + 1;
    const sizeZ = maxZ - minZ + 1;
    const centerX = minX + sizeX / 2;
    const centerZ = minZ + sizeZ / 2;

    return (
      <mesh position={[centerX, hoverPos.y + 0.5, centerZ]}>
        <boxGeometry args={[sizeX + 0.05, 1.05, sizeZ + 0.05]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={mode === 'erase' ? 0.25 : 0.35}
          wireframe={mode === 'erase'}
        />
      </mesh>
    );
  }

  // ── Single-cell cursor (place / erase) ───────────────────────────
  const rotEuler = currentRotation * (Math.PI / 2);

  return (
    <group
      position={[hoverPos.x + 0.5, hoverPos.y + 0.5, hoverPos.z + 0.5]}
      rotation={[0, rotEuler, 0]}
    >
      <mesh>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          wireframe={mode === 'erase'}
        />
      </mesh>
      {/* Front orientation pip */}
      {mode === 'place' && (
        <mesh position={[0, 0.55, 0.4]}>
          <boxGeometry args={[0.2, 0.05, 0.2]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}
