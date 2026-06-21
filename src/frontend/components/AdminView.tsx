import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Check, 
  X, 
  ClipboardList, 
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Eye,
  Compass,
  Brain,
  Layout,
  Award,
  Sparkles,
  BarChart2,
  Settings,
  HelpCircle,
  Navigation
} from 'lucide-react';
import { Tour } from '../types';
import { getDashboardMetrics } from '../../backend/actions/analyticsActions';
import { 
  createDestination, 
  updateDestination, 
  deleteDestination, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  getAllExperiences 
} from '../../backend/actions/tourActions';

interface ExperienceItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featuredImage: string | null;
  icon: string | null;
  travelStyles: any; // Json array
  estimatedBudget: number | null;
  durationRange: string | null;
  difficultyLevel: string | null;
  tags: any; // Json array
  featured: boolean;
}

interface AdminViewProps {
  tours: Tour[];
  wishlistCount: number;
  onAddTour: (tour: Tour) => void;
  onUpdateTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
}

export default function AdminView({
  tours,
  wishlistCount,
  onAddTour,
  onUpdateTour,
  onDeleteTour
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'destinations' | 'experiences'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for loaded data
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  // Form management
  const [isDestFormOpen, setIsDestFormOpen] = useState(false);
  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Tour | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);

  // Destination Form State
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destRegion, setDestRegion] = useState('');
  const [destDescription, setDestDescription] = useState('');
  const [destPrice, setDestPrice] = useState(1500);
  const [destDuration, setDestDuration] = useState('7 Days, 6 Nights');
  const [destDifficulty, setDestDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging' | 'Expert'>('Moderate');
  const [destGroupSize, setDestGroupSize] = useState('Max 8 travelers');
  const [destFeatured, setDestFeatured] = useState(false);
  const [destTrending, setDestTrending] = useState(false);
  const [destLatitude, setDestLatitude] = useState(0);
  const [destLongitude, setDestLongitude] = useState(0);
  const [destAdventureScore, setDestAdventureScore] = useState(50);
  const [destCulturalScore, setDestCulturalScore] = useState(50);
  const [destLuxuryScore, setDestLuxuryScore] = useState(50);
  const [destFamilyScore, setDestFamilyScore] = useState(50);
  const [destBestMonths, setDestBestMonths] = useState('June, July, August');
  const [destTravelStyles, setDestTravelStyles] = useState('Luxury, Discovery');
  const [destActivities, setDestActivities] = useState('Sightseeing, Hiking');
  const [destTags, setDestTags] = useState('Premium, Exclusive');
  const [destBannerImage, setDestBannerImage] = useState('');

  // Experience Form State
  const [expName, setExpName] = useState('');
  const [expIcon, setExpIcon] = useState('Sparkles');
  const [expDescription, setExpDescription] = useState('');
  const [expFeaturedImage, setExpFeaturedImage] = useState('');
  const [expTravelStyles, setExpTravelStyles] = useState('Luxury, Adventure');
  const [expEstimatedBudget, setExpEstimatedBudget] = useState(2500);
  const [expDurationRange, setExpDurationRange] = useState('5-7 days');
  const [expDifficultyLevel, setExpDifficultyLevel] = useState('Moderate');
  const [expTags, setExpTags] = useState('Elite, Nature');
  const [expFeatured, setExpFeatured] = useState(false);

  // Loading metrics and experiences on mount
  const loadData = async () => {
    try {
      setLoadingMetrics(true);
      const metricsRes = await getDashboardMetrics();
      if (metricsRes.success) {
        setMetrics(metricsRes.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }

    try {
      setLoadingExperiences(true);
      const expRes = await getAllExperiences();
      if (expRes.success && expRes.data) {
        setExperiences(expRes.data as any);
      }
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoadingExperiences(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open forms
  const openCreateDestForm = () => {
    setEditingDest(null);
    setDestName('');
    setDestCountry('');
    setDestCity('');
    setDestRegion('Europe');
    setDestDescription('');
    setDestPrice(1500);
    setDestDuration('7 Days, 6 Nights');
    setDestDifficulty('Moderate');
    setDestGroupSize('Max 6 travelers');
    setDestFeatured(false);
    setDestTrending(false);
    setDestLatitude(48.8566);
    setDestLongitude(2.3522);
    setDestAdventureScore(70);
    setDestCulturalScore(80);
    setDestLuxuryScore(90);
    setDestFamilyScore(60);
    setDestBestMonths('May, June, September');
    setDestTravelStyles('Luxury, Cultural');
    setDestActivities('Sightseeing, Local Dining, Museum tours');
    setDestTags('Historic, High-end');
    setDestBannerImage('/images/tours/varanasi-banner.jpg');
    setIsDestFormOpen(true);
  };

  const openEditDestForm = (tour: Tour) => {
    setEditingDest(tour);
    setDestName(tour.title);
    
    // Parse city & country
    const locationParts = tour.location.split(',');
    setDestCity(locationParts[0]?.trim() || '');
    setDestCountry(locationParts[1]?.trim() || '');
    setDestRegion(tour.tags?.[0] || 'Global');
    setDestDescription(tour.description);
    setDestPrice(tour.price);
    setDestDuration(tour.duration);
    setDestDifficulty(tour.difficulty);
    setDestGroupSize(tour.groupSize);
    setDestFeatured(tour.category === 'popular');
    setDestTrending(tour.category === 'trending');
    setDestLatitude(tour.latitude || 0);
    setDestLongitude(tour.longitude || 0);
    
    // Set scores if available or guess
    setDestAdventureScore(50);
    setDestCulturalScore(60);
    setDestLuxuryScore(80);
    setDestFamilyScore(50);
    
    setDestBestMonths(tour.tags?.slice(0, 3).join(', ') || 'June, July');
    setDestTravelStyles(tour.tags?.join(', ') || 'Luxury');
    setDestActivities('Guided walks, Dining');
    setDestTags(tour.tags?.join(', ') || 'Premium');
    setDestBannerImage(tour.bannerImage);
    setIsDestFormOpen(true);
  };

  const openCreateExpForm = () => {
    setEditingExp(null);
    setExpName('');
    setExpIcon('Sparkles');
    setExpDescription('');
    setExpFeaturedImage('/images/cat-adventure.jpg');
    setExpTravelStyles('Adventure, Luxury');
    setExpEstimatedBudget(3000);
    setExpDurationRange('5-8 days');
    setExpDifficultyLevel('Moderate');
    setExpTags('Exclusive, Nature');
    setExpFeatured(false);
    setIsExpFormOpen(true);
  };

  const openEditExpForm = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setExpName(exp.name);
    setExpIcon(exp.icon || 'Sparkles');
    setExpDescription(exp.description || '');
    setExpFeaturedImage(exp.featuredImage || '');
    
    // Handle Array to comma-string conversion safely
    const stylesArr = Array.isArray(exp.travelStyles) ? exp.travelStyles : [];
    const tagsArr = Array.isArray(exp.tags) ? exp.tags : [];
    setExpTravelStyles(stylesArr.join(', '));
    setExpTags(tagsArr.join(', '));
    
    setExpEstimatedBudget(exp.estimatedBudget || 2000);
    setExpDurationRange(exp.durationRange || '5 days');
    setExpDifficultyLevel(exp.difficultyLevel || 'Moderate');
    setExpFeatured(exp.featured);
    setIsExpFormOpen(true);
  };

  // Submit handlers
  const handleSaveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName || !destCity || !destCountry || !destBannerImage) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: destName,
      slug: destName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      country: destCountry,
      city: destCity,
      region: destRegion,
      description: destDescription,
      images: [destBannerImage],
      metadata: {
        subtitle: `${destCity} Boutique Experience`,
        itinerary: [
          { day: 1, title: "Grand Arrival & Private Dinner", description: "Arrive at the retreat. Meet your private specialist guide for a gourmet welcome dinner.", activities: ["Airport Transfer", "Elite Dining"] },
          { day: 2, title: "Signature Exploration", description: "Immerse yourself in curated cultural highlights with local luxury experts.", activities: ["Guided Tour", "Premium Tastings"] }
        ],
        includedServices: [
          { name: "5-Star Boutique Lodging", iconName: "Hotel" },
          { name: "VIP Concierge Host", iconName: "UserCheck" }
        ]
      },
      price: Number(destPrice),
      duration: destDuration,
      difficulty: destDifficulty,
      groupSize: destGroupSize,
      featured: destFeatured,
      trending: destTrending,
      latitude: Number(destLatitude),
      longitude: Number(destLongitude),
      adventureScore: Number(destAdventureScore),
      culturalScore: Number(destCulturalScore),
      luxuryScore: Number(destLuxuryScore),
      familyScore: Number(destFamilyScore),
      bestMonths: destBestMonths.split(',').map(m => m.trim()).filter(Boolean),
      travelStyles: destTravelStyles.split(',').map(s => s.trim()).filter(Boolean),
      activities: destActivities.split(',').map(a => a.trim()).filter(Boolean),
      tags: destTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingDest) {
        // Edit flow
        const res = await updateDestination(editingDest.id, payload);
        if (res.success && res.data) {
          const updatedTour: Tour = {
            id: res.data.id,
            title: res.data.name,
            subtitle: (res.data.metadata as any)?.subtitle || res.data.description.slice(0, 80) + '...',
            description: res.data.description,
            category: (res.data.trending ? 'trending' : res.data.featured ? 'popular' : 'international') as any,
            duration: res.data.duration || '5 Days',
            rating: 4.8,
            reviewsCount: 0,
            price: res.data.price || 1500,
            location: `${res.data.city}, ${res.data.country}`,
            groupSize: res.data.groupSize || 'Max 6',
            difficulty: (res.data.difficulty || 'Moderate') as any,
            bannerImage: (res.data.images as string[])?.[0] || destBannerImage,
            images: (res.data.images as string[]) || [],
            itinerary: (res.data.metadata as any)?.itinerary || [],
            includedServices: (res.data.metadata as any)?.includedServices || [],
            reviews: [],
            tags: (res.data.tags as string[]) || [],
            moods: [],
            bestSeason: undefined,
            latitude: res.data.latitude || undefined,
            longitude: res.data.longitude || undefined,
          };
          onUpdateTour(updatedTour);
          alert("Destination updated successfully in database.");
        } else {
          alert("Error: " + res.error);
        }
      } else {
        // Create flow
        const res = await createDestination(payload);
        if (res.success && res.data) {
          const newTour: Tour = {
            id: res.data.id,
            title: res.data.name,
            subtitle: (res.data.metadata as any)?.subtitle || res.data.description.slice(0, 80) + '...',
            description: res.data.description,
            category: (res.data.trending ? 'trending' : res.data.featured ? 'popular' : 'international') as any,
            duration: res.data.duration || '5 Days',
            rating: 4.8,
            reviewsCount: 0,
            price: res.data.price || 1500,
            location: `${res.data.city}, ${res.data.country}`,
            groupSize: res.data.groupSize || 'Max 6',
            difficulty: (res.data.difficulty || 'Moderate') as any,
            bannerImage: (res.data.images as string[])?.[0] || destBannerImage,
            images: (res.data.images as string[]) || [],
            itinerary: (res.data.metadata as any)?.itinerary || [],
            moods: [],
            bestSeason: undefined,
            includedServices: (res.data.metadata as any)?.includedServices || [],
            reviews: [],
            tags: (res.data.tags as string[]) || [],
            latitude: res.data.latitude || undefined,
            longitude: res.data.longitude || undefined,
          };
          onAddTour(newTour);
          alert("Destination created and persistent in database.");
        } else {
          alert("Error: " + res.error);
        }
      }
      setIsDestFormOpen(false);
      loadData(); // Re-fetch dashboard metrics
    } catch (err: any) {
      console.error(err);
      alert("Database mutation failed.");
    }
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName || !expFeaturedImage) {
      alert("Please fill in required fields (Name and Image URL)");
      return;
    }

    const payload = {
      name: expName,
      slug: expName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: expDescription,
      featuredImage: expFeaturedImage,
      icon: expIcon,
      travelStyles: expTravelStyles.split(',').map(s => s.trim()).filter(Boolean),
      estimatedBudget: Number(expEstimatedBudget),
      durationRange: expDurationRange,
      difficultyLevel: expDifficultyLevel,
      tags: expTags.split(',').map(t => t.trim()).filter(Boolean),
      featured: expFeatured
    };

    try {
      if (editingExp) {
        const res = await updateExperience(editingExp.id, payload);
        if (res.success && res.data) {
          alert("Experience updated in database successfully!");
        } else {
          alert("Error: " + res.error);
        }
      } else {
        const res = await createExperience(payload);
        if (res.success && res.data) {
          alert("Experience registered and persistent in database!");
        } else {
          alert("Error: " + res.error);
        }
      }
      setIsExpFormOpen(false);
      loadData(); // Reload list
    } catch (err: any) {
      console.error(err);
      alert("Failed to save experience.");
    }
  };

  const handleDeleteDestClick = async (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete "${name}" from the database?`)) {
      try {
        const res = await deleteDestination(id);
        if (res.success) {
          onDeleteTour(id);
          alert("Destination deleted successfully.");
          loadData();
        } else {
          alert("Delete failed: " + res.error);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete destination.");
      }
    }
  };

  const handleDeleteExpClick = async (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete experience "${name}"?`)) {
      try {
        const res = await deleteExperience(id);
        if (res.success) {
          alert("Experience deleted successfully.");
          loadData();
        } else {
          alert("Delete failed: " + res.error);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete experience.");
      }
    }
  };

  // Filter list
  const filteredTours = tours.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExperiences = experiences.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen bg-[#090909] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans animate-[fadeIn_0.4s_ease-out]">
      
      {/* Premium Obsidian Command Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div>
          <span className="text-[10px] font-bold text-[#A3E635] uppercase tracking-widest bg-[#A3E635]/10 px-3 py-1 rounded-md border border-[#A3E635]/20">
            Luxury Intelligence Dashboard
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-2">
            Tripzy Command Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time travel telemetry, RAG discovery insights, and destination repository CRUD.
          </p>
        </div>

        {/* High-tech glass tab controllers */}
        <div className="flex bg-[#121212] border border-white/5 p-1 rounded-2xl shadow-2xl self-stretch md:self-auto justify-around">
          {[
            { id: 'dashboard', label: 'Intelligence', icon: BarChart2 },
            { id: 'destinations', label: 'Destinations', icon: MapPin },
            { id: 'experiences', label: 'Experiences', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#A3E635] text-black shadow-md shadow-[#A3E635]/20'
                    : 'text-neutral-450 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intelligence Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {loadingMetrics ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <div className="w-10 h-10 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs uppercase tracking-wider">Aggregating database analytics...</p>
            </div>
          ) : (
            <>
              {/* Telemetry Counter Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-[#121212]/90 rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#A3E635]/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Searches</span>
                    <div className="w-8 h-8 rounded-full bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center border border-[#A3E635]/20">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight text-white mt-3">
                    {metrics?.totals?.searches?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">Real-time user discovery requests</p>
                </div>

                <div className="bg-[#121212]/90 rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Destination Views</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight text-white mt-3">
                    {metrics?.totals?.views?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">Destination catalog detail clicks</p>
                </div>

                <div className="bg-[#121212]/90 rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Itinerary Plans</span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight text-white mt-3">
                    {metrics?.totals?.planners?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">Generated custom itineraries</p>
                </div>

                <div className="bg-[#121212]/90 rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">RAG Recommendations</span>
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <Brain className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight text-white mt-3">
                    {metrics?.totals?.recommendations?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">AI matches from db candidates</p>
                </div>

              </div>

              {/* RAG Telemetry Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Search query trend card */}
                <div className="bg-[#121212]/95 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">
                      Top Search Queries
                    </h3>
                    <Search className="w-4 h-4 text-[#A3E635]" />
                  </div>
                  <div className="space-y-3">
                    {!metrics?.searchTrends || metrics.searchTrends.length === 0 ? (
                      <p className="text-xs text-neutral-500 py-6 text-center">No searches tracked yet.</p>
                    ) : (
                      metrics.searchTrends.map((s: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white/2 px-3 py-2.5 rounded-xl border border-white/5">
                          <span className="font-semibold text-white">"{s.query}"</span>
                          <span className="font-bold text-[#A3E635] bg-[#A3E635]/10 px-2 py-0.5 rounded-md text-[10px]">
                            {s.count} hits
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Destination views card */}
                <div className="bg-[#121212]/95 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">
                      Most Viewed Escapes
                    </h3>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    {!metrics?.destinationPopularity || metrics.destinationPopularity.length === 0 ? (
                      <p className="text-xs text-neutral-500 py-6 text-center">No views logged yet.</p>
                    ) : (
                      metrics.destinationPopularity.map((d: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white/2 px-3 py-2.5 rounded-xl border border-white/5">
                          <span className="font-semibold text-white">{d.name}</span>
                          <span className="font-bold text-blue-400 bg-blue-450/10 px-2 py-0.5 rounded-md text-[10px]">
                            {d.count} views
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Rec engine hits card */}
                <div className="bg-[#121212]/95 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">
                      AI Recommendation Favorites
                    </h3>
                    <Brain className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    {!metrics?.recommendationPopularity || metrics.recommendationPopularity.length === 0 ? (
                      <p className="text-xs text-neutral-500 py-6 text-center">No recommendations tracked yet.</p>
                    ) : (
                      metrics.recommendationPopularity.map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white/2 px-3 py-2.5 rounded-xl border border-white/5">
                          <span className="font-semibold text-white">{r.name}</span>
                          <span className="font-bold text-purple-400 bg-purple-450/10 px-2 py-0.5 rounded-md text-[10px]">
                            {r.count} times
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Persona Discovery insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#121212]/50 border border-white/5 p-6 rounded-3xl">
                
                {/* Budget Distribution */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#A3E635]" />
                    Budget Selections Breakdown
                  </h3>
                  
                  <div className="space-y-4 pt-2">
                    {['Small', 'Medium', 'Luxury'].map(tier => {
                      const found = metrics?.planning?.budgets?.find((b: any) => b.tier === tier);
                      const count = found ? found.count : 0;
                      const maxVal = Math.max(...(metrics?.planning?.budgets?.map((b: any) => b.count) || [1]));
                      const percentage = maxVal > 0 ? (count / maxVal) * 100 : 0;
                      
                      return (
                        <div key={tier} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-405 font-medium">{tier} Tier</span>
                            <span className="font-bold text-white">{count} planners</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out bg-[#A3E635]`}
                              style={{ width: `${Math.max(5, percentage)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Styles */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#A3E635]" />
                      Average Travel Duration
                    </h3>
                    <p className="text-3xl font-black text-white">
                      {metrics?.planning?.averageDuration || 0} <span className="text-sm font-normal text-neutral-400">days planned per itinerary</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                      Top Requested Travel Styles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {!metrics?.planning?.travelStyles || metrics.planning.travelStyles.length === 0 ? (
                        <span className="text-xs text-neutral-500">None yet</span>
                      ) : (
                        metrics.planning.travelStyles.map((ts: any, idx: number) => (
                          <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#A3E635] flex items-center gap-1">
                            {ts.style}
                            <span className="text-[10px] text-neutral-400">({ts.count})</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendation Feedback Loops */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#A3E635]" />
                    AI Recommendation Feedback
                  </h3>
                  
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-neutral-400">Recommendation CTR</span>
                      <span className="font-bold text-[#A3E635] text-sm">{metrics?.feedback?.ctr || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-neutral-400">Helpful Rating (👍)</span>
                      <span className="font-bold text-white">{metrics?.feedback?.helpful || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-neutral-400">Not Relevant Rating (👎)</span>
                      <span className="font-bold text-red-400">{metrics?.feedback?.notRelevant || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-neutral-400">Saves from Recs</span>
                      <span className="font-bold text-purple-400">{metrics?.feedback?.saved || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                      <span className="text-neutral-400">Plans from Recs</span>
                      <span className="font-bold text-blue-400">{metrics?.feedback?.plans || 0}</span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* Destinations Tab */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search destinations by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121212] border border-white/5 text-xs text-white shadow-inner focus:outline-none focus:border-[#A3E635]"
              />
            </div>

            <button
              onClick={openCreateDestForm}
              className="px-5 py-2.5 rounded-2xl bg-[#A3E635] text-black hover:bg-lime-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Destination</span>
            </button>
          </div>

          {/* Destinations Table */}
          <div className="bg-[#121212]/85 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-white/2 text-neutral-400 uppercase font-bold tracking-wider border-b border-white/5">
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Coordinates</th>
                    <th className="py-4 px-6">Attributes</th>
                    <th className="py-4 px-6 text-right">Budget Guide</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.bannerImage}
                            alt={tour.title}
                            className="w-12 h-12 rounded-xl object-cover border border-white/5 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{tour.title}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{tour.duration}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{tour.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] text-neutral-400">
                        {tour.latitude && tour.longitude ? (
                          <div className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-[#A3E635]" />
                            <span>{tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}</span>
                          </div>
                        ) : (
                          <span className="text-red-400">No Coords</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1.5 flex-wrap">
                          {tour.category === 'trending' && (
                            <span className="bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Trending</span>
                          )}
                          {tour.category === 'popular' && (
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Featured</span>
                          )}
                          <span className="bg-white/5 text-neutral-300 px-2 py-0.5 rounded text-[9px] font-semibold">{tour.difficulty}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#A3E635]">
                        ${tour.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditDestForm(tour)}
                          className="p-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-[#A3E635] hover:text-black active:scale-95 transition-all cursor-pointer inline-flex border border-white/5"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestClick(tour.id, tour.title)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-650 hover:text-white active:scale-95 transition-all cursor-pointer inline-flex border border-red-500/20"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121212] border border-white/5 text-xs text-white shadow-inner focus:outline-none focus:border-[#A3E635]"
              />
            </div>

            <button
              onClick={openCreateExpForm}
              className="px-5 py-2.5 rounded-2xl bg-[#A3E635] text-black hover:bg-lime-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Experience</span>
            </button>
          </div>

          {/* Experiences Table */}
          <div className="bg-[#121212]/85 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            {loadingExperiences ? (
              <div className="text-center py-12 text-neutral-400">Loading experiences...</div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <Sparkles className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-neutral-600" />
                <p className="text-sm font-semibold">No experiences registered</p>
                <p className="text-xs mt-1">Create experience nodes to enrich your AI recommendations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-white/2 text-neutral-400 uppercase font-bold tracking-wider border-b border-white/5">
                      <th className="py-4 px-6">Experience Node</th>
                      <th className="py-4 px-6">Icon Name</th>
                      <th className="py-4 px-6">Budget Target</th>
                      <th className="py-4 px-6">Duration Range</th>
                      <th className="py-4 px-6 text-center">Featured</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredExperiences.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {exp.featuredImage ? (
                              <img
                                src={exp.featuredImage}
                                alt={exp.name}
                                className="w-10 h-10 rounded-lg object-cover border border-white/5 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 border border-white/5">
                                <Sparkles className="w-4 h-4 text-neutral-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm">{exp.name}</p>
                              <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">{exp.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-[#A3E635] text-xs">
                          {exp.icon || 'Sparkles'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-neutral-300">
                          ${exp.estimatedBudget?.toLocaleString() || 'Flexible'}
                        </td>
                        <td className="py-4 px-6 text-neutral-400 font-medium">
                          {exp.durationRange || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {exp.featured ? (
                            <span className="bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 px-2 py-0.5 rounded-full text-[9px] font-bold">YES</span>
                          ) : (
                            <span className="text-neutral-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditExpForm(exp)}
                            className="p-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-[#A3E635] hover:text-black active:scale-95 transition-all cursor-pointer inline-flex border border-white/5"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpClick(exp.id, exp.name)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-650 hover:text-white active:scale-95 transition-all cursor-pointer inline-flex border border-red-500/20"
                            title="Delete"
                          >
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
        </div>
      )}

      {/* Destination Form Slider Overlay */}
      {isDestFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div onClick={() => setIsDestFormOpen(false)} className="absolute inset-0" />
          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border-l border-white/10 shadow-2xl h-full flex flex-col p-6 overflow-y-auto animate-[slideLeft_0.3s_cubic-bezier(0.16,1,0.3,1)] text-white">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#A3E635]">
                  {editingDest ? 'Edit Luxury Destination' : 'Register New Destination'}
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                  RAG Database Content Model
                </p>
              </div>
              <button
                onClick={() => setIsDestFormOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDest} className="space-y-5 flex-1 pb-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maldives Luxury Atoll"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Region / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. South Asia"
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Male"
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maldives"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Budget Guide ($) *</label>
                  <input
                    type="number"
                    required
                    value={destPrice}
                    onChange={(e) => setDestPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Duration Guide</label>
                  <input
                    type="text"
                    value={destDuration}
                    onChange={(e) => setDestDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Difficulty Level</label>
                  <select
                    value={destDifficulty}
                    onChange={(e) => setDestDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Latitude * (Leaflet Map)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={destLatitude}
                    onChange={(e) => setDestLatitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Longitude * (Leaflet Map)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={destLongitude}
                    onChange={(e) => setDestLongitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-4">
                <span className="text-[10px] font-black uppercase text-[#A3E635] tracking-widest block">RAG Scoring Coefficients (0-100)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-400">Adventure</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destAdventureScore}
                      onChange={(e) => setDestAdventureScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#A3E635] text-white text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-400">Culture</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destCulturalScore}
                      onChange={(e) => setDestCulturalScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#A3E635] text-white text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-400">Luxury</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destLuxuryScore}
                      onChange={(e) => setDestLuxuryScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#A3E635] text-white text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-400">Family</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destFamilyScore}
                      onChange={(e) => setDestFamilyScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#A3E635] text-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Best Months (commas)</label>
                  <input
                    type="text"
                    value={destBestMonths}
                    onChange={(e) => setDestBestMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Travel Styles (commas)</label>
                  <input
                    type="text"
                    value={destTravelStyles}
                    onChange={(e) => setDestTravelStyles(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Activities (commas)</label>
                  <input
                    type="text"
                    value={destActivities}
                    onChange={(e) => setDestActivities(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tags (commas)</label>
                  <input
                    type="text"
                    value={destTags}
                    onChange={(e) => setDestTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="/images/tours/destination-banner.jpg"
                  value={destBannerImage}
                  onChange={(e) => setDestBannerImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Premium description of the escape sanctuary..."
                  value={destDescription}
                  onChange={(e) => setDestDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setDestFeatured(!destFeatured);
                    if (destFeatured) setDestTrending(false);
                  }}
                  className={`flex-1 py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                    destFeatured ? 'bg-blue-500/10 border-blue-500 text-blue-450' : 'bg-transparent border-white/10 text-neutral-400'
                  }`}
                >
                  Featured escape
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestTrending(!destTrending);
                    if (destTrending) setDestFeatured(false);
                  }}
                  className={`flex-1 py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                    destTrending ? 'bg-[#A3E635]/10 border-[#A3E635] text-[#A3E635]' : 'bg-transparent border-white/10 text-neutral-400'
                  }`}
                >
                  Trending escape
                </button>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsDestFormOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-neutral-350 transition-all cursor-pointer text-center border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#A3E635] text-black hover:bg-lime-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-lg"
                >
                  Save to DB
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Experience Form Slider Overlay */}
      {isExpFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div onClick={() => setIsExpFormOpen(false)} className="absolute inset-0" />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border-l border-white/10 shadow-2xl h-full flex flex-col p-6 overflow-y-auto animate-[slideLeft_0.3s_cubic-bezier(0.16,1,0.3,1)] text-white">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#A3E635]">
                  {editingExp ? 'Edit Travel Experience' : 'Create Custom Experience'}
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                  RAG Database Content Model
                </p>
              </div>
              <button
                onClick={() => setIsExpFormOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-5 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Experience Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alpine Heli-Skiing"
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Lucide Icon name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mountain, Award, Sparkles"
                    value={expIcon}
                    onChange={(e) => setExpIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target Budget ($)</label>
                  <input
                    type="number"
                    value={expEstimatedBudget}
                    onChange={(e) => setExpEstimatedBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Duration Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 days"
                    value={expDurationRange}
                    onChange={(e) => setExpDurationRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Difficulty Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced"
                    value={expDifficultyLevel}
                    onChange={(e) => setExpDifficultyLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Connected Styles (commas)</label>
                  <input
                    type="text"
                    placeholder="Adventure, Wildlife"
                    value={expTravelStyles}
                    onChange={(e) => setExpTravelStyles(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Search Tags (commas)</label>
                  <input
                    type="text"
                    placeholder="Winter, Sports"
                    value={expTags}
                    onChange={(e) => setExpTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Featured Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="/images/cat-adventure.jpg"
                  value={expFeaturedImage}
                  onChange={(e) => setExpFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={4}
                  placeholder="Luxury description of the adventure experience node..."
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#A3E635] text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="expFeatured"
                  checked={expFeatured}
                  onChange={(e) => setExpFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 border border-white/10 rounded bg-[#121212] text-[#A3E635] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="expFeatured" className="text-xs text-neutral-300 font-bold select-none cursor-pointer">
                  Feature this experience on the landing page
                </label>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsExpFormOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-neutral-350 transition-all cursor-pointer text-center border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#A3E635] text-black hover:bg-lime-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-lg"
                >
                  Save Experience
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
