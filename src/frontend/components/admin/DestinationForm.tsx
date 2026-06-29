import React from 'react';
import { X } from 'lucide-react';
import { Tour } from '../../types';

interface DestinationFormState {
  isOpen: boolean;
  editingDest: Tour | null;
  name: string;
  country: string;
  city: string;
  region: string;
  description: string;
  price: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  groupSize: string;
  featured: boolean;
  trending: boolean;
  latitude: number;
  longitude: number;
  adventureScore: number;
  culturalScore: number;
  luxuryScore: number;
  familyScore: number;
  bestMonths: string;
  travelStyles: string;
  activities: string;
  tags: string;
  bannerImage: string;
}

interface DestinationFormActions {
  setEditingDest: (tour: Tour | null) => void;
  setName: (v: string) => void;
  setCountry: (v: string) => void;
  setCity: (v: string) => void;
  setRegion: (v: string) => void;
  setDescription: (v: string) => void;
  setPrice: (v: number) => void;
  setDuration: (v: string) => void;
  setDifficulty: (v: 'Easy' | 'Moderate' | 'Challenging' | 'Expert') => void;
  setGroupSize: (v: string) => void;
  setFeatured: (v: boolean) => void;
  setTrending: (v: boolean) => void;
  setLatitude: (v: number) => void;
  setLongitude: (v: number) => void;
  setAdventureScore: (v: number) => void;
  setCulturalScore: (v: number) => void;
  setLuxuryScore: (v: number) => void;
  setFamilyScore: (v: number) => void;
  setBestMonths: (v: string) => void;
  setTravelStyles: (v: string) => void;
  setActivities: (v: string) => void;
  setTags: (v: string) => void;
  setBannerImage: (v: string) => void;
  setOpen: (v: boolean) => void;
}

interface DestinationFormProps {
  state: DestinationFormState;
  actions: DestinationFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export default function DestinationForm({ state, actions, onSubmit }: DestinationFormProps) {
  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div onClick={() => actions.setOpen(false)} className="absolute inset-0" />
      <div className="relative w-full sm:max-w-2xl bg-warm-white border-l border-border shadow-elevated h-full flex flex-col p-4 sm:p-6 overflow-y-auto overscroll-behavior-contain">
        <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
          <div>
            <h3 className="text-xl font-light font-display lowercase tracking-tight text-gold">
              {state.editingDest ? 'edit destination' : 'new destination'}
            </h3>
            <p className="text-[10px] text-stone font-mono uppercase tracking-[0.25em] mt-1">destination content model</p>
          </div>
          <button onClick={() => actions.setOpen(false)} className="w-11 h-11 flex items-center justify-center rounded-full bg-cream/30 hover:bg-cream text-stone hover:text-night transition-all cursor-pointer shrink-0 touch-action-manipulation select-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5 flex-1 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Destination Name *</label>
              <input type="text" required placeholder="e.g. Varanasi" value={state.name} onChange={(e) => actions.setName(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Region / Category</label>
              <input type="text" placeholder="e.g. South Asia" value={state.region} onChange={(e) => actions.setRegion(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">City *</label>
              <input type="text" required placeholder="e.g. Varanasi" value={state.city} onChange={(e) => actions.setCity(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Country *</label>
              <input type="text" required placeholder="e.g. India" value={state.country} onChange={(e) => actions.setCountry(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Budget (₹ INR) *</label>
              <input type="number" required value={state.price} onChange={(e) => actions.setPrice(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Guide</label>
              <input type="text" value={state.duration} onChange={(e) => actions.setDuration(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
              <select value={state.difficulty} onChange={(e) => actions.setDifficulty(e.target.value as any)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors appearance-none">
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Latitude *</label>
              <input type="number" step="0.000001" required value={state.latitude} onChange={(e) => actions.setLatitude(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Longitude *</label>
              <input type="number" step="0.000001" required value={state.longitude} onChange={(e) => actions.setLongitude(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="p-4 bg-cream/30 rounded-2xl border border-border space-y-4">
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.25em] block">Scores (0-100)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Adventure', value: state.adventureScore, setter: actions.setAdventureScore },
                { label: 'Culture', value: state.culturalScore, setter: actions.setCulturalScore },
                { label: 'Luxury', value: state.luxuryScore, setter: actions.setLuxuryScore },
                { label: 'Family', value: state.familyScore, setter: actions.setFamilyScore },
              ].map(field => (
                <div key={field.label} className="space-y-1">
                  <label className="text-[9px] font-medium text-stone">{field.label}</label>
                  <input type="number" min="0" max="100" value={field.value} onChange={(e) => field.setter(Number(e.target.value))} className="w-full px-3 py-3 sm:py-2 bg-white border border-border rounded-lg text-xs text-night text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Best Months (commas)</label>
              <input type="text" value={state.bestMonths} onChange={(e) => actions.setBestMonths(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Travel Styles (commas)</label>
              <input type="text" value={state.travelStyles} onChange={(e) => actions.setTravelStyles(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Activities (commas)</label>
              <input type="text" value={state.activities} onChange={(e) => actions.setActivities(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Tags (commas)</label>
              <input type="text" value={state.tags} onChange={(e) => actions.setTags(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Banner Image URL *</label>
            <input type="url" required placeholder="/images/tours/varanasi-banner.jpg" value={state.bannerImage} onChange={(e) => actions.setBannerImage(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Description *</label>
            <textarea required rows={4} placeholder="Destination description..." value={state.description} onChange={(e) => actions.setDescription(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { actions.setFeatured(!state.featured); if (state.featured) actions.setTrending(false); }} className={`flex-1 py-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-[0.18em] text-center transition-all cursor-pointer touch-action-manipulation select-none ${state.featured ? 'bg-ocean/10 border-ocean text-ocean' : 'bg-white border-border text-stone'}`}>
              featured
            </button>
            <button type="button" onClick={() => { actions.setTrending(!state.trending); if (state.trending) actions.setFeatured(false); }} className={`flex-1 py-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-[0.18em] text-center transition-all cursor-pointer touch-action-manipulation select-none ${state.trending ? 'bg-gold/10 border-gold text-gold' : 'bg-white border-border text-stone'}`}>
              trending
            </button>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => actions.setOpen(false)} className="flex-1 py-3.5 rounded-xl bg-white border border-border text-stone hover:bg-cream/30 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center touch-action-manipulation select-none">
              cancel
            </button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gold text-night hover:bg-gold/90 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center shadow-md">
              save destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
