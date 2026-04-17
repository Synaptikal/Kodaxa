'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import type { BuildingState } from '@/types/building';

interface FloorPlaneProps {
  claimX: number;
  claimZ: number;
  activeLayer: number;
  onPointerOverCell: (x: number, y: number, z: number) => void;
  onPointerOut: () => void;
  onClickCell: (x: number, y: number, z: number, isRightClick: boolean) => void;
  onPointerUpCell?: (x: number, y: number, z: number, isRightClick: boolean) => void;
}

/**
 * A transparent plane that captures raycast events on the active floor layer.
 * Also renders a grid helper.
 */
export function FloorPlane({
  claimX,
  claimZ,
  activeLayer,
  onPointerOverCell,
  onPointerOut,
  onClickCell,
  onPointerUpCell
}: FloorPlaneProps) {
  
  const planeSizeX = claimX;
  const planeSizeZ = claimZ;
  
  // Center of the claim grid is at claimX/2, claimZ/2
  const cx = claimX / 2;
  const cz = claimZ / 2;

  // The PlaneGeometry is centered at 0,0 locally. We shift it by cx, cz.
  // The plane sits on the floor of the active layer (activeLayer * 1)
  
  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    // get intersection point in local plane space
    const pt = e.point;
    
    // Convert to grid cell coordinates
    let gx = Math.floor(pt.x);
    let gz = Math.floor(pt.z);
    
    // Clamp to boundaries
    if (gx < 0) gx = 0;
    if (gx >= claimX) gx = claimX - 1;
    if (gz < 0) gz = 0;
    if (gz >= claimZ) gz = claimZ - 1;
    
    onPointerOverCell(gx, activeLayer, gz);
  };
  
  const handlePointerOut = () => {
    onPointerOut();
  };
  
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const isRightClick = e.button === 2;
    
    // Exact same math, just register click
    const pt = e.point;
    let gx = Math.floor(pt.x);
    let gz = Math.floor(pt.z);
    
    if (gx < 0) gx = 0;
    if (gx >= claimX) gx = claimX - 1;
    if (gz < 0) gz = 0;
    if (gz >= claimZ) gz = claimZ - 1;
    
    onClickCell(gx, activeLayer, gz, isRightClick);
  };

  const handlePointerUp = (e: any) => {
    if (!onPointerUpCell) return;
    e.stopPropagation();
    const isRightClick = e.button === 2;
    
    // Exact same math
    const pt = e.point;
    let gx = Math.floor(pt.x);
    let gz = Math.floor(pt.z);
    
    if (gx < 0) gx = 0;
    if (gx >= claimX) gx = claimX - 1;
    if (gz < 0) gz = 0;
    if (gz >= claimZ) gz = claimZ - 1;
    
    onPointerUpCell(gx, activeLayer, gz, isRightClick);
  };

  return (
    <group position={[0, activeLayer, 0]}>
      {/* Invisible plane for catching mouse events */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[cx, 0, cz]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[planeSizeX, planeSizeZ]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {/* Visual grid helper */}
      <gridHelper 
        position={[cx, 0, cz]} 
        args={[Math.max(claimX, claimZ), Math.max(claimX, claimZ), 0x4b5563, 0x374151]} 
      />
    </group>
  );
}
