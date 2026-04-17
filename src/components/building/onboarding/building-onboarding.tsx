/**
 * building-onboarding.tsx
 * First-visit orientation tour for the Base Building Planner.
 * One concern: walking new users through every tool and panel in sequence.
 *
 * Shows automatically on first visit (localStorage gated).
 * Can be re-triggered via the "?" button rendered by this component.
 * Each step is a floating card positioned relative to the fixed layout:
 *   Left panel   0 – 240px  (w-60)
 *   Viewport     240px – calc(100% – 320px)
 *   Right panel  calc(100% – 320px) – 100%  (w-80)
 *   Toolbar      centered, ~bottom-5
 *   NavHeader    ~48px tall
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { XIcon, ArrowLeftIcon, ArrowRightIcon, HelpCircleIcon } from 'lucide-react';

const STORAGE_KEY = 'kdx_building_tour_v1';

interface TourStep {
  id: string;
  title: string;
  body: string;
  /** CSS position for the floating card */
  position: React.CSSProperties;
  /** Which edge has the pointer arrow */
  arrow?: 'left' | 'right' | 'up' | 'down';
  /** Short label shown in the breadcrumb (where to look) */
  zone?: string;
}

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Base Building Planner',
    body: 'Plan your Stars Reach homestead before spending a single resource in-game. This tool tracks tile caps, calculates your full bill of materials, and warns you about structural hazards.',
    position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    zone: 'Welcome',
  },
  {
    id: 'palette',
    title: 'Tile Palette',
    body: 'Pick a building piece from the palette on the right. Pieces are grouped by type — Blocks, Walls, Roofing, Stairs, Supports, and more. Use the search bar to find by name, or filter by skill requirement (Architect, Civil Eng.).',
    position: { top: '22%', right: 336 },
    arrow: 'right',
    zone: 'Right panel → Palette',
  },
  {
    id: 'toolbar',
    title: 'Tool Modes',
    body: 'Switch tools using the toolbar or keyboard shortcuts.\n\nQ Place  ·  E Erase  ·  F Fill region\nS Pick up tile  ·  I Eyedropper\nV Pan camera  ·  M Measure distance\nR Rotate tile  ·  Ctrl+Z / Ctrl+Y Undo / Redo',
    position: { bottom: 100, left: '50%', transform: 'translateX(-50%)' },
    arrow: 'down',
    zone: 'Bottom toolbar',
  },
  {
    id: 'fill',
    title: 'Fill & Erase Regions',
    body: 'In Fill mode, click and drag to paint a rectangular region with your selected tile. In Erase mode, drag a box to delete all cells in that region. Right-click always erases a single cell in any mode.',
    position: { bottom: 100, left: '50%', transform: 'translateX(-50%)' },
    arrow: 'down',
    zone: 'Bottom toolbar → Fill / Erase',
  },
  {
    id: 'measure',
    title: 'Measure Tool',
    body: 'Press M to switch to Measure mode. Click once on the grid to set an anchor point (green dot). Move the mouse to see live distance readouts — Width, Depth, Diagonal, and enclosed Area. Click again to clear the anchor.',
    position: { top: '30%', left: '50%', transform: 'translateX(-50%)' },
    arrow: 'up',
    zone: 'Viewport (measure HUD appears top-center)',
  },
  {
    id: 'cap',
    title: 'Tile Cap Counter',
    body: 'Every homestead has a hard cap of 330 tiles. The counter on the far right of the toolbar shows your current usage. It turns amber at 270 (approaching cap) and red at 330 (exceeded — you cannot finalize this build in-game).',
    position: { bottom: 100, right: 16 },
    arrow: 'down',
    zone: 'Toolbar → far right',
  },
  {
    id: 'layers',
    title: 'Floors & Layer Visibility',
    body: 'The left panel lists all floor layers. Click a layer to make it the active editing floor. Press the eye icon to hide a layer so you can see through it to lower floors — useful when designing basements or multi-storey interiors.',
    position: { top: '38%', left: 256 },
    arrow: 'left',
    zone: 'Left panel → Layers',
  },
  {
    id: 'claim',
    title: 'Claim Size',
    body: 'Set your homestead footprint with the W (width) and D (depth) inputs at the top of the left panel. Values from 4 to 32 units per side are supported. Cells outside the new boundary are automatically removed when you resize.',
    position: { top: 70, left: 256 },
    arrow: 'left',
    zone: 'Left panel → Claim Size',
  },
  {
    id: 'bom',
    title: 'Bill of Materials',
    body: 'The BOM panel auto-calculates resource totals as you build. Items marked ~est have unconfirmed recipes and may not match in-game costs exactly. The "Open in Crafting Calc" button hands off your resource list to the crafting chain planner.',
    position: { top: '55%', right: 336 },
    arrow: 'right',
    zone: 'Right panel → Bill of Materials',
  },
];

