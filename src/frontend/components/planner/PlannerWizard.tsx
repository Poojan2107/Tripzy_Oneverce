"use client";
import { useState } from 'react';
import { Sparkles, Compass, CheckCircle2, User, Heart, Users, Search } from 'lucide-react';
import { COMPANION_OPTIONS, DURATION_OPTIONS } from './constants';
import { TOURS_DATA } from '../../data';
import { Tour } from '../../types';

interface PlannerWizardProps {
  step: number;
  mood: string | null;
  travelers: string | null;
  selectedDestination: string | null;
  fromLocation: string;
  energy: string | null;
  duration: string | null;
  customDuration: number;
  customBudgetAmount: number;
  budgetSliderMin: number;
  budgetSliderMax: number;
  notes: string;
  hasStarted: boolean;
  selectedTour: Tour | null | undefined;
  previewPersona: string;
  onMoodChange: (id: string) => void;
  onTravelersChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onFromLocationChange: (val: string) => void;
  onEnergyChange: (id: string) => void;
  onDurationChange: (id: string) => void;
  onBudgetChange: (val: number) => void;
  onNotesChange: (val: string) => void;
  onStart: () => void;
  onNext: () => void;
  onBack: () => void;
  onGenerate: () => void;
}

export default function PlannerWizard({
  travelers, selectedDestination, fromLocation, duration,
  customDuration, notes,
  onTravelersChange, onDestinationChange, onFromLocationChange,
  onDurationChange, onNotesChange, onGenerate,
}: PlannerWizardProps) {
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = async () => {
    if (!selectedDestination || !travelers || !duration) return;
    setGenerating(true);
    await onGenerate();
    setGenerating(false);
  };

  const filteredTours = TOURS_DATA.filter(tour =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFormValid = selectedDestination && travelers && duration;

  const getCompanionIcon = (id: string) => {
    switch (id) {
      case 'solo': return User;
      case 'couple': return Heart;
      case 'family': return Users;
      default: return Compass;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-night pt-24 pb-32 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">AI Travel Companion</span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-night lowercase tracking-tight">
            design your dream journey
          </h1>
          <p className="text-xs text-muted/70 font-light leading-relaxed">
            Let our regional intelligence curate an immersive, day-wise route tailored precisely to your pacing and accompaniment.
          </p>
        </div>

        {/* Main single-page form */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-card space-y-8 text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.01] to-teal/[0.01] pointer-events-none" />

          {/* Grid Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* Left Column: Destination selection & search */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase tracking-wider text-night font-bold">1. Select Destination</label>
                {selectedDestination && (
                  <span className="text-[9px] font-mono text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    selected
                  </span>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/30" />
                <input
                  type="text"
                  placeholder="Search chapters (e.g. Varanasi, Kerala...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/40 bg-background text-xs text-night placeholder:text-muted/30 outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar border border-border/20 rounded-2xl p-2 bg-background/35">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour) => {
                    const isSelected = selectedDestination === tour.id;
                    return (
                      <button
                        key={tour.id}
                        onClick={() => onDestinationChange(tour.id)}
                        className={`group p-2.5 rounded-xl border text-left cursor-pointer flex flex-col justify-between aspect-[4/3] relative overflow-hidden outline-none transition-all duration-300 ${
                          isSelected
                            ? 'border-gold shadow-[0_0_15px_rgba(244,182,61,0.25)]'
                            : 'border-border/30 hover:border-border/80'
                        }`}
                      >
                        <img
                          src={tour.bannerImage}
                          alt={tour.title}
                          loading="lazy"
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                            isSelected ? 'opacity-45' : 'opacity-25'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/35 to-transparent z-0" />
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 bg-gold text-night rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        
                        <div className="relative z-10 w-full mt-auto text-left">
                          <span className="text-[6.5px] font-mono uppercase tracking-wider text-gold block mb-0.5">{tour.chapterName || 'Chapter'}</span>
                          <span className="text-[9.5px] font-bold text-white block truncate">{tour.title}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center text-xs text-muted/50 font-light">
                    No matching chapters found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Companion, Duration & Custom Prompt */}
            <div className="space-y-6">
              
              {/* Accompaniment selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-night font-bold block">2. Who are you traveling with?</label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANION_OPTIONS.map((opt) => {
                    const Icon = getCompanionIcon(opt.id);
                    const isSelected = travelers === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onTravelersChange(opt.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-3 outline-none transition-all duration-300 ${
                          isSelected
                            ? 'bg-secondary-surface border-gold text-night shadow-sm'
                            : 'bg-background/40 border-border/40 text-muted hover:bg-background/80 hover:border-border'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isSelected ? 'bg-gold text-night scale-105' : 'bg-secondary-surface text-muted/50'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className={`text-[10.5px] font-bold block ${isSelected ? 'text-night' : 'text-muted/80'}`}>{opt.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-night font-bold block">3. Duration of stay</label>
                <div className="grid grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = duration === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onDurationChange(opt.id)}
                        className={`py-2 px-1 rounded-xl border text-center cursor-pointer flex flex-col justify-center items-center outline-none transition-all duration-300 min-h-[54px] ${
                          isSelected
                            ? 'bg-secondary-surface border-gold text-night shadow-sm'
                            : 'bg-background/40 border-border/40 text-muted hover:bg-background/80 hover:border-border'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-night' : 'text-muted/80'}`}>{opt.days} Days</span>
                        <span className="text-[7.5px] text-muted/50 font-mono uppercase tracking-wider mt-0.5">{opt.id === 'weekend' ? '2-3d' : opt.id === 'short' ? '4-6d' : opt.id === 'week' ? '1wk' : '2wk'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* From Location (Optional) */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-night font-bold block">Departing From (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  value={fromLocation}
                  onChange={(e) => onFromLocationChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/40 bg-background text-xs text-night placeholder:text-muted/30 outline-none focus:border-teal transition-all font-sans"
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-border/40 my-6 z-10 relative" />

          {/* Full-width Prompt text area */}
          <div className="space-y-3 z-10 relative">
            <label className="text-[10px] font-mono uppercase tracking-wider text-night font-bold block">
              4. Describe your dream journey
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Describe what you want to seek... e.g. I want to experience sunset ghat ceremonies, visit ancient weaving guilds, try local street foods, and capture sunrise vistas, keeping the itinerary relaxed and photogenic."
              className="w-full p-4 rounded-2xl border border-border/40 bg-background text-xs text-night placeholder:text-muted/30 outline-none focus:border-teal transition-all font-sans resize-none leading-relaxed"
            />
          </div>

          {/* CTA Area */}
          <div className="pt-4 flex flex-col items-center justify-center space-y-4 z-10 relative">
            <button
              onClick={handleGenerate}
              disabled={!isFormValid || generating}
              className={`px-8 py-3.5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-md transition-all duration-300 inline-flex items-center gap-2 cursor-pointer border-none min-h-[46px] ${
                isFormValid && !generating
                  ? 'bg-night text-white hover:bg-gold hover:text-night hover:scale-102 shadow-lg'
                  : 'bg-secondary-surface text-muted/40 cursor-not-allowed'
              }`}
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-muted/30 border-t-gold animate-spin" />
                  <span>Consulting Archives...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Craft Journey</span>
                </>
              )}
            </button>

            {!isFormValid && (
              <span className="text-[8.5px] font-mono text-muted/50 uppercase tracking-wider">
                Select destination, accompaniment, and duration to unlock crafting
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}