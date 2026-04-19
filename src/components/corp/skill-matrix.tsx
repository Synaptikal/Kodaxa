'use client';

import { useState, useMemo } from 'react';
import type { CorpRole } from '@/types/corp';
import { ROLE_COLORS, ROLE_LABELS } from '@/types/corp';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getProfessionSummaries } from '@/data/professions/index';

const ALL_PROFESSIONS = getProfessionSummaries();

interface CrafterSpecialization {
  profession_id: string;
  profession_name: string;
  category: string;
  crafting_branch?: string;
  skill_level?: string;
}

interface MemberSkillProfile {
  id: string;
  display_name: string;
  in_game_name: string;
  role: CorpRole;
  home_planet?: string;
  crafter_specializations: CrafterSpecialization[];
}

interface SkillMatrixProps {
  members: MemberSkillProfile[];
}

export function SkillMatrix({ members }: SkillMatrixProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = useMemo(() => {
    // Get all unique categories across the entire game taxonomy
    const cats = new Set<string>();
    ALL_PROFESSIONS.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = search.toLowerCase();
      const matchesSearch = 
        m.in_game_name.toLowerCase().includes(q) || 
        m.display_name.toLowerCase().includes(q) ||
        m.crafter_specializations?.some(s => s.profession_name.toLowerCase().includes(q));
      
      const matchesCategory = filterCategory === 'all' || 
        m.crafter_specializations?.some(s => s.category === filterCategory);
        
      // Only show members that have specializations or match their exact name
      return matchesSearch && matchesCategory && (m.crafter_specializations?.length > 0 || search !== '');
    });
  }, [members, search, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search operant name or profession..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>
        
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-sr-border rounded-xl bg-sr-surface/30">
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">No matching operants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMembers.map(member => {
               const roleStyles = ROLE_COLORS[member.role] || ROLE_COLORS['associate'];
               return (
                 <div key={member.id} className="bg-sr-surface border border-sr-border rounded-xl p-5 hover:border-slate-600 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <Link href={`/directory/${encodeURIComponent(member.in_game_name)}`} className="text-lg font-bold text-slate-100 hover:text-cyan-400 transition-colors">
                         {member.in_game_name}
                       </Link>
                       <p className="text-xs text-slate-400">@{member.display_name}</p>
                     </div>
                     <div className="flex flex-col items-end gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold border ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border} uppercase tracking-wider`}>
                          {ROLE_LABELS[member.role] || member.role}
                        </span>
                        {member.home_planet && (
                           <div className="flex items-center gap-1 text-slate-400 font-mono">
                             <MapPin className="w-3.5 h-3.5" />
                             {member.home_planet}
                           </div>
                        )}
                     </div>
                   </div>

                   <div className="space-y-2 border-t border-sr-border/50 pt-4 mt-2">
                      {member.crafter_specializations?.filter(s => filterCategory === 'all' || s.category === filterCategory).map((spec, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded px-3 py-2">
                           <div className="flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-cyan-500/80" />
                             <span className="text-sm text-slate-200">{spec.profession_name}</span>
                           </div>
                           <div className="flex items-center gap-3 text-xs font-mono">
                             <span className="text-slate-500 uppercase">{spec.category}</span>
                             {spec.skill_level && (
                               <Badge variant={spec.skill_level === 'expert' ? 'live' : 'wip'} className="uppercase">
                                 {spec.skill_level}
                               </Badge>
                             )}
                           </div>
                        </div>
                      ))}
                      {(!member.crafter_specializations || member.crafter_specializations.length === 0) && (
                        <div className="text-xs text-slate-500 italic p-2.5">No registered specializations</div>
                      )}
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
