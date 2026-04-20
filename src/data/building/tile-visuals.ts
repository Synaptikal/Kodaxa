// no-op imports removed — visual profile is computed heuristically from tileId

export type GeometryType =
  | 'cube'
  | 'wedge'
  | 'slab_floor'
  | 'slab_wall'
  | 'glass_wall_large'
  | 'glass_corner'
  | 'rod'
  | 'sphere'
  | 'arc'
  | 'prop'
  | 'detailed_door'
  | 'detailed_computer'
  | 'detailed_cabinet'
  // Roofing
  | 'roof_slope'
  | 'roof_ridge'
  | 'roof_hip'
  | 'roof_gable'
  | 'roof_flat'
  // Access
  | 'stairs'
  | 'ramp'
  | 'landing'
  | 'pillar'
  | 'pillar_cap'
  | 'railing';

export type MaterialCategory = 'matte' | 'metal' | 'glass' | 'emissive';

export interface VisualProfile {
  geometry: GeometryType;
  material: MaterialCategory;
}

/** Determines geometry and material bucket for a given tile ID */
export function getTileVisualProfile(tileId: string): VisualProfile {
  // Default fallback
  const defaultProfile: VisualProfile = { geometry: 'cube', material: 'matte' };

  if (!tileId) return defaultProfile;

  // -- 1. Props & Fabricator Details
  if (tileId.includes('door'))             return { geometry: 'detailed_door',     material: 'matte' };
  if (tileId.includes('desktop_computer')) return { geometry: 'detailed_computer', material: 'matte' };
  if (tileId.includes('cabinet'))          return { geometry: 'detailed_cabinet',  material: 'matte' };
  if (tileId.includes('prop'))             return { geometry: 'prop',              material: 'matte' };

  // -- 2. Lights
  if (tileId.includes('light')) {
    let geom: GeometryType = 'cube';
    if (tileId.includes('floor')) geom = 'slab_floor';
    if (tileId.includes('wall'))  geom = 'slab_wall';
    return { geometry: geom, material: 'emissive' };
  }

  // -- 3. Glass (walls/railings)
  if (tileId.includes('railing_glass') || tileId === 'access_railing_glass') {
    return { geometry: 'railing', material: 'glass' };
  }
  if (tileId.includes('glass') || tileId.includes('window')) {
    let geom: GeometryType = 'slab_wall';
    if (tileId.includes('large'))  geom = 'glass_wall_large';
    if (tileId.includes('corner')) geom = 'glass_corner';
    return { geometry: geom, material: 'glass' };
  }

  // -- 4. Roofing
  if (tileId.startsWith('roof_')) {
    const isWood   = tileId.includes('wood');
    const isMetal  = tileId.includes('metal');
    const material: MaterialCategory = isMetal ? 'metal' : 'matte';
    if (tileId.includes('_slope'))   return { geometry: 'roof_slope', material };
    if (tileId.includes('_ridge'))   return { geometry: 'roof_ridge', material };
    if (tileId.includes('_hip'))     return { geometry: 'roof_hip',   material };
    if (tileId.includes('_gable'))   return { geometry: 'roof_gable', material };
    if (tileId.includes('_flat'))    return { geometry: 'roof_flat',  material };
    return { geometry: 'roof_slope', material };
  }

  // -- 5. Access: stairs
  if (tileId.includes('stair')) {
    const isMetal = tileId.includes('metal');
    return { geometry: 'stairs', material: isMetal ? 'metal' : 'matte' };
  }

  // -- 6. Access: ramps
  if (tileId.includes('ramp')) {
    const isMetal = tileId.includes('metal');
    return { geometry: 'ramp', material: isMetal ? 'metal' : 'matte' };
  }

  // -- 7. Access: landings
  if (tileId.includes('landing')) {
    return { geometry: 'landing', material: 'matte' };
  }

  // -- 8. Supports: pillars / columns
  if (tileId.includes('pillar_cap')) {
    return { geometry: 'pillar_cap', material: 'matte' };
  }
  if (tileId.includes('pillar') || tileId.includes('column')) {
    const isMetal = tileId.includes('metal');
    return { geometry: 'pillar', material: isMetal ? 'metal' : 'matte' };
  }

  // -- 9. Access: railings
  if (tileId.includes('railing')) {
    const isMetal = tileId.includes('metal');
    return { geometry: 'railing', material: isMetal ? 'metal' : 'matte' };
  }

  // -- 10. Primitives
  if (tileId === 'fab_arc')    return { geometry: 'arc',    material: 'matte' };
  if (tileId === 'fab_rod')    return { geometry: 'rod',    material: 'metal' };
  if (tileId === 'fab_sphere') return { geometry: 'sphere', material: 'matte' };

  // -- 11. Floors & Pavers
  if (tileId.includes('floor') || tileId.includes('rug') || tileId.startsWith('paver_')) {
    return { geometry: 'slab_floor', material: 'matte' };
  }

  // -- 12. Walls
  if (tileId.includes('wall')) {
    return { geometry: 'slab_wall', material: 'matte' };
  }

  // -- 13. Wedges
  if (tileId.includes('wedge')) {
    const isMetal = tileId.includes('metal');
    return { geometry: 'wedge', material: isMetal ? 'metal' : 'matte' };
  }

  // -- 14. Metal standard blocks
  if (tileId.includes('metal') || tileId.includes('alloy') || tileId.includes('composite')) {
    return { geometry: 'cube', material: 'metal' };
  }

  return defaultProfile;
}

