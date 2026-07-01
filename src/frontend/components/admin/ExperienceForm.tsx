import React from 'react';
import { X, Sparkles, Eye, Edit3 } from 'lucide-react';
import { EXCHANGE_RATE } from '../../utils/currency';
import RichTextRenderer from '../ui/RichTextRenderer';
import ImageUploader from '../ui/ImageUploader';

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
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
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
  setStatus: (v: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
  setOpen: (v: boolean) => void;
}

interface ExperienceFormProps {
  state: ExperienceFormState;
  actions: ExperienceFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ExperienceForm({ state, actions, onSubmit }: ExperienceFormProps) {
  const [imageQuality, setImageQuality] = React.useState<{ status: 'idle' | 'ok' | 'warn' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [showPreview, setShowPreview] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (!state.featuredImage) {
      setImageQuality({ status: 'idle', message: '' });
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < 400 || img.naturalHeight < 300) {
        setImageQuality({ status: 'warn', message: `Image is ${img.naturalWidth}x${img.naturalHeight}. Recommended minimum is 400x300 for card crops.` });
      } else {
        setImageQuality({ status: 'ok', message: `Image quality gate passed (${img.naturalWidth}x${img.naturalHeight}).` });
      }
    };
    img.onerror = () => setImageQuality({ status: 'error', message: 'Image could not be loaded. Check the URL/path before publishing.' });
    img.src = state.featuredImage;
  }, [state.featuredImage]);

  const genericPhrases = ['hidden gem', 'nestled in', 'tapestry of', 'vibrant culture', 'breathtaking views', 'unforgettable experience'];
  const editorialWarnings = [
    state.description.length > 0 && state.description.length < 150 ? 'Description is short. Include specific activities, moods, and what makes this experience unique.' : null,
    genericPhrases.some((phrase) => state.description.toLowerCase().includes(phrase)) ? 'Description contains generic travel phrasing. Replace with concrete details.' : null,
    !state.tags.includes(',') && state.tags.length > 0 ? 'Tags should include several comma-separated, specific search terms.' : null,
  ].filter(Boolean) as string[];

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const { generateExperienceDescription } = await import('../../../backend/lib/generate');
    const result = await generateExperienceDescription(state.name, state.tags);
    if (result) actions.setDescription(result);
    setIsGenerating(false);
  };

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
          <button type="button" onClick={() => actions.setOpen(false)} className="w-11 h-11 flex items-center justify-center btn-ghost text-stone hover:text-night cursor-pointer shrink-0 touch-action-manipulation select-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Experience Name *</label>
               <input type="text" required maxLength={100} placeholder="e.g. Himalayan Trek" value={state.name} onChange={(e) => actions.setName(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Icon Name *</label>
               <input type="text" required maxLength={50} placeholder="e.g. Mountain, Compass" value={state.icon} onChange={(e) => actions.setIcon(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Target Budget (₹ INR)</label>
              <input type="number" value={state.estimatedBudget} onChange={(e) => actions.setEstimatedBudget(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Range</label>
               <input type="text" maxLength={50} placeholder="e.g. 3-5 days" value={state.durationRange} onChange={(e) => actions.setDurationRange(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
               <input type="text" maxLength={50} placeholder="e.g. Advanced" value={state.difficultyLevel} onChange={(e) => actions.setDifficultyLevel(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Connected Styles (commas)</label>
               <input type="text" maxLength={200} placeholder="Adventure, Wildlife" value={state.travelStyles} onChange={(e) => actions.setTravelStyles(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Search Tags (commas)</label>
               <input type="text" maxLength={200} placeholder="Winter, Sports" value={state.tags} onChange={(e) => actions.setTags(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <ImageUploader
            currentUrl={state.featuredImage}
            onUpload={actions.setFeaturedImage}
            endpoint="experienceImage"
            label="Featured Image *"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Description</label>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setShowPreview(p => !p)} className="px-2.5 py-1 rounded-md text-micro font-bold flex items-center gap-1 border border-border bg-white hover:bg-secondary-surface transition-colors cursor-pointer">
                  {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPreview ? 'edit' : 'preview'}
                </button>
                <button type="button" disabled={isGenerating || !state.name} onClick={handleGenerateDescription} className="px-2.5 py-1 rounded-md text-micro font-bold flex items-center gap-1 bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors disabled:opacity-40 cursor-pointer">
                  <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'generating...' : 'AI generate'}
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="min-h-[100px] p-3.5 bg-white border border-border rounded-xl text-xs leading-relaxed">
                {state.description ? <RichTextRenderer content={state.description} prose="base" /> : <span className="text-stone/50">Nothing to preview yet.</span>}
              </div>
            ) : (
              <textarea maxLength={1000} rows={4} placeholder="Experience description... Supports **markdown** formatting." value={state.description} onChange={(e) => actions.setDescription(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none" />
            )}
            <p className="text-micro text-stone/60 text-right">{state.description.length}/1000</p>
          </div>

          <div className="space-y-1">
            <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Editorial Status</label>
            <select value={state.status} onChange={(e) => actions.setStatus(e.target.value as any)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors appearance-none">
              <option value="DRAFT">Draft - not public</option>
              <option value="REVIEW">Ready for review</option>
              <option value="PUBLISHED">Published - visible publicly</option>
            </select>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
            <span className="text-micro font-mono font-bold text-gold uppercase tracking-[0.25em] block">Editorial Quality Gates</span>
            <div className={`text-xs leading-relaxed ${imageQuality.status === 'ok' ? 'text-emerald-700' : imageQuality.status === 'error' ? 'text-rose-700' : 'text-stone'}`}>
              {imageQuality.message || 'Add a featured image to run the visual quality check.'}
            </div>
            {editorialWarnings.length > 0 ? (
              <ul className="space-y-2 text-xs text-amber-700 list-disc pl-4">
                {editorialWarnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700">Editorial tone checks passed.</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="expFeatured" checked={state.featured} onChange={(e) => actions.setFeatured(e.target.checked)} className="w-4 h-4 border border-border rounded bg-white text-gold focus:ring-0 cursor-pointer" />
            <label htmlFor="expFeatured" className="text-xs text-night font-medium select-none cursor-pointer">Feature this experience on the landing page</label>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => actions.setOpen(false)} className="flex-1 py-3.5 btn-outline text-stone text-micro font-bold uppercase tracking-[0.18em] cursor-pointer text-center touch-action-manipulation select-none">
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
