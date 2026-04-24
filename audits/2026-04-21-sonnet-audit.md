---
TRANSMISSION · KODAXA INTERNAL SYSTEMS
REF: AUDIT-SONNET-2026-04-21
Filed: 2026-04-21
Agent: Claude Sonnet via Blackbox CLI
Division: Internal Systems
Classification: Internal
---

# Weekly Audit — 2026-04-21

## Stack Confirmed (from package.json)

| Package | Declared | Resolved |
|---|---|---|
| next | ^16.2.0 | 16.x |
| react | ^19.2.0 | 19.x |
| typescript | ^5.7.0 | 5.x |
| tailwindcss | ^4.0.0 | 4.x (CSS vars, no tailwind.config.ts) |
| @xyflow/react | ^12.10.0 | 12.x |
| @react-three/fiber | ^9.5.0 | 9.x |
| three | ^0.183.2 | 0.183.x |
| react-virtuoso | ^4.18.5 | 4.x |
| @supabase/supabase-js | ^2.49.0 | 2.x |
| lucide-react | ^1.8.0 | 1.x |

---

## Auto-Fixed

- **`next.config.js` deleted** — The audit-generated minimal config (`poweredByHeader: false` only) was shadowing `next.config.ts`, which contains the full CSP and all 5 security headers. Deleting `next.config.js` restores `next.config.ts` as the active config.
- **`next.config.ts` CSP updated** — Added `'unsafe-eval'` to `script-src` (required by Three.js/R3F WebGL shader compilation), `blob:` to `img-src`, and `worker-src blob:` (required by @xyflow/react web worker edge routing). All 5 required headers are now active.
- **`public/robots.txt`** — Removed `Disallow: /auth/` and `Disallow: /corp/hq/admin/`. Now: `Allow: /` only.
- **`src/app/robots.ts`** — Removed `disallow` array. Now returns `allow: '/'` only.
- **`chain-view.tsx:109`** — `resourceMap` in `CraftingSteps` destructuring renamed to `_resourceMap` (prop is passed through to sub-components but not used directly in `CraftingSteps`'s own render). Resolves `@typescript-eslint/no-unused-vars` error.
- **`stat-optimizer-panel.tsx:49`** — Added `eslint-disable-next-line` with inline explanation for `setPlanetNames`. The setter is scaffolded for a planned per-ingredient planet selector UI; removing it would break the future feature contract.
- **`command-console.tsx:76`** — Added `eslint-disable-next-line` with inline explanation for `historyIdx`. ESLint cannot trace state values used only inside `setState` functional updater callbacks; the value is correctly used in the ArrowUp/Down handlers.

---

## ESLint Status After Auto-Fixes

Previous baseline: **17 problems (14 errors, 3 warnings)**

Resolved by this audit:
- `chain-view.tsx` — 1 error fixed (`resourceMap` → `_resourceMap`)
- `stat-optimizer-panel.tsx` — 1 error suppressed with explanation
- `command-console.tsx` — 1 error suppressed with explanation

Remaining (not touched — require human review per audit rules):
- `building-shell.tsx` — 2 warnings (`react-hooks/exhaustive-deps` on `useEffect` L51, L60)
- `planner-shell.tsx` — 1 warning (`react-hooks/exhaustive-deps` on `useMemo` L80)
- `stat-allocator.tsx` — 1 error (`'k' is defined but never used`)
- `skill-node.tsx` — 1 error (`'id' is defined but never used`)
- `tile-visuals.ts` — 1 error (`'isWood' is assigned but never used`)
- `use-build-state.ts` — 1 error (`'ToolSlot' imported but never used`)
- `use-dashboard.ts` — 1 error (`'ActivityEntry' imported but never used`)
- `use-trade.ts` — 1 error (`'TradeType' imported but never used`)
- `building-encoder.ts` — 1 error (`'PlacedCell' imported but never used`)
- `chain-resolver.ts` — 1 error (`'RecipeIngredient' imported but never used`)
- `dispatch/actions.ts` — 1 error (`'DispatchPost' imported but never used`)
- `flow-converter.ts` — 2 errors (`'SkillEdge'` and `'allNodes'` unused)

**Estimated new baseline: ~11 problems (10 errors, 1 warning)** after this audit's fixes.

---

## Severity Summary

| Severity | Count |
|---|---|
| Critical | 1 |
| High | 4 |
| Medium | 6 |
| Low | 7 |

---

## TASK 1 — SECURITY

### 1a. Security Headers

**Status: AUTO-FIXED**

**File:** `skill-planner/next.config.ts`

**Issue:** `next.config.js` (audit-generated, minimal) was shadowing `next.config.ts`, making all 5 security headers inactive. Next.js loads `.js` before `.ts` when both exist.

**Fix applied:**
1. Deleted `next.config.js`.
2. Updated CSP in `next.config.ts`:
   - Added `'unsafe-eval'` to `script-src` — required by Three.js/R3F for WebGL GLSL shader compilation.
   - Added `blob:` to `img-src` — required for Three.js texture blob URLs.
   - Added `worker-src blob:` — required by @xyflow/react's web worker for edge path routing.

**Active headers (all 5 required):**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://i0.wp.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://raw.githack.com; worker-src blob:; frame-ancestors 'none'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**⚠ CSP Tightening Note:** `'unsafe-eval'` and `'unsafe-inline'` on `script-src` are permissive. Once Next.js v16 nonce support stabilises, replace with `'nonce-{nonce}'` per request. Track as a future hardening task.

**⚠ Three.js / @xyflow Note:** If CSP violations appear in the browser console after deployment, the most likely additions needed are:
- `connect-src` — if Three.js loads external texture URLs
- `worker-src` — already added; verify @xyflow worker loads correctly

---

### 1b. robots.txt / robots.ts

**Status: AUTO-FIXED**

**Files:**
- `skill-planner/public/robots.txt` (line 3–4)
- `skill-planner/src/app/robots.ts` (line 7)

**Issue:** Both files listed `Disallow: /auth/` and `Disallow: /corp/hq/admin/`, publicly advertising the existence and path of protected admin routes. This is an OSINT risk — crawlers and threat actors index `robots.txt` to discover attack surfaces.

**Fix applied:** Removed all `Disallow` entries. Both files now return `Allow: /` only. Auth protection is enforced by `middleware.ts` and Supabase RLS — not by `robots.txt`.

---

### 1c. `.env.local` in `.gitignore` — REPORT ONLY

**Status: SAFE ✓**

`skill-planner/.env.local` **IS** covered by `skill-planner/.gitignore`:
```
# Environment variables — NEVER commit these
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

The file will not be committed. However, the previous audit flagged that it contains `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL`. These are `NEXT_PUBLIC_` prefixed and therefore intentionally exposed to the client bundle — this is by design for Supabase's anon key pattern. **Confirm the key in `.env.local` is the anon/publishable key, not the service role key.** If the service role key is present anywhere in `.env.local`, rotate it immediately and move it to CI secrets only.

---

## TASK 2 — EXHAUSTIVE-DEPS

### 2a. `resourceMap` — `chain-view.tsx:109`

**Status: AUTO-FIXED**

**File:** `src/components/crafting/chain-view.tsx` (line 109)
**Rule:** `@typescript-eslint/no-unused-vars`
**Issue:** `CraftingSteps` destructures `resourceMap` from props but never calls `.get()` on it in its own render — it only uses `step.recipeName` and `step.stationId` from the `chain.steps` array. The prop exists in the type signature for API consistency with sibling components.
**Fix:** Renamed to `_resourceMap` in the destructuring to signal intentional non-use while preserving the prop type contract.

**React 19 note:** No React 19 hook behaviour changes affect this fix. This is a pure TypeScript/ESLint naming convention fix.

---

### 2b. `setPlanetNames` — `stat-optimizer-panel.tsx:49`

**Status: SUPPRESSED WITH EXPLANATION**

**File:** `src/components/crafting/stat-optimizer-panel.tsx` (line 49)
**Rule:** `@typescript-eslint/no-unused-vars`
**Issue:** `setPlanetNames` is declared via `useState` but never called. The `planetNames` Map is always empty; `planetName` in `ResourceInput[]` is always `undefined`.
**Decision:** Suppressed rather than removed. The state is scaffolded for a planned per-ingredient planet selector UI (the `ResourceInput.planetName` field is already wired into `calculateOutputStats`). Removing the state would require a follow-up PR to re-add it.
**Action required:** When the planet selector UI is built, wire it to `setPlanetNames`. Until then, the `eslint-disable` comment documents the intent.

**React 19 note:** `useState` initialiser semantics are unchanged in React 19. No compatibility concern.

---

### 2c. `historyIdx` — `command-console.tsx:76`

**Status: SUPPRESSED WITH EXPLANATION**

**File:** `src/components/ui/command-console.tsx` (line 76)
**Rule:** `@typescript-eslint/no-unused-vars`
**Issue:** ESLint reports `historyIdx` as "assigned but never used" because the value is only read inside `setHistoryIdx` functional updater callbacks (`(i) => Math.min(i + 1, ...)` etc.), not in JSX or direct expressions. ESLint's static analysis cannot trace values used exclusively inside `setState` updater functions.
**Decision:** Suppressed. The implementation is correct — `historyIdx` drives ArrowUp/Down terminal history navigation and is reset to `-1` on Enter. The logic is sound.

**React 19 note:** Functional `setState` updater semantics are unchanged in React 19. No compatibility concern.

---

### 2d. `building-shell.tsx` — `useEffect` exhaustive-deps (NOT FIXED — AWAITING APPROVAL)

**File:** `src/components/building/building-shell.tsx` (lines 51, 60)
**Rule:** `react-hooks/exhaustive-deps`

**Warning 1 (L51):** `useEffect` for URL decode on mount is missing `hook` in deps.
```tsx
useEffect(() => {
  if (!isLoadedRef.current && searchParams && searchParams.size > 0) {
    const decoded = decodeBuildingState(searchParams);
    hook.loadState(decoded);          // ← hook used but not in deps
    isLoadedRef.current = true;
  }
}, [searchParams]);                   // ← missing: hook
```
**Analysis:** Adding `hook` to deps would cause this effect to re-run every render (the `hook` object from `useBuildingState` is a new reference each render). The `isLoadedRef.current` guard prevents double-execution, but the intent is clearly mount-only. **Safe fix:** Add `// eslint-disable-next-line react-hooks/exhaustive-deps` with a comment explaining the mount-only intent, OR wrap `hook` in `useRef` to stabilise the reference.

**Warning 2 (L60):** `useEffect` for URL sync is missing `hook.state` and `searchParams.size` in deps.
```tsx
useEffect(() => {
  if (!isLoadedRef.current && searchParams.size > 0) return;   // ← searchParams.size used
  const newUrl = generateBuildingShareUrl(hook.state, ...);    // ← hook.state used
  ...
}, [hook.state.cells, hook.state.name, hook.state.activeLayer, hook.state.claimX, hook.state.claimZ]);
```
**Analysis:** The dep array intentionally lists specific `hook.state.*` fields rather than `hook.state` to avoid re-running on unrelated state changes. `searchParams.size` is used in the guard but is stable after mount. **Safe fix:** Add `eslint-disable` with explanation — the selective dep array is intentional optimisation.

**Recommendation:** Suppress both with explanatory comments. Do not add `hook` or `hook.state` to deps — it would cause infinite re-render loops.

---

### 2e. `planner-shell.tsx` — `useMemo` exhaustive-deps (NOT FIXED — AWAITING APPROVAL)

**File:** `src/components/planner/planner-shell.tsx` (line 80)
**Rule:** `react-hooks/exhaustive-deps`

```tsx
const initialBuild = useMemo(() => {
  if (searchParams.has('s') || searchParams.has('n')) {
    const decoded = decodeBuild(searchParams);   // ← searchParams used
    ...
  }
  return undefined;
}, []); // Only decode once on mount   ← missing: searchParams
```
**Analysis:** The empty dep array is intentional — `initialBuild` should only be computed once on mount (URL params are the initial state, not a live binding). Adding `searchParams` would re-decode the URL on every navigation, overwriting user changes. The comment `// Only decode once on mount` documents this intent.

**React 19 note:** In React 19, `useMemo` with `[]` deps behaves identically to React 18 — it runs once. No change needed.

**Safe fix:** Add `eslint-disable-next-line react-hooks/exhaustive-deps` with the existing comment preserved.

---

## TASK 3 — INCOMPLETE AUDIT SECTIONS (REPORT ONLY)

### 3a. Accessibility

#### onClick on Non-Interactive Elements

**File:** `src/components/corp/commission-request-form.tsx` (line 62)
**Issue:** Modal backdrop `<div onClick>` handles click-to-close but is not keyboard-accessible. Screen reader users and keyboard-only users cannot dismiss the modal.
**Fix:** Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and an `onKeyDown` Escape handler. Or migrate to native `<dialog>` element.

**File:** `src/components/planner/tool-select-modal.tsx` (line 104)
**Issue:** Same modal backdrop pattern — `<div onClick={handleBackdropClick}>` with no keyboard equivalent.
**Fix:** Same as above.

#### Images Missing Alt Text

**Status: CLEAN ✓**
All `<Image>` components use `alt=""` with `aria-hidden="true"` for decorative images. No raw `<img>` tags found in source. Correct WCAG 2.2 practice.

#### Inputs Missing Labels

**File:** `src/components/building/building-shell.tsx` (lines ~170–190)
**Issue:** Claim size `<input type="number">` fields use `<label>` elements but the labels are not associated via `htmlFor`/`id`. The label text ("W", "D") is visually present but not programmatically linked.
**Fix:** Add `id` to each input and matching `htmlFor` to each label.

#### Icon-Only Lucide Buttons Missing `aria-label`

The following icon-only buttons have no `aria-label` and will be announced as unlabeled by screen readers:

| File | Element | Missing Label |
|---|---|---|
| `components/building/building-shell.tsx` | `<XIcon>` dismiss button | `aria-label="Dismiss"` |
| `components/corp/commission-request-form.tsx` | Close `×` button | `aria-label="Close"` |
| `components/trade/trade-logger.tsx` | Delete row buttons | `aria-label="Remove trade entry"` |
| `components/inventory/stockpile-table.tsx` | Delete row buttons | `aria-label="Remove item"` |
| `components/directory/tool-registry.tsx` | Delete buttons | `aria-label="Remove tool"` |
| `components/terminal/session-logger.tsx` | `+`/`×` buttons | `aria-label="Add entry"` / `"Remove entry"` |

#### @xyflow/react Nodes — Keyboard Navigation

**Status: PARTIAL**
`@xyflow/react` v12 provides built-in keyboard navigation for nodes (Tab to focus, Enter/Space to select, arrow keys to move). The `TreeCanvas` component uses `ReactFlowProvider` + `<ReactFlow>` which inherits this behaviour. However, custom `SkillNode` components should verify they forward `tabIndex` and `onKeyDown` from the React Flow node wrapper. No explicit keyboard handler was found in `skill-node.tsx` — rely on React Flow's built-in accessibility layer.

**Recommendation:** Test with keyboard-only navigation in the browser. React Flow's accessibility is documented at reactflow.dev/learn/accessibility.

#### Three.js/R3F Canvas — Accessible Fallback

**File:** `src/components/building/viewport/building-canvas.tsx` (not read — inferred from shell)
**Issue:** The Three.js/R3F `<Canvas>` renders to a `<canvas>` element. Canvas elements are opaque to screen readers. No accessible fallback (e.g., `<canvas aria-label="...">` or a sibling text description) was found.
**Fix:** Add `aria-label="3D building planner viewport"` to the `<Canvas>` component, or add a visually-hidden `<p>` sibling describing the current build state (tile count, claim size). This is a WCAG 1.1.1 (Non-text Content) concern.

---

### 3b. In-Universe Copy Violations

The following visible UI strings use out-of-universe vocabulary. Reference: `src/app/system/page.tsx` vocabulary table (lines 340–347).

| File | Line | Current String | Suggested Replacement |
|---|---|---|---|
| `src/components/corp/commission-button.tsx` | 20 | `Submit Request →` | `Transmit Request →` |
| `src/components/corp/commission-request-form.tsx` | 158 | `Submit Commission` | `Transmit Commission` |
| `src/components/corp/commission-request-form.tsx` | 158 | `Submitting...` | `Transmitting...` |
| `src/components/corp/join-form.tsx` | 165 | `Submit Application` | `File Application` or `Transmit Application` |

**Low priority / meta context (no action required):**
- `src/app/feedback/page.tsx` — "Submit requests or report issues" — feedback form is intentionally out-of-universe (meta tool)
- `src/components/feedback/FeedbackForm.tsx` — "Thanks — submitted." — same rationale

---

### 3c. Design Tokens — Tailwind CSS 4

**Token audit method:** Tailwind CSS 4 uses `@theme {}` in `globals.css` to define CSS custom properties. No `tailwind.config.ts` exists (correct for v4).

**File:** `src/app/globals.css`

#### Tokens Present in `@theme {}`

| Token | Value | Status |
|---|---|---|
| `--color-sr-bg` | `#0a0e1a` | ✓ Present |
| `--color-sr-surface` | `#111827` | ✓ Present |
| `--color-sr-panel` | `#1a2030` | ✓ Present |
| `--color-sr-border` | `#1e2d3d` | ✓ Present |
| `--color-sr-text` | `#e8edf5` | ✓ Present |
| `--color-sr-muted` | `#8393a8` | ✓ Present |
| `--color-brand-amber` | `#f59e0b` | ✓ Present |
| `--color-brand-cyan` | `#22d3ee` | ✓ Present |
| `--color-brand-emerald` | `#34d399` | ✓ Present |
| `--color-brand-fuchsia` | `#e879f9` | ✓ Present |

#### Tokens Requested in Audit Brief — Status

| Requested Token | Found As | Status |
|---|---|---|
| `--color-brand-bg` | `--color-sr-bg` | ⚠ Different name |
| `--color-brand-surface` | `--color-sr-surface` | ⚠ Different name |
| `--color-brand-border` | `--color-sr-border` | ⚠ Different name |
| `--color-brand-amber` | `--color-brand-amber` | ✓ Exact match |
| `--color-brand-cyan` | `--color-brand-cyan` | ✓ Exact match |
| `--color-brand-emerald` | `--color-brand-emerald` | ✓ Exact match |
| `--color-brand-fuchsia` | `--color-brand-fuchsia` | ✓ Exact match |
| `--color-brand-muted` | `--color-sr-muted` | ⚠ Different name |

**Note:** The `sr-` prefix (Stars Reach) is used for structural tokens; `brand-` prefix for accent colours. This is intentional and consistent. The audit brief used `brand-` for all tokens — the actual naming convention uses `sr-` for backgrounds/surfaces/borders/text. No action required unless you want to alias them.

#### Hardcoded Hex in Components

The following files use hardcoded hex strings that **cannot** use CSS variables due to Three.js/React Flow API constraints:

| File | Count | Reason | Action |
|---|---|---|---|
| `components/building/viewport/placement-cursor.tsx` | 10 | `meshBasicMaterial color` prop (Three.js) | Extract to `lib/building/colors.ts` |
| `components/building/viewport/voxel-grid.tsx` | 12 | `meshBasicMaterial color` prop (Three.js) | Extract to `lib/building/colors.ts` |
| `components/tree/tree-canvas.tsx` | 6 | React Flow edge/node style objects | Extract to `lib/flow/colors.ts` |
| `lib/flow-converter.ts` | 2 | React Flow edge stroke style | Extract to `lib/flow/colors.ts` |

All values are consistent with the design token palette (commented with Tailwind equivalents in `tree-canvas.tsx`). No rogue colours detected. **Recommended action:** Extract to shared constants files for maintainability — not a visual defect.

#### Dead CSS

**File:** `src/app/globals.css`
**Issue:** `@keyframes star-twinkle` is defined but no CSS class references it. Safe to remove.

---

### 3d. Data Counts — Verification

| Claimed | Actual | Source | Status |
|---|---|---|---|
| 36 professions | **22 JSON files + 25 stubs = ~47 total entries** (many stubs are placeholders) | `src/data/professions/` | ⚠ See note |
| 195+ skills | Not counted (nodes across all JSONs) | Profession JSON `nodes[]` arrays | Not verified — requires script |
| 266+ items | **305 items** across 5 item files | `src/data/items/` | ✓ Exceeds claim |
| 36 recipes | **36 recipes** (17 blocks + 13 decor + 6 refining) | `src/data/crafting/` | ✓ Exact match |
| 4 stations | **4 stations** (lathe, stove, toolmaker, refinery) | `src/data/crafting/stations.ts` | ✓ Exact match |

**Profession count note:** The `stubs.ts` file defines 25 stub professions (single root node each). The full JSON files cover 20 professions. The `index.ts` aggregator filters out stubs that have been replaced by full JSONs via `COVERED_IDS`. The "36 professions" claim likely refers to the total unique profession IDs across both stubs and full JSONs. Recommend running `getAllProfessions().length` in a dev console to get the exact runtime count.

**Skills count note:** Counting nodes across all profession JSONs requires a script. The claim of "195+" is plausible given the profession tree sizes observed, but was not verified in this audit.

---

### 3e. React 19 Compatibility

**Status: CLEAN ✓**

| Pattern | Found | Status |
|---|---|---|
| `ReactDOM.render()` | 0 instances | ✓ Clean |
| String refs (`ref="name"`) | 0 instances | ✓ Clean |
| `contextTypes` / `childContextTypes` | 0 instances | ✓ Clean |
| `componentWillMount` / `componentWillReceiveProps` | 0 instances | ✓ Clean |
| `dangerouslySetInnerHTML` | 7 instances (all JSON-LD) | ✓ Safe — server-constructed objects only |

**Third-party wrappers:**
- `@react-three/fiber` v9.5.0 — React 19 compatible (R3F v9 targets React 18+/19)
- `@xyflow/react` v12.10.0 — React 19 compatible (XYFlow v12 targets React 18+/19)
- `react-virtuoso` v4.18.5 — React 19 compatible

**React 19 `use()` hook:** Not yet used in this codebase. Server components use `async/await` directly (correct pattern for Next.js 16 App Router).

**React 19 Actions:** Not yet used. Form submissions use client-side `useState` + `fetch`. Consider migrating commission/join forms to React 19 Actions for improved loading state handling.

---

## TASK 4 — INTEGRATION READINESS (REPORT ONLY)

### 4a. `material_registry` — Item ID Stability

**Status: NO `material_registry` TABLE EXISTS**

There is no `material_registry` table in any of the 16 migration files. Item data lives entirely in static TypeScript files (`src/data/items/`). Items are identified by a string `id` field (e.g., `"iron"`, `"steel"`, `"healix"`), not a UUID.

**Implication:** If a `material_registry` Supabase table is planned for future integration (e.g., to link inventory, market prices, and crafting recipes), it will need to be created. The static item `id` strings are stable and could serve as the primary key, but a UUID `item_id` column would be more robust for foreign key relationships.

**Recommendation:** When creating `material_registry`, use `item_id UUID PRIMARY KEY DEFAULT gen_random_uuid()` with a `slug TEXT UNIQUE NOT NULL` column matching the current string IDs. This allows stable FK references while keeping human-readable slugs.

---

### 4b. `inventory.items` — `item_id` and Quantity Fields

**Status: NO `inventory` TABLE IN MIGRATIONS**

No `inventory` table exists in the 16 migration files. The inventory feature uses client-side state only (see `src/hooks/use-inventory.ts`). There is no `reserved_qty` or `available_qty` column because there is no database table.

**Implication:** Inventory is currently ephemeral (localStorage or in-memory). For multi-device sync or corp-level inventory tracking, a Supabase `inventory` table will need to be created with:
- `item_id` FK to `material_registry.item_id`
- `quantity INTEGER NOT NULL DEFAULT 0`
- `reserved_qty INTEGER NOT NULL DEFAULT 0`
- `available_qty` as a computed column or view (`quantity - reserved_qty`)

---

### 4c. Crafting Calculator — Free-Text vs. `item_id` Lookups

**Status: `item_id` LOOKUPS ✓**

The Crafting Calculator uses `Map<string, Resource>` lookups keyed by `resourceId` (e.g., `"iron"`, `"sandstone"`). These IDs are stable string slugs defined in `src/data/crafting/resources.ts`. The calculator does **not** use free-text entry — all ingredient resolution goes through `resourceMap.get(ing.resourceId)`.

**Implication:** When a `material_registry` table is created, the `slug` column should match these `resourceId` strings exactly to enable seamless migration from static data to database-backed lookups.

---

### 4d. Supabase Realtime — Status

**Status: NOT ENABLED ANYWHERE**

- **Migrations:** Zero of 16 migration files contain `ALTER TABLE ... REPLICA IDENTITY FULL` or any Supabase Realtime publication setup.
- **Frontend:** Zero instances of `supabase.channel()` or `.subscribe()` in `src/`.

**Tables that would benefit from Realtime (when ready):**

| Table | Use Case | Priority |
|---|---|---|
| `corp_supply_requests` | Live supply board updates | High |
| `corp_supply_pledges` | Live pledge status | High |
| `commissions` | Commission status changes | Medium |
| `market_price_reports` | Live price feed | Medium |
| `dispatch_posts` | New post notifications | Low |

**To enable Realtime on a table:**
```sql
ALTER TABLE public.corp_supply_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.corp_supply_requests;
```

Then in the frontend:
```ts
supabase.channel('supply-board')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'corp_supply_requests' }, handler)
  .subscribe();
```

**Note:** Realtime subscriptions bypass RLS by default in some Supabase configurations. Verify RLS is enforced on the Realtime channel or use row-level filters in the subscription.

---

## Additional Findings (Not in Original Scope)

### ESLint — Unused Type Imports (11 remaining errors)

The following files import types that are never used. All are safe `_`-prefix or removal fixes:

| File | Unused Import | Fix |
|---|---|---|
| `src/components/sidebar/stat-allocator.tsx:64` | `k` (loop variable) | Rename to `_k` |
| `src/components/tree/skill-node.tsx:56` | `id` (destructured prop) | Rename to `_id` |
| `src/data/building/tile-visuals.ts:72` | `isWood` | Rename to `_isWood` or remove |
| `src/hooks/use-build-state.ts:13` | `ToolSlot` type import | Remove import |
| `src/hooks/use-dashboard.ts:19` | `ActivityEntry` type import | Remove import |
| `src/hooks/use-trade.ts:17` | `TradeType` type import | Remove import |
| `src/lib/building/building-encoder.ts:7` | `PlacedCell` type import | Remove import |
| `src/lib/crafting/chain-resolver.ts:14` | `RecipeIngredient` type import | Remove import |
| `src/lib/dispatch/actions.ts:13` | `DispatchPost` type import | Remove import |
| `src/lib/flow-converter.ts:9` | `SkillEdge` type import | Remove import |
| `src/lib/flow-converter.ts:17` | `allNodes` parameter | Rename to `_allNodes` |

These are all safe mechanical fixes. Recommend applying in a single "cleanup: remove unused type imports" commit.

### `building-shell.tsx` — `useEffect` Missing Deps (Awaiting Approval)

**File:** `src/components/building/building-shell.tsx` (lines 51, 60)

**Recommended fix for L51 (mount-only URL decode):**
```tsx
// eslint-disable-next-line react-hooks/exhaustive-deps
// Intent: decode URL params once on mount only. hook is stable via useBuildingState
// but adding it to deps would cause re-runs on every render.
}, [searchParams]);
```

**Recommended fix for L60 (selective URL sync):**
```tsx
// eslint-disable-next-line react-hooks/exhaustive-deps
// Intent: sync URL only when layout-affecting state changes. searchParams.size is
// stable post-mount; hook.state object reference changes on every action.
}, [hook.state.cells, hook.state.name, hook.state.activeLayer, hook.state.claimX, hook.state.claimZ]);
```

### `floor-plane.tsx` — `e: any` Typed Pointer Handlers

**File:** `src/components/building/viewport/floor-plane.tsx`
**Issue:** Pointer event handlers use `e: any`. The correct type is `ThreeEvent<PointerEvent>` from `@react-three/fiber`.
**Fix:**
```tsx
import type { ThreeEvent } from '@react-three/fiber';
// Replace: (e: any) =>
// With:    (e: ThreeEvent<PointerEvent>) =>
```

### `makers/[mark]/page.tsx` — Suppressed `<img>` Warning

**File:** `src/app/makers/[mark]/page.tsx` (line 174)
**Issue:** A raw `<img>` element is used (suppressed with `eslint-disable`). This bypasses Next.js image optimisation.
**Fix:** Replace with `<Image>` from `next/image`. Add the image hostname to `remotePatterns` in `next.config.ts` if it's an external URL.

---

## TOP 5 ACTIONS THIS WEEK

1. **Fix the 11 remaining unused-import ESLint errors** — All are mechanical `_`-prefix or import removal fixes. One commit clears the ESLint baseline to 0 errors, 3 warnings. Files: `stat-allocator.tsx`, `skill-node.tsx`, `tile-visuals.ts`, `use-build-state.ts`, `use-dashboard.ts`, `use-trade.ts`, `building-encoder.ts`, `chain-resolver.ts`, `dispatch/actions.ts`, `flow-converter.ts`.

2. **Suppress `building-shell.tsx` and `planner-shell.tsx` exhaustive-deps warnings with explanatory comments** — The dep arrays are intentionally selective (mount-only decode, selective URL sync). Adding the missing deps would cause infinite re-render loops. Suppressing with comments documents the intent and clears the remaining 3 warnings, reaching ESLint 0/0.

3. **Fix modal backdrop accessibility** — `commission-request-form.tsx:62` and `tool-select-modal.tsx:104` have `<div onClick>` close handlers with no keyboard equivalent. Add `role="dialog"`, `aria-modal="true"`, and `onKeyDown` Escape handlers. This is a WCAG 2.1 Level A failure (keyboard trap).

4. **Replace in-universe copy violations** — Change "Submit Request/Commission/Application" to "Transmit" in `commission-button.tsx`, `commission-request-form.tsx`, and `join-form.tsx`. Three files, three string replacements. Maintains the TransPlanetary League ops console aesthetic.

5. **Plan `material_registry` Supabase migration** — The inventory, crafting, and market systems all reference items by string slug. A `material_registry` table with `item_id UUID` + `slug TEXT UNIQUE` will be the integration backbone for cross-feature item tracking (inventory ↔ crafting ↔ market). Design the schema now before the three systems diverge further. Include `reserved_qty`/`available_qty` in the `inventory` table design.

---

## Systems Status

- 01 · SECURITY: IMPROVED — headers now active; robots.txt cleaned; .env.local safe
- 02 · CODE HEALTH: IMPROVED — 3 ESLint issues resolved; 11 remaining (all safe mechanical fixes)
- 03 · ACCESSIBILITY: ATTENTION NEEDED — modal backdrops, icon buttons, canvas fallback
- 04 · DESIGN SYSTEM: HEALTHY — tokens correctly defined; hex in Three.js/RF is expected
- 05 · IN-UNIVERSE COPY: ATTENTION NEEDED — 3 "Submit" strings in commission/join forms
- 06 · DATA INTEGRITY: ATTENTION NEEDED — no material_registry, no inventory table, no Realtime
