import React from 'react';
import { X } from 'lucide-react';
import { EXCHANGE_RATE } from '../../utils/currency';

interface ExperienceFormState {
  isOpen: boolean;
  editingExp: any | null;
  name: string;
  icon: string;
  description: string;
  featuredImage: string;
  travelStyles: string;
  estimatedBudget: number;
  durationRange: string;
  difficultyLevel: string;
  tags: string;
  featured: boolean;
}

interface ExperienceFormActions {
  setEditingExp: (v: any | null) => void;
  setName: (v: string) => void;
  setIcon: (v: string) => void;
  setDescription: (v: string) => void;
  setFeaturedImage: (v: string) => void;
  setTravelStyles: (v: string) => void;
  setEstimatedBudget: (v: number) => void;
  setDurationRange: (v: string) => void;
  setDifficultyLevel: (v: string) => void;
  setTags: (v: string) => void;
  setFeatured: (v: boolean) => void;
  setOpen: (v: boolean) => void;
}

interface ExperienceFormProps {
  state: ExperienceFormState;
  actions: ExperienceFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ExperienceForm({ state, actions, onSubmit }: ExperienceFormProps) {
  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div onClick={() => actions.setOpen(false)} className="absolute inset-0" />
      <div className="relative w-full sm:max-w-xl bg-warm-white border-l border-border shadow-elevated h-full flex flex-col p-4 sm:p-6 overflow-y-auto overscroll-behavior-contain">
        <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
          <div>
            <h3 className="text-xl font-light font-display lowercase tracking-tight text-gold">
              {state.editingExp ? 'edit experience' : 'new experience'}
            </h3>
            <p className="text-micro text-stone font-mono uppercase tracking-[0.25em] mt-1">experience content model</p>
          </div>
          <button type="button" onClick={() => actions.setOpen(false)} className="w-11 h-11 flex items-center justify-center rounded-full bg-secondary-surface/30 hover:bg-secondary-surface text-stone hover:text-night transition-all cursor-pointer shrink-0 touch-action-manipulation select-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Experience Name *</label>
              <input type="text" required placeholder="e.g. Himalayan Trek" value={state.name} onChange={(e) => actions.setName(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Icon Name *</label>
              <input type="text" required placeholder="e.g. Mountain, Compass" value={state.icon} onChange={(e) => actions.setIcon(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Target Budget (₹ INR)</label>
              <input type="number" value={state.estimatedBudget} onChange={(e) => actions.setEstimatedBudget(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Range</label>
              <input type="text" placeholder="e.g. 3-5 days" value={state.durationRange} onChange={(e) => actions.setDurationRange(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
              <input type="text" placeholder="e.g. Advanced" value={state.difficultyLevel} onChange={(e) => actions.setDifficultyLevel(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Connected Styles (commas)</label>
              <input type="text" placeholder="Adventure, Wildlife" value={state.travelStyles} onChange={(e) => actions.setTravelStyles(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Search Tags (commas)</label>
              <input type="text" placeholder="Winter, Sports" value={state.tags} onChange={(e) => actions.setTags(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Featured Image URL *</label>
            <input type="url" required placeholder="/images/cat-adventure.jpg" value={state.featuredImage} onChange={(e) => actions.setFeaturedImage(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
          </div>

          <div className="space-y-1">
            <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Description</label>
            <textarea rows={4} placeholder="Experience description..." value={state.description} onChange={(e) => actions.setDescription(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="expFeatured" checked={state.featured} onChange={(e) => actions.setFeatured(e.target.checked)} className="w-4 h-4 border border-border rounded bg-white text-gold focus:ring-0 cursor-pointer" />
            <label htmlFor="expFeatured" className="text-xs text-night font-medium select-none cursor-pointer">Feature this experience on the landing page</label>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => actions.setOpen(false)} className="flex-1 py-3.5 rounded-xl bg-white border border-border text-stone hover:bg-secondary-surface/30 text-micro font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center touch-action-manipulation select-none">
              cancel
            </button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gold text-night hover:bg-gold/90 text-micro font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center shadow-md">
              save experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
