/**
 * build.ts
 * Types for a player's skill build (their planned allocation).
 * One concern: the shape of a saved/shared build.
 *
 * A build captures:
 *   - Which skills are in_practice vs. out_of_practice
 *   - Which 5 tools are equipped
 *   - Which 2 Specials per tool are active
 *   - The 3 stat pool allocations (health/stamina/focus)
 */

/** A tool slot in the player's 5-tool loadout */
export interface ToolSlot {
  /** Which tool is equipped (matches ProfessionTool.name) */
  toolName: string;

  /** The profession this tool serves */
  professionId: string;

  /** Up to 2 Specials crafted into this tool */
  activeSpecials: [string?, string?];
}

/** The 3-pool stat allocation */
export interface StatAllocation {
  health: number;
  stamina: number;
  focus: number;
}

/** A complete build — the user's planned skill configuration */
export interface Build {
  /** Unique build ID (UUID for saved builds, undefined for unsaved) */
  id?: string;

  /** Human-readable name for this build */
  name: string;

  /** Optional description */
  description?: string;

  /** IDs of all skills marked as in_practice */
  activeSkills: string[];

  /** IDs of skills marked as out_of_practice (atrophied) */
  atrophiedSkills: string[];

  /** The 5 equipped tool slots */
  toolSlots: ToolSlot[];

  /** Stat pool allocation */
  stats: StatAllocation;

  /** Timestamp of last modification */
  updatedAt: string;

  /** User ID if saved to Supabase */
  userId?: string;
}

/** Validation result from the skill engine */
export interface BuildValidation {
  valid: boolean;
  errors: BuildError[];
  warnings: BuildWarning[];
}

export interface BuildError {
  type: 'over_skill_cap' | 'over_tool_cap' | 'over_special_cap'
      | 'missing_prerequisite' | 'missing_tool';
  message: string;
  nodeIds?: string[];
}

export interface BuildWarning {
  type: 'approaching_cap' | 'wip_skill' | 'no_specials_assigned';
  message: string;
  nodeIds?: string[];
}

/** Lightweight format for URL encoding a build */
export interface BuildSnapshot {
  /** Skill IDs, comma-separated */
  s: string;
  /** Atrophied skill IDs, comma-separated */
  a: string;
  /** Tool slots encoded as "profId:special1:special2" */
  t: string;
  /** Stats as "h:s:f" */
  st: string;
  /** Build name */
  n: string;
}
