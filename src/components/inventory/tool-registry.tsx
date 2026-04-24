/**
 * tool-registry.tsx
 * List view of registered player tools showing specs and levels.
 * One concern: render tool components with inline edit.
 */

'use client';

import type { ToolEntry } from '@/types/inventory';

interface Props {
  tools: ToolEntry[];
  onDelete: (id: string) => void;
}

export function ToolRegistry({ tools, onDelete }: Props) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-slate-800 rounded-lg border-dashed">
        <p className="text-slate-500 text-sm mb-1">No tools registered.</p>
        <p className="text-slate-600 text-[10px]">Use the Add form to register your tools.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tool Registry ({tools.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <div key={tool.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 group">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-amber-400">{tool.tool_name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{tool.profession_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  QL {tool.quality_level}
                </span>
                <button
                  onClick={() => onDelete(tool.id)}
                  aria-label="Delete tool"
                  className="text-slate-600 hover:text-red-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
            
            {(tool.specials[0] || tool.specials[1]) && (
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {tool.specials.map((spec, i) => (
                  spec && (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/20 text-amber-500/80 border border-amber-800/30">
                      {spec}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
