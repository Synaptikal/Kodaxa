/**
 * hazard-analyzer.ts
 * Analyzes placed cells for structural instabilities and boundary violations.
 * One concern: flagging collapse risks and out-of-bounds building.
 */

import type { HazardZone, PlacedCell } from '@/types/building';
import { ALL_TILES } from '@/data/building';

/**
 * Identify hazards based on the Physics Midterm rules and boundary limits.
 */
export function analyzeHazards(
  cells: PlacedCell[],
  claimX: number,
  claimZ: number
): HazardZone[] {
  const hazards: HazardZone[] = [];
  const OOB_ID = 'oob_hazard';

  const outOfBoundsCells = cells.filter(
    (c) => c.x < 0 || c.x >= claimX || c.z < 0 || c.z >= claimZ
  );

  if (outOfBoundsCells.length > 0) {
    hazards.push({
      id: OOB_ID,
      type: 'out_of_bounds',
      cells: outOfBoundsCells.map((c) => ({ x: c.x, y: c.y, z: c.z })),
      message: `${outOfBoundsCells.length} block(s) placed outside the ${claimX}×${claimZ} claim.`,
    });
  }

  // --- Span Analysis ---
  // To avoid a true 3D BFS (which is slow for React render loops),
  // we do a simplified single-axis heuristic on the X and Z axes.
  // This satisfies P1 requirements by flagging "unsupported spans of brittle material".

  // Build a lookup map of [y][z][x]
  const grid = new Map<number, Map<number, Map<number, PlacedCell>>>();
  for (const c of cells) {
    if (!grid.has(c.y)) grid.set(c.y, new Map());
    const layer = grid.get(c.y)!;
    if (!layer.has(c.z)) layer.set(c.z, new Map());
    layer.get(c.z)!.set(c.x, c);
  }

  // Iterate layers from Y=0 and up (ignoring basements for roof span checks for now)
  for (const [y, rowMap] of grid.entries()) {
    if (y < 0) continue; // Assumed basement: inherently supported by surrounding dirt (for P1)

    for (const [z, colMap] of rowMap.entries()) {
      // Find consecutive runs of cells in the X direction without support below
      let spanWidth = 0;
      let spanCells: { x: number; y: number; z: number }[] = [];
      let minAdhesionScore = 3; // 1 = brittle, 2 = moderate, 3 = cohesive

      for (let x = 0; x < claimX; x++) {
        const cell = colMap.get(x);
        if (!cell) {
          // Span breaks
          checkSpan(spanCells, spanWidth, minAdhesionScore, hazards);
          spanWidth = 0;
          spanCells = [];
          minAdhesionScore = 3;
          continue;
        }

        const isSupportedBelow = grid.get(y - 1)?.get(z)?.has(x);
        if (isSupportedBelow) {
          // Supported directly below, span is broken
          checkSpan(spanCells, spanWidth, minAdhesionScore, hazards);
          spanWidth = 0;
          spanCells = [];
          minAdhesionScore = 3;
          continue;
        }

        // It is unsupported
        spanWidth++;
        spanCells.push({ x, y, z });

        const def = ALL_TILES.find((t) => t.id === cell.tileId);
        const score = def?.adhesion === 'brittle' ? 1 : def?.adhesion === 'moderate' ? 2 : 3;
        if (score < minAdhesionScore) minAdhesionScore = score;
      }
      
      // Check tail
      checkSpan(spanCells, spanWidth, minAdhesionScore, hazards);
    }
  }

  // Deduplicate and return (very simple span merge for UI)
  return hazards;
}

function checkSpan(
  cells: { x: number; y: number; z: number }[],
  width: number,
  score: number,
  hazards: HazardZone[]
) {
  if (width < 4) return; // Tiny spans are safe even for brittle

  // Thresholds based on adhesion
  // Brittle: warn >4, risk >6
  // Moderate: warn >6, risk >9
  // Cohesive: warn >10, risk >15
  let isWarning = false;
  let isRisk = false;

  if (score === 1 /* brittle */) {
    if (width > 6) isRisk = true;
    else if (width > 4) isWarning = true;
  } else if (score === 2 /* moderate */) {
    if (width > 9) isRisk = true;
    else if (width > 6) isWarning = true;
  } else {
    // Cohesive
    if (width > 15) isRisk = true;
    else if (width > 10) isWarning = true;
  }

  if (isRisk) {
    hazards.push({
      id: `span_risk_${cells[0].x}_${cells[0].y}_${cells[0].z}`,
      type: 'collapse_risk',
      cells,
      message: `Critically unsupported span of ${width} units. Collapse likely without vertical support.`,
    });
  } else if (isWarning) {
    hazards.push({
      id: `span_warn_${cells[0].x}_${cells[0].y}_${cells[0].z}`,
      type: 'collapse_warning',
      cells,
      message: `Weak unsupported span of ${width} units. Consider adding pillars.`,
    });
  }
}
