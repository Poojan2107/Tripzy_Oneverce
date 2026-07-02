import React from 'react';
import Image from 'next/image';
import { Search, Sparkles, Plus, Edit3, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface ExperienceItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featuredImage: string | null;
  icon: string | null;
  travelStyles: any;
  estimatedBudget: number | null;
  durationRange: string | null;
  difficultyLevel: string | null;
  tags: any;
  featured: boolean;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
}

interface AdminExperiencesTabProps {
  experiences: ExperienceItem[];
  loadingExperiences: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (exp: ExperienceItem) => void;
  onDelete: (id: string, name: string) => void;
  onCreate: () => void;
  onStatusChange: (id: string, status: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
}

export default function AdminExperiencesTab({ experiences, loadingExperiences, searchTerm, onSearchChange, onEdit, onDelete, onCreate, onStatusChange }: AdminExperiencesTabProps) {
  const filtered = experiences.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-border text-base text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
          />
        </div>
        <button
          onClick={onCreate}
          className="px-5 py-3 sm:py-2.5 btn-night text-micro font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-action-manipulation select-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Experience</span>
        </button>
      </div>

      <div className="hidden sm:block bg-white border border-border rounded-3xl overflow-hidden shadow-card">
        {loadingExperiences ? (
          <div className="text-center py-12 text-stone text-xs">Loading experiences...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone">
            <Sparkles className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone/40" />
            <p className="text-sm font-medium text-night">No experiences registered</p>
            <p className="text-xs mt-1">Create experience nodes to enrich your AI recommendations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-background text-stone uppercase font-bold tracking-wider border-b border-border">
                  <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Experience Node</th>
                  <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Icon</th>
                  <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Budget Target</th>
                  <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Duration</th>
                  <th className="py-4 px-6 text-center text-micro font-mono tracking-[0.25em]">Featured</th>
                  <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Status</th>
                  <th className="py-4 px-6 text-right text-micro font-mono tracking-[0.25em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary-surface/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {exp.featuredImage ? (
                          <Image src={exp.featuredImage} alt={exp.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary-surface flex items-center justify-center shrink-0 border border-border">
                            <Sparkles className="w-4 h-4 text-stone" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-night text-sm">{exp.name}</p>
                          <p className="text-micro text-stone mt-0.5 font-mono">{exp.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-gold text-xs">{exp.icon || 'Sparkles'}</td>
                    <td className="py-4 px-6 font-medium text-stone font-mono text-small">{exp.estimatedBudget ? formatINR(exp.estimatedBudget) : 'Flexible'}</td>
                    <td className="py-4 px-6 text-stone">{exp.durationRange || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                      {exp.featured ? (
                        <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-micro font-bold">YES</span>
                      ) : (
                        <span className="text-stone/40">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={exp.status || 'DRAFT'}
                        onChange={(e) => onStatusChange(exp.id, e.target.value as any)}
                        className="bg-background border border-border rounded-lg px-2 py-1 text-micro font-mono text-night uppercase"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="REVIEW">Review</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => onEdit(exp)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer touch-action-manipulation select-none" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(exp.id, exp.name)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer touch-action-manipulation select-none" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="sm:hidden space-y-3">
        {loadingExperiences ? (
          <div className="text-center py-12 text-stone text-xs">Loading experiences...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone">
            <Sparkles className="w-10 h-10 mx-auto stroke-[1.2] mb-2 text-stone/40" />
            <p className="text-sm font-medium text-night">No experiences registered</p>
          </div>
        ) : (
          filtered.map((exp) => (
            <div key={exp.id} className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-start gap-3">
                {exp.featuredImage ? (
                  <Image src={exp.featuredImage} alt={exp.name} width={56} height={56} className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-secondary-surface flex items-center justify-center shrink-0 border border-border"><Sparkles className="w-5 h-5 text-stone" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-night text-sm truncate">{exp.name}</p>
                  <p className="text-micro text-stone mt-0.5 font-mono truncate">{exp.slug}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-micro text-stone">{exp.estimatedBudget ? formatINR(exp.estimatedBudget) : 'Flexible'}</span>
                    <span className="text-micro text-stone">{exp.durationRange || ''}</span>
                    {exp.featured && <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-micro font-bold">Featured</span>}
                    <span className="bg-night/5 text-night border border-night/10 px-2 py-0.5 rounded-full text-micro font-bold uppercase">{exp.status || 'DRAFT'}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onEdit(exp)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer" title="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(exp.id, exp.name)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
