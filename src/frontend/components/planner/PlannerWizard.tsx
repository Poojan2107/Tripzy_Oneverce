"use client";
import { Sparkles, ArrowLeft, ArrowRight, User, Users, Heart, Mountain, Waves, BookOpen, Compass, MapPin, Calendar, CheckCircle2, Sun, Zap, Star } from 'lucide-react';
import { WIZARD_STYLE_OPTIONS, COMPANION_OPTIONS, ENERGY_OPTIONS, DURATION_OPTIONS, PLANNER_STEPS } from './constants';
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
  step, mood, travelers, selectedDestination, fromLocation, energy, duration,
  customDuration, customBudgetAmount, budgetSliderMin, budgetSliderMax, notes,
  hasStarted, selectedTour, previewPersona,
  onMoodChange, onTravelersChange, onDestinationChange, onFromLocationChange,
  onEnergyChange, onDurationChange, onBudgetChange, onNotesChange,
  onStart, onNext, onBack, onGenerate,
}: PlannerWizardProps) {
  const totalSteps = 5;
  const handleDurationSelect = (id: string) => {
    onDurationChange(id);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return mood !== null;
      case 2: return travelers !== null && selectedDestination !== null;
      case 3: return energy !== null;
      case 4: return duration !== null;
      case 5: return true;
      default: return false;
    }
  };

  const getDestinationPrettyName = (destId: string | null | undefined): string => {
    if (!destId) return 'Curated Destination';
    const staticTour = TOURS_DATA.find(t => t.id === destId || t.dbId === destId);
    if (staticTour) return staticTour.title;
    if (destId && destId.includes('-')) {
      const part = destId.split('-')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return destId || 'Unknown';
  };

  if (!hasStarted) {
    return (
      <div className="min-h-[100dvh] bg-[#081A24] text-white pt-28 pb-32 px-6 flex items-center justify-center select-none text-center">
        <div className="max-w-md w-full bg-[#0C2533] border border-white/10 p-8 rounded-[32px] shadow-elevated space-y-6 text-center paper-grain">
          <div className="w-16 h-16 bg-ocean/10 border border-ocean/30 text-ocean rounded-2xl flex items-center justify-center mx-auto shadow-inner hover:rotate-2 transition-transform duration-300">
            <Sparkles className="w-8 h-8 text-ocean animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gold block mb-2 font-bold">journey planner</span>
            <h2 className="font-display text-3xl font-light text-white lowercase">no itinerary generated yet</h2>
            <p className="text-[11px] text-[#8FA0AB] font-light leading-relaxed mt-2.5 font-sans max-w-xs mx-auto">
              Unleash the full potential of Tripzy's custom algorithms. Calibrate duration, travel style, regional chapters, and budget caps to compile your bespoke Indian companion journal.
            </p>
          </div>
          <button
            onClick={onStart}
            className="w-full py-3.5 bg-gold text-[#0B1720] text-[10px] font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-gold/90 transition-all duration-300 cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5 min-h-[46px] hover:scale-102 border-none font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#0B1720]" />
            <span>Begin AI Planning</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#081A24] text-white pt-24 pb-32 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
        <div className="w-full lg:w-72 shrink-0 space-y-6 text-left">
          <div className="border-b border-white/5 pb-4 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#E6355A] font-bold block mb-1">AI Journey Planner</span>
            <h2 className="font-display text-3xl font-light text-white lowercase">craft your odyssey</h2>
          </div>

          <div className="relative pl-6 space-y-8 border-l border-white/10">
            {PLANNER_STEPS.map((s) => {
              const isCurrent = step === s.step;
              const isDone = step > s.step;
              return (
                <div key={s.step} className="relative flex flex-col items-start text-left">
                  <div className={`absolute -left-[32px] w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-[#148596] text-white border-[#148596] shadow-[0_0_12px_rgba(20,133,150,0.6)] scale-110'
                      : isDone
                        ? 'bg-gold text-[#0B1720] border-gold font-bold shadow-[0_0_8px_rgba(253,182,47,0.3)]'
                        : 'bg-[#081A24] text-white/30 border-white/10'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1720] stroke-[3]" />
                    ) : (
                      s.step
                    )}
                  </div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isCurrent ? 'text-white' : isDone ? 'text-gold' : 'text-white/30'}`}>{s.title}</h4>
                  <p className={`text-[10px] font-light mt-0.5 transition-colors duration-300 ${isCurrent ? 'text-white/70' : isDone ? 'text-white/50' : 'text-white/20'}`}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl bg-[#0C2533] border border-white/10 rounded-3xl p-6 md:p-8 text-left shadow-elevated">
          {step === 1 && (
            <div className="space-y-6 animate-page-enter">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#E6355A] font-bold block mb-1">Step 1 of 5</span>
                <h3 className="font-display text-3xl text-white font-light lowercase">what kind of traveler are you?</h3>
                <p className="text-xs text-white/50 font-light font-sans mt-1">Select the archetype that best matches your travel desires.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WIZARD_STYLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = mood === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onMoodChange(opt.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-4 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                        isSelected
                          ? 'bg-[#081A24] shadow-md border-transparent'
                          : 'bg-[#081A24]/60 border-white/5 hover:border-white/15 hover:bg-[#081A24]'
                      }`}
                      style={{
                        borderColor: isSelected ? opt.color : undefined,
                        boxShadow: isSelected ? `0 0 20px ${opt.color}40, inset 0 0 0 1px ${opt.color}40` : undefined
                      }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} style={{ backgroundColor: `${opt.color}15`, color: opt.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-white">{opt.label}</h4>
                        <p className="text-[10px] text-white/40 mt-1 leading-relaxed font-sans">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-page-enter">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#E6355A] font-bold block mb-1">Step 2 of 5</span>
                <h3 className="font-display text-3xl text-white font-light lowercase">your companion & route</h3>
                <p className="text-xs text-white/50 font-light font-sans mt-1">Tell us who is traveling, and select the regional chapter in India you'd like to explore.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block">Departing From</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => onFromLocationChange(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bangalore..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#081A24] text-white placeholder:text-white/20 outline-none focus:border-[#148596] focus:ring-1 focus:ring-[#148596] focus:shadow-[0_0_10px_rgba(20,133,150,0.2)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block">Travel Companion</label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANION_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = travelers === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onTravelersChange(opt.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                          isSelected
                            ? 'bg-[#081A24] border-[#148596] text-white shadow-[0_0_12px_rgba(20,133,150,0.25)]'
                            : 'bg-[#081A24]/60 border-white/5 text-white/60 hover:border-white/15 hover:bg-[#081A24]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isSelected ? 'bg-[#148596]/15 text-[#148596] scale-110' : 'bg-white/5 text-white/40'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold block transition-colors ${isSelected ? 'text-white' : 'text-white/80'}`}>{opt.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block">Choose Destination</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {TOURS_DATA.map((tour) => {
                    const isSelected = selectedDestination === tour.id;
                    return (
                      <button
                        key={tour.id}
                        onClick={() => onDestinationChange(tour.id)}
                        className={`group p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between aspect-[4/3] relative overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                          isSelected
                            ? 'border-gold shadow-[0_0_15px_rgba(253,182,47,0.25)] scale-[1.02]'
                            : 'border-white/5 hover:border-white/15 hover:scale-[1.01]'
                        }`}
                      >
                        <img
                          src={tour.bannerImage}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                            isSelected ? 'opacity-40' : 'opacity-20'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 bg-gold text-[#0B1720] rounded-full p-0.5 shadow-sm animate-stamp-slam">
                            <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="relative z-10 w-full mt-auto text-left">
                          <span className="text-[7px] font-mono uppercase tracking-wider text-gold block mb-0.5">{tour.chapterName || 'Chapter'}</span>
                          <span className="text-[9px] font-bold text-white block truncate">{tour.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-page-enter">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#E6355A] font-bold block mb-1">Step 3 of 5</span>
                <h3 className="font-display text-3xl text-white font-light lowercase">your pacing & interests</h3>
                <p className="text-xs text-white/50 font-light font-sans mt-1">Choose how active and focused your daily itinerary should be.</p>
              </div>
              <div className="space-y-3">
                {ENERGY_OPTIONS.map((opt) => {
                  const isSelected = energy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onEnergyChange(opt.id)}
                      className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex justify-between items-center hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                        isSelected
                          ? 'bg-[#081A24] border-[#148596] text-white shadow-[0_0_15px_rgba(20,133,150,0.15)]'
                          : 'bg-[#081A24]/60 border-white/5 text-white/70 hover:border-[#148596]/40 hover:bg-[#081A24]'
                      }`}
                    >
                      <div>
                        <span className={`text-xs font-bold block transition-colors ${isSelected ? 'text-white' : 'text-white/80'}`}>{opt.label}</span>
                        <span className="text-[10px] text-white/40 block mt-0.5 leading-relaxed font-sans font-light">{opt.desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-[#148596]/15 text-[#148596]' : 'border border-white/10 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-page-enter">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#E6355A] font-bold block mb-1">Step 4 of 5</span>
                <h3 className="font-display text-3xl text-white font-light lowercase">budget & duration</h3>
                <p className="text-xs text-white/50 font-light font-sans mt-1">Set the duration and allocate a budget matching your preferences.</p>
              </div>

              <div className="space-y-2.5">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block">Duration of Stay</label>
                <div className="grid grid-cols-2 gap-3">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = duration === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleDurationSelect(opt.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#148596] outline-none ${
                          isSelected
                            ? 'bg-[#081A24] border-[#148596] text-white shadow-[0_0_12px_rgba(20,133,150,0.25)]'
                            : 'bg-[#081A24]/60 border-white/5 text-white/60 hover:border-white/15 hover:bg-[#081A24]'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{opt.label}</span>
                        <span className="text-[9px] text-white/40 mt-1 font-sans font-light">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedTour && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-white/60">
                    <span>Estimated Budget limit</span>
                    <span className="text-gold font-bold text-xs">₹{customBudgetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={budgetSliderMin}
                    max={budgetSliderMax}
                    step={500}
                    value={customBudgetAmount}
                    onChange={(e) => onBudgetChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#148596]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">
                    <span>Min: ₹{budgetSliderMin.toLocaleString('en-IN')}</span>
                    <span>Max: ₹{budgetSliderMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-page-enter">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#E6355A] font-bold block mb-1">Step 5 of 5</span>
                <h3 className="font-display text-3xl text-white font-light lowercase">ready for liftoff</h3>
                <p className="text-xs text-white/50 font-light font-sans mt-1">Review your selections, add any special requests or notes, and let the AI generate your custom itinerary.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/50 block">Special Requests / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="e.g. Vegetarian food options only, photography spots prioritized, wheelchair accessibility needed..."
                  className="w-full min-h-[120px] p-4 text-xs text-white placeholder:text-white/20 border border-white/10 bg-[#081A24] rounded-2xl focus:border-[#148596] outline-none resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="bg-[#081A24] border border-white/5 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-white/40">
                  <span>Journey profile</span>
                  <span>ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Destination:</span>
                  <span className="font-bold text-white">{getDestinationPrettyName(selectedDestination)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Style & Companion:</span>
                  <span className="font-bold text-white">{previewPersona}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span className="font-bold text-white">{customDuration} days</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between gap-4">
            <button
              onClick={onBack}
              disabled={step === 1}
              className="px-5 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none min-h-[44px] flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <button
              onClick={step === totalSteps ? onGenerate : onNext}
              disabled={!canProceed()}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#148596] to-[#286F98] hover:from-[#1c9cb0] hover:to-[#3185b5] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-white font-bold uppercase tracking-wider min-h-[44px] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-[10px] shadow-[0_4px_12px_rgba(20,133,150,0.2)] hover:shadow-[0_4px_16px_rgba(20,133,150,0.35)]"
            >
              {step === totalSteps ? 'Generate Odyssey' : 'Next Step'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