interface BuildingOnboardingProps {
  /** Optional callback when the tour is dismissed */
  onDismiss?: () => void;
}

export function BuildingOnboarding({ onDismiss }: BuildingOnboardingProps) {
  const [open, setOpen]   = useState(false);
  const [step, setStep]   = useState(0);

  // Show automatically on first visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available (SSR safety)
    }
  }, []);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setOpen(false);
    setStep(0);
    onDismiss?.();
  }, [onDismiss]);

  const openTour = useCallback(() => {
    setStep(0);
    setOpen(true);
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  }, [step, dismiss]);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  return (
    <>
      {/* ── "?" re-trigger button (always visible) ────────────────── */}
      {!open && (
        <button
          onClick={openTour}
          title="Open orientation tour"
          className="absolute bottom-5 right-4 z-20 w-7 h-7 flex items-center justify-center bg-sr-bg border border-sr-border text-slate-600 hover:text-cyan-400 hover:border-cyan-700/60 transition-colors"
        >
          <HelpCircleIcon className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ── Tour overlay ──────────────────────────────────────────── */}
      {open && (
        <>
          {/* Subtle backdrop — clicking it skips */}
          <div
            className="fixed inset-0 z-40 bg-black/25"
            onClick={dismiss}
          />

          {/* Tooltip card */}
          <div
            className="fixed z-50 bg-sr-bg border border-sr-border shadow-2xl"
            style={{ ...current.position, maxWidth: 320, minWidth: 240 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-4 pt-3 pb-2 border-b border-sr-border">
              <div className="min-w-0">
                <p className="text-[7px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-0.5 truncate">
                  Orientation · {step + 1} / {STEPS.length}
                  {current.zone && (
                    <>
                      {' · '}
                      <span className="text-cyan-700">{current.zone}</span>
                    </>
                  )}
                </p>
                <h3 className="text-sm font-mono font-bold text-slate-100">{current.title}</h3>
              </div>
              <button
                onClick={dismiss}
                className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors mt-0.5"
                title="Close tour"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
              {current.body.split('\n').map((line, i) => (
                <p
                  key={i}
                  className={`text-[11px] font-mono leading-relaxed ${
                    line.trim() === '' ? 'h-2' : 'text-slate-400'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-4 pb-3">
              {/* Step dots */}
              <div className="flex gap-1 items-center">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`transition-all ${
                      i === step
                        ? 'w-3 h-1.5 bg-cyan-500'
                        : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2 items-center">
                {isFirst ? (
                  <button
                    onClick={dismiss}
                    className="text-[9px] font-mono uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors px-2 py-1"
                  >
                    Skip
                  </button>
                ) : (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono uppercase tracking-widest border border-sr-border text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors"
                  >
                    <ArrowLeftIcon className="w-2.5 h-2.5" />
                    Prev
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 px-3 py-1 text-[9px] font-mono uppercase tracking-widest bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-600/30 hover:border-cyan-600 transition-colors"
                >
                  {isLast ? 'Begin Building' : 'Next'}
                  {!isLast && <ArrowRightIcon className="w-2.5 h-2.5" />}
                </button>
              </div>
            </div>

            {/* Arrow pointers */}
            {current.arrow === 'right' && (
              <div className="absolute top-1/2 -right-[9px] -translate-y-1/2 w-0 h-0 border-t-[7px] border-b-[7px] border-l-[9px] border-transparent border-l-sr-border" />
            )}
            {current.arrow === 'left' && (
              <div className="absolute top-1/2 -left-[9px] -translate-y-1/2 w-0 h-0 border-t-[7px] border-b-[7px] border-r-[9px] border-transparent border-r-sr-border" />
            )}
            {current.arrow === 'down' && (
              <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-transparent border-t-sr-border" />
            )}
            {current.arrow === 'up' && (
              <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[9px] border-transparent border-b-sr-border" />
            )}
          </div>
        </>
      )}
    </>
  );
}
