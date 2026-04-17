/**
 * skill-tree.ts
 * Core data types for the Stars Reach skill tree system.
 * One concern: defining the shape of profession/skill/node data.
 *
 * These types model the game's mechanics:
 *   - Professions contain skill trees made of nodes
 *   - Nodes have prerequisites, costs, and optional Specials
 *   - Trees branch into other trees via "root node" unlocks
 *   - Each tree requires a specific tool to earn XP
 */

/** Top-level profession category */
export type ProfessionCategory =
  | 'scouting'
  | 'combat'
  | 'crafting'
  | 'harvesting'
  | 'social'
  | 'science'
  | 'infrastructure';

/** The visual state of a skill node in the planner */
export type SkillNodeState =
  | 'locked'           // Prerequisites not met
  | 'available'        // Can be learned (prereqs met, not yet selected)
  | 'in_practice'      // Selected and active (counts toward 80 cap)
  | 'out_of_practice'  // Previously learned, now atrophied
  | 'wip';             // Exists in game data but not yet implemented

/** EXP and Klaatu costs to unlock a skill node */
export interface SkillCosts {
  exp: number;
  klaatu: number;
}

/** A single node in a skill tree */
export interface SkillNode {
  /** Unique ID across the entire planner (e.g., "ranger.camping.forward_base") */
  id: string;

  /** Display name shown in the UI */
  name: string;

  /** Short description of what this skill does */
  description: string;

  /** Which profession tree this node belongs to */
  professionId: string;

  /** Position in the React Flow canvas */
  position: { x: number; y: number };

  /** IDs of nodes that must be in_practice before this can be learned */
  prerequisites: string[];

  /** Whether this node is a "root node" that unlocks access to another tree */
  unlocksTree?: string;

  /** If this node grants a Special ability */
  special?: SkillSpecial;

  /** Whether this skill is implemented in-game or WIP */
  implemented: boolean;

  /** Tier/depth in the tree (0 = root, higher = deeper) */
  tier: number;

  /** EXP and Klaatu costs extracted from OCR data — absent if not yet captured */
  costs?: SkillCosts;
}

/** A Special ability that can be crafted into a tool */
export interface SkillSpecial {
  /** Display name */
  name: string;

  /** What the Special does */
  description: string;

  /** Which tool type this Special is crafted into */
  toolType: string;
}

/** A connection between two nodes in the tree */
export interface SkillEdge {
  /** Source node ID */
  source: string;

  /** Target node ID */
  target: string;

  /** Whether this edge crosses between profession trees */
  crossTree: boolean;
}

/** The tool required to earn XP in a profession */
export interface ProfessionTool {
  /** Tool name as shown in-game (e.g., "Extractor", "Rally Banner") */
  name: string;

  /** Which profession this tool is for */
  professionId: string;

  /** Icon identifier (for future asset integration) */
  icon: string;
}

/** A complete profession definition */
export interface Profession {
  /** Unique profession ID (e.g., "ranger", "artisan_weaponsmith") */
  id: string;

  /** Display name */
  name: string;

  /** Short description */
  description: string;

  /** Which category this profession belongs to */
  category: ProfessionCategory;

  /** The tool required for this profession */
  tool: ProfessionTool;

  /** All skill nodes in this profession's tree */
  nodes: SkillNode[];

  /** All edges (connections) within this tree */
  edges: SkillEdge[];

  /** IDs of professions whose root nodes appear in this tree */
  branchesTo: string[];

  /** IDs of professions that branch into this one */
  branchesFrom: string[];

  /** Whether this profession is fully implemented in-game */
  implemented: boolean;
}

/** Index file for loading all professions */
export interface ProfessionIndex {
  professions: ProfessionSummary[];
  totalNodes: number;
  lastUpdated: string;
}

/** Lightweight summary for the profession browser sidebar */
export interface ProfessionSummary {
  id: string;
  name: string;
  category: ProfessionCategory;
  nodeCount: number;
  implemented: boolean;
  toolName: string;
}
