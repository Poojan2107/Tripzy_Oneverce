"use client";
import { useState } from 'react';
import { Sparkles, Compass, CheckCircle2, User, Heart, Users, Search, ArrowLeft, ArrowRight, IndianRupee } from 'lucide-react';
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
  onCustomDurationChange?: (days: number) => void;
  onStart: () => void;
  onNext: () => void;
  onBack: () => void;
  onGenerate: () => void;
}

const WIZARD_STEPS = [
  { num: 1, label: 'Destination', desc: 'Choose your chapter' },
  { num: 2, label: 'Travel Style', desc: 'Companion, budget & duration' },
  { num: 3, label: 'Your Notes', desc: 'Final touches' },
];

function formatBudget(val: number): string {
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
  return `₹${val}`;
}

export default function PlannerWizard({
  travelers, selectedDestination, fromLocation, duration,
  customDuration, customBudgetAmount, budgetSliderMin, budgetSliderMax,
  notes, previewPersona,
  onTravelersChange, onDestinationChange, onFromLocationChange,
  onDurationChange, onBudgetChange, onNotesChange, onGenerate,
  onCustomDurationChange,
  onStart,
}: PlannerWizardProps) {
  const [wizardStep, setWizardStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState(customDuration);

  const handleNext = () => {
    if (wizardStep < 3) setWizardStep(s => s + 1);
  };

  const handleBack = () => {
    if (wizardStep > 1) setWizardStep(s => s - 1);
  };

  const handleGenerate = () => {
    if (!selectedDestination || !travelers || !duration) return;
    setGenerating(true);
    // Fire-and-forget: parent sets loading=true which unmounts this wizard immediately.
    // Do NOT await — awaiting across an unmount breaks the async context.
    onGenerate();
  };

  const handleCustomDurationClick = () => {
    setShowCustomDuration(true);
    setCustomDaysInput(customDuration || 5);
    onDurationChange('custom');
  };

  const handleCustomDaysConfirm = () => {
    const days = Math.max(1, Math.min(30, customDaysInput || 1));
    setCustomDaysInput(days);
    onCustomDurationChange?.(days);
  };

  const filteredTours = TOURS_DATA.filter(tour =>
    (tour.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tour.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isStep1Valid = !!selectedDestination;
  const isStep2Valid = !!travelers && !!duration;
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
    <div className="min-h-[100dvh] bg-background text-night pt-24 pb-[calc(var(--nav-bottom-height)+2rem)] md:pb-32 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Block */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-meta font-mono text-gold block mb-1">AI Travel Companion</span>
          <h1 className="font-display text-heading text-night lowercase font-light tracking-tight">
            design your dream journey
          </h1>
          <p className="text-body text-muted/80 font-light leading-relaxed">
            Let our regional intelligence curate an immersive, day-wise route tailored precisely to your pacing and accompaniment.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    wizardStep === s.num ? 'bg-gold text-night shadow-md scale-110' :
                    wizardStep > s.num ? 'bg-teal text-white' :
                    'bg-secondary-surface text-muted/50 border border-border/40'
                  }`}>
                    {wizardStep > s.num ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span className={`text-micro font-mono mt-1.5 transition-colors duration-300 ${
                    wizardStep >= s.num ? 'text-night font-bold' : 'text-muted/40'
                  }`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-px mx-3 mt-[-1.5rem] transition-colors duration-300 ${
                    wizardStep > s.num ? 'bg-teal' : 'bg-border/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-surface border border-border/70 rounded-2xl p-8 sm:p-12 shadow-md text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.01] to-teal/[0.01] pointer-events-none" />

          {/* Step 1: Destination */}
          {wizardStep === 1 && (
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-meta font-mono text-night font-bold uppercase tracking-wider">Choose Your Destination</label>
                {selectedDestination && (
                  <span className="text-meta font-mono text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-sm uppercase font-bold">
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/60 bg-background text-body text-night placeholder:text-muted/35 outline-none focus:border-teal/60 focus:shadow-[0_0_12px_rgba(24,182,201,0.1)] transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar border border-border/15 rounded-xl p-3 bg-background/35">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour) => {
                    const isSelected = selectedDestination === tour.id;
                    return (
                      <button
                        key={tour.id}
                        onClick={() => onDestinationChange(tour.id)}
                        className={`group p-3 text-left cursor-pointer flex flex-col justify-between aspect-[4/3] relative overflow-hidden rounded-xl border outline-none transition-all duration-300 ${
                          isSelected
                            ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(244,182,61,0.25)]'
                            : 'border-border/30 hover:border-gold/50 bg-surface'
                        }`}
                      >
                        <img
                          src={tour.bannerImage}
                          alt={tour.title}
                          loading="lazy"
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                            isSelected ? 'opacity-80' : 'opacity-60'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent z-0" />
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 z-10 bg-gold text-night rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="relative z-10 w-full mt-auto text-left">
                          <span className="text-meta font-mono text-gold block mb-0.5">{tour.chapterName || 'Chapter'}</span>
                          <span className="text-body font-bold text-white block truncate">{tour.title}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center text-meta text-muted/50 font-light">
                    No matching chapters found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Companion + Budget + Duration */}
          {wizardStep === 2 && (
            <div className="space-y-7 relative z-10">
              {/* Companion */}
              <div className="space-y-4">
                <label className="text-meta font-mono text-night font-bold block uppercase tracking-wider">Who are you traveling with?</label>
                <div className="grid grid-cols-2 gap-4">
                  {COMPANION_OPTIONS.map((opt) => {
                    const Icon = getCompanionIcon(opt.id);
                    const isSelected = travelers === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onTravelersChange(opt.id)}
                        className={`btn-ghost p-4 rounded-xl text-left cursor-pointer flex items-center gap-3.5 outline-none border transition-all duration-300 ${
                          isSelected
                            ? 'bg-secondary-surface border-gold text-night shadow-sm'
                            : 'bg-background/40 border-border/40 text-muted hover:bg-background/80 hover:border-border'
                        }`}
                      >
                        <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isSelected ? 'bg-gold text-night scale-105' : 'bg-secondary-surface text-muted/50'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`text-body font-semibold block ${isSelected ? 'text-night font-bold' : 'text-muted/80'}`}>{opt.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-meta font-mono text-night font-bold block uppercase tracking-wider">Budget Per Day</label>
                  <span className="text-body font-bold text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-md">
                    {formatBudget(customBudgetAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <IndianRupee className="w-4.5 h-4.5 text-muted/40 shrink-0" />
                  <input
                    type="range"
                    min={budgetSliderMin}
                    max={Math.max(budgetSliderMax, 200000)}
                    step={1000}
                    value={customBudgetAmount}
                    onChange={(e) => onBudgetChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-border/40 rounded-full appearance-none cursor-pointer accent-gold [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <IndianRupee className="w-4.5 h-4.5 text-muted/40 shrink-0" />
                </div>
                <div className="flex justify-between text-micro font-mono text-muted/50 mt-1.5">
                  <span>{formatBudget(budgetSliderMin)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${customBudgetAmount <= 15000 ? 'bg-teal/10 border-teal/30 text-teal' : customBudgetAmount <= 40000 ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-coral/10 border-coral/30 text-coral'}`}>
                    {customBudgetAmount <= 15000 ? 'Budget' : customBudgetAmount <= 40000 ? 'Comfort' : 'Luxury'}
                  </span>
                  <span>{formatBudget(Math.max(budgetSliderMax, 200000))}</span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <label className="text-meta font-mono text-night font-bold block uppercase tracking-wider">Duration of stay</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = duration === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => { setShowCustomDuration(false); onDurationChange(opt.id); }}
                        className={`btn-ghost py-2.5 px-2 rounded-xl text-center cursor-pointer flex flex-col justify-center items-center outline-none min-h-[58px] border transition-all duration-300 ${
                          isSelected
                            ? 'bg-secondary-surface border-gold text-night shadow-sm'
                            : 'bg-background/40 border-border/40 text-muted hover:bg-background/80 hover:border-border'
                        }`}
                      >
                        <span className={`text-body font-semibold ${isSelected ? 'text-night font-bold' : 'text-muted/80'}`}>{opt.days} Days</span>
                        <span className="text-meta text-muted/50 font-mono uppercase mt-0.5">{opt.id === 'weekend' ? '2-3d' : opt.id === 'short' ? '4-6d' : opt.id === 'week' ? '1wk' : '2wk'}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleCustomDurationClick}
                    className={`btn-ghost py-2.5 px-2 rounded-xl text-center cursor-pointer flex flex-col justify-center items-center outline-none min-h-[58px] border transition-all duration-300 ${
                      showCustomDuration || duration === 'custom'
                        ? 'bg-secondary-surface border-gold text-night shadow-sm'
                        : 'bg-background/40 border-border/40 text-muted hover:bg-background/80 hover:border-border'
                    }`}
                  >
                    <span className="text-body font-semibold">Custom</span>
                    <span className="text-meta text-muted/50 font-mono uppercase mt-0.5">flexible</span>
                  </button>
                </div>
                {showCustomDuration && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-meta font-mono text-muted">Days:</span>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={customDaysInput}
                      onChange={(e) => setCustomDaysInput(parseInt(e.target.value) || 1)}
                      onBlur={handleCustomDaysConfirm}
                      className="w-20 px-3 py-2 rounded-md border border-border/40 bg-background text-body text-night text-center outline-none focus:border-teal transition-all font-sans"
                    />
                    <span className="text-meta font-mono text-muted">(max 30)</span>
                    <button
                      onClick={handleCustomDaysConfirm}
                      className="btn-ghost px-4 py-2 text-meta font-mono font-bold text-teal border border-teal/30 rounded-md cursor-pointer hover:bg-teal/10"
                    >
                      Set
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Notes + Departing From */}
          {wizardStep === 3 && (
            <div className="space-y-6 relative z-10">
              <div className="space-y-2.5">
                <label className="text-meta font-mono text-night font-bold block uppercase tracking-wider">Departing From (Optional)</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  value={fromLocation}
                  onChange={(e) => onFromLocationChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border/60 bg-background text-body text-night placeholder:text-muted/35 outline-none focus:border-teal transition-all font-sans"
                />
              </div>

              <div className="space-y-3">
                <label className="text-meta font-mono text-night font-bold block uppercase tracking-wider">
                  Describe your dream journey
                </label>
                <textarea
                  rows={5}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="Describe what you want to seek... e.g. I want to experience sunset ghat ceremonies, visit ancient weaving guilds, try local street foods, and capture sunrise vistas, keeping the itinerary relaxed and photogenic."
                  className="w-full p-4 rounded-lg border border-border/60 bg-background text-body text-night placeholder:text-muted/35 outline-none focus:border-teal transition-all font-sans resize-none leading-relaxed"
                />
              </div>

              {/* Preview */}
              <div className="bg-background/60 border border-border/20 rounded-xl p-5 space-y-1.5">
                <span className="text-micro font-mono text-gold block uppercase tracking-wider font-bold">Journey Preview</span>
                <p className="text-body text-night/85 font-light leading-relaxed">{previewPersona}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 z-10 relative border-t border-border/10 mt-6">
            <div>
              {wizardStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="btn-ghost h-11 px-5 rounded-lg text-caption font-bold text-muted hover:text-night flex items-center gap-1.5 cursor-pointer border border-border/30 transition-all duration-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : <div />}
            </div>

            {wizardStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={wizardStep === 1 ? !isStep1Valid : !isStep2Valid}
                className={`btn h-11 px-6 rounded-lg text-caption inline-flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                  (wizardStep === 1 ? isStep1Valid : isStep2Valid)
                    ? 'btn-night text-white shadow-md'
                    : 'bg-secondary-surface text-muted/30 cursor-not-allowed border border-border/10'
                }`}
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!isFormValid || generating}
                className={`btn h-12 px-7 rounded-lg text-caption inline-flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                  isFormValid && !generating
                    ? 'btn-night text-white hover:bg-gold hover:text-night shadow-[0_0_24px_rgba(244,182,61,0.25)]'
                    : 'bg-secondary-surface text-muted/30 cursor-not-allowed border border-border/10'
                }`}
              >
                {generating ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-muted/30 border-t-gold animate-spin" />
                    <span>Consulting Archives...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    <span>Craft Journey</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}