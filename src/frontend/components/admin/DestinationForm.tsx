import React from 'react';
import { X, Sparkles, Eye, Edit3 } from 'lucide-react';
import { Tour } from '../../types';
import RichTextRenderer from '../ui/RichTextRenderer';
import ImageUploader from '../ui/ImageUploader';

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
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
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
  setStatus: (v: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
  setMetaTitle: (v: string) => void;
  setMetaDescription: (v: string) => void;
  setOgImage: (v: string) => void;
  setOpen: (v: boolean) => void;
}

interface DestinationFormProps {
  state: DestinationFormState;
  actions: DestinationFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export default function DestinationForm({ state, actions, onSubmit }: DestinationFormProps) {
  const [imageQuality, setImageQuality] = React.useState<{ status: 'idle' | 'ok' | 'warn' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [showPreview, setShowPreview] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (!state.bannerImage) {
      setImageQuality({ status: 'idle', message: '' });
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < 1200 || img.naturalHeight < 700) {
        setImageQuality({ status: 'warn', message: `Image is ${img.naturalWidth}x${img.naturalHeight}. Recommended minimum is 1200x700 for premium hero crops.` });
      } else {
        setImageQuality({ status: 'ok', message: `Image quality gate passed (${img.naturalWidth}x${img.naturalHeight}).` });
      }
    };
    img.onerror = () => setImageQuality({ status: 'error', message: 'Image could not be loaded. Check the URL/path before publishing.' });
    img.src = state.bannerImage;
  }, [state.bannerImage]);

  const genericPhrases = ['hidden gem', 'nestled in', 'tapestry of', 'vibrant culture', 'breathtaking views', 'unforgettable experience'];
  const editorialWarnings = [
    state.description.length > 0 && state.description.length < 250 ? 'Description is short. Premium chapters should include specific local details, sensory language, and a clear travel reason.' : null,
    genericPhrases.some((phrase) => state.description.toLowerCase().includes(phrase)) ? 'Description contains generic travel phrasing. Replace with concrete local details to avoid AI-slop tone.' : null,
    !state.activities.includes(',') ? 'Activities should include several comma-separated, specific activities.' : null,
  ].filter(Boolean) as string[];

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const { generateDestinationDescription } = await import('../../../backend/lib/generate');
    const result = await generateDestinationDescription(state.name, state.city, state.country, state.tags);
    if (result) actions.setDescription(result);
    setIsGenerating(false);
  };

  const previewContent = showPreview ? <RichTextRenderer content={state.description} prose="base" /> : null;

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
            <p className="text-micro text-stone font-mono uppercase tracking-[0.25em] mt-1">destination content model</p>
          </div>
          <button onClick={() => actions.setOpen(false)} className="w-11 h-11 flex items-center justify-center btn-ghost text-stone hover:text-night cursor-pointer shrink-0 touch-action-manipulation select-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5 flex-1 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Destination Name *</label>
              <input type="text" required maxLength={100} placeholder="e.g. Varanasi" value={state.name} onChange={(e) => actions.setName(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Region / Category</label>
              <input type="text" maxLength={100} placeholder="e.g. South Asia" value={state.region} onChange={(e) => actions.setRegion(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">City *</label>
              <input type="text" required maxLength={50} placeholder="e.g. Varanasi" value={state.city} onChange={(e) => actions.setCity(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Country *</label>
              <input type="text" required maxLength={50} placeholder="e.g. India" value={state.country} onChange={(e) => actions.setCountry(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Budget (₹ INR) *</label>
              <input type="number" required value={state.price} onChange={(e) => actions.setPrice(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Guide</label>
              <input type="text" maxLength={50} value={state.duration} onChange={(e) => actions.setDuration(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
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
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Latitude *</label>
              <input type="number" step="0.000001" required value={state.latitude} onChange={(e) => actions.setLatitude(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Longitude *</label>
              <input type="number" step="0.000001" required value={state.longitude} onChange={(e) => actions.setLongitude(Number(e.target.value))} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="p-4 bg-secondary-surface/30 rounded-2xl border border-border space-y-4">
            <span className="text-micro font-mono font-bold text-gold uppercase tracking-[0.25em] block">Scores (0-100)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Adventure', value: state.adventureScore, setter: actions.setAdventureScore },
                { label: 'Culture', value: state.culturalScore, setter: actions.setCulturalScore },
                { label: 'Luxury', value: state.luxuryScore, setter: actions.setLuxuryScore },
                { label: 'Family', value: state.familyScore, setter: actions.setFamilyScore },
              ].map(field => (
                <div key={field.label} className="space-y-1">
                  <label className="text-micro font-medium text-stone">{field.label}</label>
                  <input type="number" min="0" max="100" value={field.value} onChange={(e) => field.setter(Number(e.target.value))} className="w-full px-3 py-3 sm:py-2 bg-white border border-border rounded-lg text-xs text-night text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Best Months (commas)</label>
              <input type="text" maxLength={200} value={state.bestMonths} onChange={(e) => actions.setBestMonths(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Travel Styles (commas)</label>
              <input type="text" maxLength={200} value={state.travelStyles} onChange={(e) => actions.setTravelStyles(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Activities (commas)</label>
              <input type="text" maxLength={500} value={state.activities} onChange={(e) => actions.setActivities(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Tags (commas)</label>
              <input type="text" maxLength={200} value={state.tags} onChange={(e) => actions.setTags(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <ImageUploader
            currentUrl={state.bannerImage}
            onUpload={actions.setBannerImage}
            endpoint="destinationImage"
            label="Banner Image *"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-micro font-mono font-bold text-stone uppercase tracking-[0.25em]">Description *</label>
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
              <div className="min-h-[120px] p-3.5 bg-white border border-border rounded-xl text-xs leading-relaxed">
                {previewContent || <span className="text-stone/50">Nothing to preview yet.</span>}
              </div>
            ) : (
              <textarea required maxLength={2000} rows={4} placeholder="Destination description... Supports **markdown** formatting." value={state.description} onChange={(e) => actions.setDescription(e.target.value)} className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-border rounded-xl text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none" />
            )}
            <p className="text-micro text-stone/60 text-right">{state.description.length}/2000</p>
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
            <span className="text-micro font-mono font-bold text-gold uppercase tracking-[0.25em] block">SEO Metadata</span>
            <div className="space-y-1">
              <label className="text-micro font-medium text-stone">Meta Title (max 70 chars)</label>
              <input type="text" maxLength={70} placeholder="e.g. Varanasi Travel Guide – Travebie" value={state.metaTitle} onChange={(e) => actions.setMetaTitle(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-medium text-stone">Meta Description (max 160 chars)</label>
              <textarea maxLength={160} rows={2} placeholder="A concise summary for search results..." value={state.metaDescription} onChange={(e) => actions.setMetaDescription(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-micro font-medium text-stone">OG Image URL (social share)</label>
              <input type="url" maxLength={500} placeholder="/images/og/varanasi.jpg" value={state.ogImage} onChange={(e) => actions.setOgImage(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
            <span className="text-micro font-mono font-bold text-gold uppercase tracking-[0.25em] block">Editorial Quality Gates</span>
            <div className={`text-xs leading-relaxed ${imageQuality.status === 'ok' ? 'text-emerald-700' : imageQuality.status === 'error' ? 'text-rose-700' : 'text-stone'}`}>
              {imageQuality.message || 'Add a banner image to run the visual quality check.'}
            </div>
            {editorialWarnings.length > 0 ? (
              <ul className="space-y-2 text-xs text-amber-700 list-disc pl-4">
                {editorialWarnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700">Editorial tone checks passed.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { actions.setFeatured(!state.featured); if (state.featured) actions.setTrending(false); }} className={`flex-1 py-3.5 btn-outline text-micro font-bold uppercase tracking-[0.18em] text-center cursor-pointer touch-action-manipulation select-none ${state.featured ? 'bg-teal/10 border-teal text-teal' : ''}`}>
              featured
            </button>
            <button type="button" onClick={() => { actions.setTrending(!state.trending); if (state.trending) actions.setFeatured(false); }} className={`flex-1 py-3.5 btn-outline text-micro font-bold uppercase tracking-[0.18em] text-center cursor-pointer touch-action-manipulation select-none ${state.trending ? 'bg-gold/10 border-gold text-gold' : ''}`}>
              trending
            </button>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => actions.setOpen(false)} className="flex-1 py-3.5 btn-outline text-stone text-micro font-bold uppercase tracking-[0.18em] cursor-pointer text-center touch-action-manipulation select-none">
              cancel
            </button>
            <button type="submit" className="flex-1 py-3.5 btn-primary text-micro font-bold uppercase tracking-[0.18em] cursor-pointer text-center">
              save destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
