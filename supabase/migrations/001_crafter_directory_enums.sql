-- ============================================================
-- 001_crafter_directory_enums.sql
-- Crafter Directory — Enum type definitions
-- Stars Reach Community Tools
--
-- Design note: enums map directly to confirmed game mechanics.
-- Stars Reach has 7 profession categories and 5 crafting branches.
-- Source: starsreach.com/advancement-and-skill-trees/
-- ============================================================

-- Commission status — is this crafter currently taking orders?
CREATE TYPE commission_status AS ENUM (
  'open',       -- Actively taking commissions
  'limited',    -- Taking select commissions, DM first
  'closed',     -- Not taking commissions currently
  'unknown'     -- Player hasn't set their status
);

-- The confirmed Stars Reach profession categories.
-- Used to tag specializations for directory filtering.
CREATE TYPE profession_category AS ENUM (
  'scouting',
  'combat',
  'crafting',
  'harvesting',
  'social',
  'science',
  'infrastructure'
);

-- Crafting sub-branches confirmed from Better Homes & Gardens update.
-- Cooking is a separate tree from the main Crafting tree.
CREATE TYPE crafting_branch AS ENUM (
  'architect',
  'civil_engineering',
  'refining',
  'toolmaking',
  'weaponsmithing',
  'cooking',
  'general'   -- catch-all for mixed/unknown crafting focus
);
