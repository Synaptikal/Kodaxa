/**
 * panel.tsx
 * Standardized surface container for Kodaxa Studios.
 * One concern: panel hierarchy — bg → surface → elevated → inset → ghost.
 *
 * Use instead of writing bg-sr-surface/border-sr-border inline.
 * Hard-edged (no border-radius) is the default; pass className to override.
 */

import { type HTMLAttributes } from 'react';

export type PanelVariant = 'surface' | 'elevated' | 'inset' | 'ghost';

const PANEL_STYLES: Record<PanelVariant, string> = {
  surface:  'bg-sr-surface border border-sr-border',
  elevated: 'bg-sr-panel border border-sr-border',
  inset:    'bg-sr-bg border border-sr-border/50',
  ghost:    'border border-sr-border/40',
};

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
}

export function Panel({ variant = 'surface', className = '', children, ...props }: PanelProps) {
  return (
    <div className={`${PANEL_STYLES[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
