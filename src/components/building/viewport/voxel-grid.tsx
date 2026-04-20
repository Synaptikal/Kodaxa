'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { PlacedCell } from '@/types/building';
import { getTileMap } from '@/data/building';
import { getTileVisualProfile, GeometryType, MaterialCategory } from '@/data/building/tile-visuals';

interface VoxelGridProps {
  cells: PlacedCell[];
  activeLayer: number;
}

const DUMMY = new THREE.Object3D();
const DEFAULT_COLOR = new THREE.Color('#3f3f46');

// ---- Custom Wedge Geometry ----
function WedgeGeometry() {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    // A ramp from x=-0.5, y=-0.5 to x=-0.5, y=0.5 and x=0.5, y=-0.5
    s.moveTo(-0.5, -0.5);
    s.lineTo(0.5, -0.5);
    s.lineTo(0.5, 0.5);
    s.lineTo(-0.5, -0.5);
    
    const geometry = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
    // Center it on the Z axis so Y-axis rotation works smoothly
    geometry.translate(0, 0, -0.5);
    return geometry;
  }, []);

  return <primitive object={geo} attach="geometry" />;
}

// ---- Sub-Component for each group ----
function InstanceGroup({ 
  cells, 
  activeLayer, 
  geometry, 
  material 
}: { 
  cells: PlacedCell[]; 
  activeLayer: number; 
  geometry: GeometryType; 
  material: MaterialCategory 
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tileMap = useMemo(() => getTileMap(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    const count = cells.length;
    meshRef.current.count = count;
    
    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      const def = tileMap.get(cell.tileId);
      
      let cx = cell.x + 0.5;
      let cy = cell.y + 0.5;
      let cz = cell.z + 0.5;

      DUMMY.scale.set(1, 1, 1);
      
      const rotY = (cell.rotation || 0) * (Math.PI / 2);
      DUMMY.rotation.set(0, rotY, 0);

      // Adjust offsets based on geometry type
      if (geometry === 'slab_floor') {
        cy = cell.y + 0.05; // Placed at floor bottom
      } else if (geometry === 'prop') {
        cy = cell.y + 0.25;
        DUMMY.scale.set(0.6, 0.5, 0.6); // Mini-box
      } else if (geometry === 'glass_wall_large') {
        // Offset so it correctly occupies its space when placed
        if ((cell.rotation || 0) % 2 === 0) {
          cx += 0.5;
        } else {
          cz += 0.5;
        }
      } else if (geometry === 'rod') {
        DUMMY.scale.set(0.2, 1, 0.2);
      }

      DUMMY.position.set(cx, cy, cz);
      DUMMY.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY.matrix);
      
      // Setup colors
      const baseColorStr = def?.color ?? '#3f3f46';
      const color = new THREE.Color(baseColorStr);
      
      if (cell.y !== activeLayer) color.lerp(DEFAULT_COLOR, 0.6);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [cells, activeLayer, tileMap, geometry]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(100, cells.length)]} castShadow receiveShadow>
      {/* Dynamic Geometry */}
      {geometry === 'cube' && <boxGeometry args={[1, 1, 1]} />}
      {geometry === 'slab_floor' && <boxGeometry args={[1, 0.1, 1]} />}
      {geometry === 'slab_wall' && <boxGeometry args={[1, 1, 0.1]} />}
      {geometry === 'glass_wall_large' && <boxGeometry args={[2, 1, 0.1]} />}
      {geometry === 'glass_corner' && <boxGeometry args={[0.5, 1, 0.5]} />}
      {geometry === 'wedge' && <WedgeGeometry />}
      {geometry === 'rod' && <cylinderGeometry args={[1, 1, 1, 8]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.5, 16, 16]} />}
      {geometry === 'arc' && <torusGeometry args={[0.4, 0.1, 8, 16, Math.PI]} />}
      {geometry === 'prop' && <boxGeometry args={[1, 1, 1]} />}
      
      {/* Dynamic Material */}
      {material === 'matte' && <meshStandardMaterial roughness={0.9} metalness={0.1} />}
      {material === 'metal' && <meshStandardMaterial roughness={0.3} metalness={0.8} />}
      {material === 'glass' && (
        <meshPhysicalMaterial 
          transparent 
          opacity={0.4} 
          roughness={0.05} 
          transmission={0.9} 
          thickness={0.1}
          metalness={0.2}
        />
      )}
      {material === 'emissive' && <meshStandardMaterial emissive="#fde047" emissiveIntensity={2} toneMapped={false} />}
    </instancedMesh>
  );
}

// ---- Bespoke Non-Instanced Props ----

