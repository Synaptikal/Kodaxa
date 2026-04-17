/**
 * tree-controls.tsx
 * Zoom/fit/reset controls panel for the skill tree canvas.
 * One concern: providing UI buttons that call React Flow's viewport API.
 *
 * Uses @xyflow/react v12's useReactFlow hook for programmatic control.
 * Source: https://reactflow.dev/api-reference/hooks/use-react-flow
 */

'use client';

import { useCallback } from 'react';
import { useReactFlow, Panel } from '@xyflow/react';

export function TreeControls() {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  const handleReset = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
  }, [setViewport]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const buttonClass =
    'flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors text-sm font-mono';

  return (
    <Panel position="bottom-right" className="flex gap-1.5 p-2">
      <button
        onClick={handleZoomIn}
        className={buttonClass}
        title="Zoom in"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className={buttonClass}
        title="Zoom out"
        aria-label="Zoom out"
      >
        &minus;
      </button>
      <button
        onClick={handleFitView}
        className={buttonClass}
        title="Fit all nodes in view"
        aria-label="Fit view"
      >
        [ ]
      </button>
      <button
        onClick={handleReset}
        className={buttonClass}
        title="Reset viewport"
        aria-label="Reset viewport"
      >
        R
      </button>
    </Panel>
  );
}
