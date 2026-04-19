/**
 * crate-manager.tsx
 * UI for renaming crates and managing access permissions.
 * One concern: managing the homestead crate configs.
 */

'use client';

import { useState } from 'react';
import type { CrateConfig, CrateId } from '@/types/inventory';

interface Props {
  crates: CrateConfig[];
  onUpdate: (id: CrateId, updates: Partial<CrateConfig>) => void;
  onAddPermission: (id: CrateId, memberName: string) => void;
  onRemovePermission: (id: CrateId, memberName: string) => void;
}

export function CrateManager({
  crates,
  onUpdate,
  onAddPermission,
  onRemovePermission,
}: Props) {
  const [newMemberInputs, setNewMemberInputs] = useState<Record<CrateId, string>>({
    crate_1: '', crate_2: '', crate_3: ''
  });

  const handleAddSubmit = (id: CrateId) => {
    const name = newMemberInputs[id].trim();
    if (name) {
      onAddPermission(id, name);
      setNewMemberInputs({ ...newMemberInputs, [id]: '' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Homestead Crates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crates.map((crate) => (
          <div key={crate.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
            {/* Label Edit */}
            <div className="mb-4">
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Crate Name</label>
              <input
                type="text"
                value={crate.label}
                onChange={(e) => onUpdate(crate.id, { label: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            {/* Access List */}
            <div>
              <label className="block text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Shared Access</label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Corp Member"
                  value={newMemberInputs[crate.id]}
                  onChange={(e) => setNewMemberInputs({ ...newMemberInputs, [crate.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit(crate.id)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-600"
                />
                <button
                  onClick={() => handleAddSubmit(crate.id)}
                  className="bg-teal-800/40 hover:bg-teal-800/60 text-teal-300 px-3 py-1.5 rounded text-xs transition-colors"
                >
                  Add
                </button>
              </div>

              {crate.shared_with.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {crate.shared_with.map((member) => (
                    <span key={member} className="inline-flex items-center gap-1 bg-slate-900 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-700">
                      {member}
                      <button
                        onClick={() => onRemovePermission(crate.id, member)}
                        className="text-slate-500 hover:text-red-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 mt-2 italic">Private crate</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
