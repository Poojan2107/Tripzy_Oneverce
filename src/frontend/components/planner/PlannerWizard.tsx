"use client";
import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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

const stepVariants = {
  initial: { opacity: 0, x: 40, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 } },
  exit: { opacity: 0, x: -40, scale: 0.97, transition: { duration: 0.15 } },
};

const optionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => {
    const transition = { delay: i * 0.04, type: "spring" as const, stiffness: 100, damping: 20 };
    return { opacity: 1, y: 0, transition };
  },
};

function StepOption({ children, selected, onClick, className, custom, style, ...rest }: { children: React.ReactNode; selected: boolean; onClick: () => void; className?: string; custom?: number; style?: React.CSSProperties }) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      variants={optionVariants}
      custom={custom}
      style={style}
      {...rest}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
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
  const [generating, setGenerating] = useState(false);
  const handleDurationSelect = (id: string) => { onDurationChange(id); };

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

  const handleGenerate = async () => {
    setGenerating(true);
    await onGenerate();
    setGenerating(false);
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
      <div className="min-h-[100dvh] bg-background text-night pt-28 pb-32 px-6 flex items-center justify-center select-none text-center">
        <motion.div
          className="max-w-md w-full bg-surface border border-border p-8 rounded-3xl shadow-card space-y-6 text-center"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <motion.div
            className="w-16 h-16 bg-teal/10 border border-teal/20 text-teal rounded-2xl flex items-center justify-center mx-auto shadow-inner"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-teal" />
          </motion.div>
          <div>
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gold block mb-2 font-bold">journey guide</span>
            <h2 className="font-display text-3xl font-light text-night lowercase">no journey crafted yet</h2>
            <p className="text-[11px] text-muted/65 font-light leading-relaxed mt-2.5 font-sans max-w-xs mx-auto">
              Your travel companion is ready. Tell us about your story preferences — travel style, destination chapters, and pace — to craft a custom journey.
            </p>
          </div>
          <motion.button
            onClick={onStart}
            className="w-full py-3.5 bg-gold text-night text-[10px] font-bold uppercase tracking-[0.18em] rounded-xl cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5 min-h-[46px] border-none"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Sparkles className="w-4 h-4 text-night" />
            <span>Start Your Journey</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const activeCompanionRec = () => {
    if (!mood) return 'Select a traveler style to receive a companion guide recommendation.';
    if (mood === 'Spiritual' || mood === 'Culture') {
      return 'highly recommend sunrise ghat boat row and ancient temple walks.';
    }
    if (mood === 'Nature' || mood === 'Relaxation') {
      return 'highly recommend slow lagoon drift and spice walk.';
    }
    return 'recommend active desert safari and high altitude pass view.';
  };

  return (
    <div className="min-h-[100dvh] bg-background text-night pt-24 pb-32 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start justify-center">
        {/* Left Column: AI Companion Panel */}
        <div className="w-full lg:w-80 shrink-0 space-y-6 text-left lg:sticky lg:top-24">
          <div className="border-b border-border pb-4 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-coral font-bold block mb-1">Journey Companion</span>
            <h2 className="font-display text-3xl font-light text-night lowercase leading-none">craft your odyssey</h2>
          </div>

          <div className="relative pl-6 space-y-5 border-l border-border/80">
            {PLANNER_STEPS.map((s) => {
              const isCurrent = step === s.step;
              const isDone = step > s.step;
              return (
                <motion.div
                  key={s.step}
                  className="relative flex flex-col items-start text-left"
                  animate={isCurrent ? { x: 4 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <motion.div
                    className={`absolute -left-[32px] w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors duration-300 border ${
                      isCurrent
                        ? 'bg-teal text-white border-teal shadow-[0_0_12px_rgba(24,182,201,0.4)]'
                        : isDone
                          ? 'bg-gold text-night border-gold shadow-[0_0_8px_rgba(244,182,61,0.3)]'
                          : 'bg-background text-muted/40 border-border'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-night stroke-[3]" />
                    ) : (
                      s.step
                    )}
                  </motion.div>
                  <h4 className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isCurrent ? 'text-night' : isDone ? 'text-gold' : 'text-muted/45'}`}>{s.title}</h4>
                  <p className={`text-[9px] font-light mt-0.5 transition-colors duration-300 ${isCurrent ? 'text-muted/70' : isDone ? 'text-muted/50' : 'text-muted/30'}`}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Persistent Companion Card */}
          <div className="bg-surface border border-border rounded-3xl p-5 shadow-card space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-border">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-night font-bold">journey companion</span>
            </div>
            
            <div className="space-y-2.5 text-[11px] font-sans">
              <div className="flex justify-between">
                <span className="text-muted">Traveler Type:</span>
                <span className="font-semibold text-night">{mood || 'not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Companion:</span>
                <span className="font-semibold text-night">{travelers ? (travelers === 'solo' ? 'Solo' : travelers === 'couple' ? 'Couple' : travelers === 'family' ? 'Family' : 'Group') : 'not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Destination:</span>
                <span className="font-semibold text-night max-w-[130px] truncate">{getDestinationPrettyName(selectedDestination)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Duration:</span>
                <span className="font-semibold text-night">{duration ? (duration === 'weekend' ? '3 Days' : duration === 'short' ? '5 Days' : duration === 'week' ? '7 Days' : '14 Days') : 'not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Match Score:</span>
                <span className="font-bold text-coral">{mood ? '96% match' : '--'}</span>
              </div>
            </div>
            
            <div className="bg-background border border-border p-3 rounded-2xl text-[10px] text-muted leading-relaxed">
              <span className="font-bold text-night block mb-0.5 lowercase">companion guide recommendation</span>
              {activeCompanionRec()}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 md:p-8 text-left shadow-card">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" className="space-y-6" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-coral font-bold block mb-1">Step 1 of 5</span>
                  <h3 className="font-display text-3xl text-night font-light lowercase font-display">who's traveling?</h3>
                  <p className="text-xs text-muted/60 font-light font-sans mt-1">Select the travel style archetype that best matches your desires.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WIZARD_STYLE_OPTIONS.map((opt, i) => {
                    const Icon = opt.icon;
                    const isSelected = mood === opt.id;
                    return (
                      <StepOption key={opt.id} selected={isSelected} onClick={() => onMoodChange(opt.id)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer flex items-start gap-4 outline-none ${
                          isSelected
                            ? 'bg-background shadow-md'
                            : 'bg-background/60 border-border/40'
                        }`}
                        custom={i}
                        style={{
                          borderColor: isSelected ? opt.color : undefined,
                          boxShadow: isSelected ? `0 0 20px ${opt.color}40, inset 0 0 0 1px ${opt.color}40` : undefined
                        }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'scale-110' : ''}`}
                          style={{ backgroundColor: `${opt.color}15`, color: opt.color }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-night">{opt.label}</h4>
                          <p className="text-[10px] text-muted/50 mt-1 leading-relaxed font-sans">{opt.desc}</p>
                        </div>
                      </StepOption>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" className="space-y-6" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-coral font-bold block mb-1">Step 2 of 5</span>
                  <h3 className="font-display text-3xl text-night font-light lowercase">who are you traveling with?</h3>
                  <p className="text-xs text-muted/60 font-light font-sans mt-1">Tell us who is joining this journey, and select a destination chapter to explore.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 block">Departing From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted/30" />
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => onFromLocationChange(e.target.value)}
                      placeholder="e.g. Mumbai, Delhi, Bangalore..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/40 bg-background text-night placeholder:text-muted/30 outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 block">Travel Companion</label>
                  <div className="grid grid-cols-2 gap-3">
                    {COMPANION_OPTIONS.map((opt, i) => {
                      const Icon = opt.icon;
                      const isSelected = travelers === opt.id;
                      return (
                        <StepOption key={opt.id} selected={isSelected} onClick={() => onTravelersChange(opt.id)} custom={i}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer flex items-center gap-3 outline-none ${
                            isSelected
                              ? 'bg-background border-teal text-night shadow-[0_0_12px_rgba(24,182,201,0.15)]'
                              : 'bg-background/60 border-border/40 text-muted/60'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isSelected ? 'bg-teal/15 text-teal scale-110' : 'bg-[#F2ECE3] text-muted/40'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold block transition-colors ${isSelected ? 'text-night' : 'text-muted/70'}`}>{opt.label}</span>
                          </div>
                        </StepOption>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 block">Choose Destination</label>
                  <div className="relative mb-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/30" />
                    <input type="text" placeholder="Search destinations..."
                      onChange={e => {
                        const val = e.target.value.toLowerCase();
                        document.querySelectorAll('.dest-grid-item').forEach(el => {
                          const title = el.getAttribute('data-title')?.toLowerCase() || '';
                          el.classList.toggle('hidden', !title.includes(val));
                        });
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border/30 bg-background text-xs text-night placeholder:text-muted/30 outline-none focus:border-teal/50 transition-all font-sans" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {TOURS_DATA.map((tour, i) => {
                      const isSelected = selectedDestination === tour.id;
                      return (
                        <StepOption key={tour.id} selected={isSelected} onClick={() => onDestinationChange(tour.id)} custom={i}
                          data-title={tour.title}
                          className={`dest-grid-item group p-2.5 rounded-xl border text-left cursor-pointer flex flex-col justify-between aspect-[4/3] relative overflow-hidden outline-none ${
                            isSelected
                              ? 'border-gold shadow-[0_0_15px_rgba(244,182,61,0.25)] scale-[1.02]'
                              : 'border-border/40'
                          }`}
                        >
                          <img src={tour.bannerImage}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                              isSelected ? 'opacity-50' : 'opacity-30'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent z-0" />
                          {isSelected && (
                            <motion.div
                              className="absolute top-2 right-2 z-10 bg-gold text-night rounded-full p-0.5 shadow-sm"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                            </motion.div>
                          )}
                          <div className="relative z-10 w-full mt-auto text-left">
                            <span className="text-[7px] font-mono uppercase tracking-wider text-gold block mb-0.5">{tour.chapterName || 'Chapter'}</span>
                            <span className="text-[9px] font-bold text-white block truncate">{tour.title}</span>
                          </div>
                        </StepOption>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" className="space-y-6" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-coral font-bold block mb-1">Step 3 of 5</span>
                  <h3 className="font-display text-3xl text-night font-light lowercase">what pace fits you?</h3>
                  <p className="text-xs text-muted/60 font-light font-sans mt-1">Choose the daily rhythm that matches your travel style.</p>
                </div>
                <div className="space-y-3">
                  {ENERGY_OPTIONS.map((opt, i) => {
                    const isSelected = energy === opt.id;
                    return (
                      <StepOption key={opt.id} selected={isSelected} onClick={() => onEnergyChange(opt.id)} custom={i}
                        className={`w-full p-4 rounded-xl border text-left cursor-pointer flex justify-between items-center outline-none ${
                          isSelected
                            ? 'bg-background border-teal text-night shadow-[0_0_15px_rgba(24,182,201,0.1)]'
                            : 'bg-background/60 border-border/40 text-muted/60'
                        }`}
                      >
                        <div>
                          <span className={`text-xs font-bold block transition-colors ${isSelected ? 'text-night' : 'text-muted/80'}`}>{opt.label}</span>
                          <span className="text-[10px] text-muted/50 block mt-0.5 leading-relaxed font-sans font-light">{opt.desc}</span>
                        </div>
                        <motion.div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-teal/15 text-teal' : 'border border-border/40 text-transparent'
                          }`}
                          animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.div>
                      </StepOption>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" className="space-y-6" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-coral font-bold block mb-1">Step 4 of 5</span>
                  <h3 className="font-display text-3xl text-night font-light lowercase">craft your journey</h3>
                  <p className="text-xs text-muted/60 font-light font-sans mt-1">Set your duration and budget to shape this chapter of your story.</p>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 block">Duration of Stay</label>
                  <div className="grid grid-cols-2 gap-3">
                    {DURATION_OPTIONS.map((opt, i) => {
                      const isSelected = duration === opt.id;
                      return (
                        <StepOption key={opt.id} selected={isSelected} onClick={() => handleDurationSelect(opt.id)} custom={i}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer flex flex-col justify-between outline-none ${
                            isSelected
                              ? 'bg-background border-teal text-night shadow-[0_0_12px_rgba(24,182,201,0.15)]'
                              : 'bg-background/60 border-border/40 text-muted/60'
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-night' : 'text-muted/80'}`}>{opt.label}</span>
                          <span className="text-[9px] text-muted/50 mt-1 font-sans font-light">{opt.desc}</span>
                        </StepOption>
                      );
                    })}
                  </div>
                </div>

                {selectedTour && (
                  <motion.div className="space-y-3 pt-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-muted/60">
                      <span>Estimated Budget limit</span>
                      <span className="text-gold font-bold text-xs">₹{customBudgetAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div className="absolute inset-0 rounded-full bg-border/60 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal/40 via-gold/40 to-coral/40 rounded-full"
                          style={{ width: `${((customBudgetAmount - budgetSliderMin) / (budgetSliderMax - budgetSliderMin)) * 100}%` }} />
                      </div>
                      <input
                        type="range"
                        min={budgetSliderMin}
                        max={budgetSliderMax}
                        step={500}
                        value={customBudgetAmount}
                        onChange={(e) => onBudgetChange(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <motion.div
                        className="w-4 h-4 rounded-full bg-gold border-2 border-white shadow-md absolute pointer-events-none"
                        style={{
                          left: `calc(${((customBudgetAmount - budgetSliderMin) / (budgetSliderMax - budgetSliderMin)) * 100}% - 8px)`,
                        }}
                        layout
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-muted/40 uppercase tracking-widest leading-none">
                      <span>Min: ₹{budgetSliderMin.toLocaleString('en-IN')}</span>
                      <span>Max: ₹{budgetSliderMax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {['Small', 'Medium', 'Luxury'].map(tier => {
                        const isActive =
                          (tier === 'Small' && customBudgetAmount <= 15000) ||
                          (tier === 'Medium' && customBudgetAmount > 15000 && customBudgetAmount <= 40000) ||
                          (tier === 'Luxury' && customBudgetAmount > 40000);
                        return (
                          <span key={tier} className={`px-2.5 py-1 rounded-full text-[8px] font-mono uppercase tracking-wider border transition-all ${
                            isActive ? 'bg-gold/10 text-gold border-gold/30' : 'bg-background text-muted/30 border-border/30'
                          }`}>{tier}</span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" className="space-y-6" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-coral font-bold block mb-1">Step 5 of 5</span>
                  <h3 className="font-display text-3xl text-night font-light lowercase">craft your journey</h3>
                  <p className="text-xs text-muted/60 font-light font-sans mt-1">Review your journey profile, add any special requests, and let your travel companion craft your story.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 block">Special Requests / Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="e.g. Vegetarian food options only, photography spots prioritized, wheelchair accessibility needed..."
                    className="w-full min-h-[120px] p-4 text-xs text-night placeholder:text-muted/30 border border-border/40 bg-background rounded-2xl focus:border-teal outline-none resize-none font-sans leading-relaxed"
                  />
                </div>

                <motion.div
                  className="bg-background border border-border/40 rounded-2xl p-4 space-y-2 text-xs"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono text-muted/50">
                    <span>Journey profile</span>
                    <span>ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted/60">Destination:</span>
                    <span className="font-bold text-night">{getDestinationPrettyName(selectedDestination)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted/60">Style & Companion:</span>
                    <span className="font-bold text-night">{previewPersona}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted/60">Duration:</span>
                    <span className="font-bold text-night">{customDuration} days</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className="mt-8 pt-4 border-t border-border/30 flex justify-between gap-4" layout>
            <motion.button
              onClick={onBack}
              disabled={step === 1}
              className="px-5 py-3 rounded-full border border-border/40 text-muted/60 hover:text-night hover:border-border/60 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none min-h-[44px] flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </motion.button>

            <motion.button
              onClick={step === totalSteps ? handleGenerate : onNext}
              disabled={!canProceed() || generating}
              className="px-6 py-3 rounded-full bg-night cursor-pointer text-white font-bold uppercase tracking-wider min-h-[44px] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              whileHover={canProceed() ? { scale: 1.03, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' } : {}}
              whileTap={canProceed() ? { scale: 0.97 } : {}}
            >
              {generating ? (
                <motion.span className="flex items-center gap-2" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" /> Crafting Journey...
                </motion.span>
              ) : (
                <>
                  {step === totalSteps ? 'Craft Journey' : 'Next Step'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}