function BespokeProp({ cell, geometry, activeLayer }: { cell: PlacedCell; geometry: string; activeLayer: number }) {
  const tileMap = useMemo(() => getTileMap(), []);
  const def = tileMap.get(cell.tileId);
  const cx = cell.x + 0.5;
  const cz = cell.z + 0.5;

  const isActive = cell.y === activeLayer;
  const opacity = isActive ? 1 : 0.4;
  const color = def?.color ?? '#78350f';
  const rotEuler = (cell.rotation || 0) * (Math.PI / 2);

  return (
    <group position={[cx, cell.y, cz]} rotation={[0, rotEuler, 0]}>
      {geometry === 'detailed_door' && <DetailedDoor color={color} opacity={opacity} />}
      {geometry === 'detailed_computer' && <DetailedComputer opacity={opacity} isActive={isActive} />}
      {geometry === 'detailed_cabinet' && <DetailedCabinet color={color} opacity={opacity} />}
    </group>
  );
}

function DetailedDoor({ color, opacity }: { color: string, opacity: number }) {
  const matProps = { transparent: opacity < 1, opacity, depthWrite: true };
  return (
    <group position={[0, 0.5, 0]}>
       <mesh position={[-0.45, 0, 0]} castShadow>
         <boxGeometry args={[0.1, 1, 0.1]} />
         <meshStandardMaterial color={color} {...matProps} />
       </mesh>
       <mesh position={[0.45, 0, 0]} castShadow>
         <boxGeometry args={[0.1, 1, 0.1]} />
         <meshStandardMaterial color={color} {...matProps} />
       </mesh>
       <mesh position={[0, 0.45, 0]} castShadow>
         <boxGeometry args={[1, 0.1, 0.1]} />
         <meshStandardMaterial color={color} {...matProps} />
       </mesh>
       <mesh position={[0, -0.05, 0]} castShadow>
         <boxGeometry args={[0.8, 0.9, 0.05]} />
         <meshStandardMaterial color={color} roughness={0.8} {...matProps} />
       </mesh>
       <mesh position={[0.3, 0, 0.05]}>
         <sphereGeometry args={[0.04]} />
         <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.2} {...matProps} />
       </mesh>
    </group>
  );
}

function DetailedComputer({ opacity, isActive }: { opacity: number, isActive: boolean }) {
  const matProps = { transparent: opacity < 1, opacity, depthWrite: true };
  return (
    <group position={[0, 0.25, 0]} scale={0.7}>
       <mesh position={[0.3, -0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.5]} />
          <meshStandardMaterial color="#1e293b" {...matProps} />
       </mesh>
       <mesh position={[-0.1, -0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#334155" {...matProps} />
       </mesh>
       <mesh position={[-0.1, -0.1, 0]} rotation={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.6]} />
          <meshStandardMaterial color="#0f172a" {...matProps} />
       </mesh>
       <mesh position={[-0.07, -0.1, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.01, 0.35, 0.55]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={isActive ? 1 : 0.2} {...matProps} />
       </mesh>
    </group>
  );
}

function DetailedCabinet({ color, opacity }: { color: string, opacity: number }) {
  const matProps = { transparent: opacity < 1, opacity, depthWrite: true };
  return (
    <group position={[0, 0.25, 0]} scale={0.9}>
       <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.5]} />
          <meshStandardMaterial color={color} {...matProps} />
       </mesh>
       <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.95, 0.1, 0.55]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.5} {...matProps} />
       </mesh>
       <mesh position={[-0.2, -0.15, 0.26]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} {...matProps} />
       </mesh>
       <mesh position={[0.2, -0.15, 0.26]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} {...matProps} />
       </mesh>
    </group>
  );
}

export function VoxelGrid({ cells, activeLayer }: VoxelGridProps) {
  // Group cells by visual profile
  const { instancedGroups, detailedCells } = useMemo(() => {
    const buckets: Record<string, { geometry: GeometryType, material: MaterialCategory, cells: PlacedCell[] }> = {};
    const detailed: { cell: PlacedCell, geometry: string }[] = [];
    
    for (const cell of cells) {
      const profile = getTileVisualProfile(cell.tileId);
      if (profile.geometry.startsWith('detailed_')) {
        detailed.push({ cell, geometry: profile.geometry });
      } else {
        const key = `${profile.geometry}_${profile.material}`;
        if (!buckets[key]) {
          buckets[key] = { ...profile, cells: [] };
        }
        buckets[key].cells.push(cell);
      }
    }
    
    return { instancedGroups: Object.values(buckets), detailedCells: detailed };
  }, [cells]);

  return (
    <group>
      {instancedGroups.map((g, i) => (
        <InstanceGroup 
          key={`${g.geometry}_${g.material}_${i}`} 
          cells={g.cells} 
          activeLayer={activeLayer}
          geometry={g.geometry}
          material={g.material}
        />
      ))}
      {detailedCells.map(d => (
        <BespokeProp 
          key={d.cell.id} 
          cell={d.cell} 
          geometry={d.geometry} 
          activeLayer={activeLayer} 
        />
      ))}
    </group>
  );
}
