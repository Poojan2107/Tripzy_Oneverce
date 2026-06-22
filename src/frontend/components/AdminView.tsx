import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Check, 
  X, 
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Eye,
  Compass,
  Brain,
  Sparkles,
  BarChart2,
  Navigation,
  Mail,
  Clock,
  Star,
  BookOpen,
  Shield,
  UserCheck,
  Globe,
  Activity,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Tour } from '../types';
import { formatINR, EXCHANGE_RATE } from '../utils/currency';
import { getDashboardMetrics } from '../../backend/actions/analyticsActions';
import { getAdminUsers } from '../../backend/actions/adminActions';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'destinations' | 'experiences' | 'users'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for loaded data
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

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

  // Loading metrics, experiences, and users on mount
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

    try {
      setLoadingUsers(true);
      const usersRes = await getAdminUsers();
      if (usersRes.success) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Lock body scroll when slide-overs are open
  useEffect(() => {
    if (isDestFormOpen || isExpFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDestFormOpen, isExpFormOpen]);

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
    setDestPrice(Math.round(tour.price * EXCHANGE_RATE));
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
    setExpEstimatedBudget(Math.round(3000 * EXCHANGE_RATE));
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
    
    setExpEstimatedBudget(Math.round((exp.estimatedBudget || 2000) * EXCHANGE_RATE));
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
      price: Math.round(Number(destPrice) / EXCHANGE_RATE),
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
      estimatedBudget: Math.round(Number(expEstimatedBudget) / EXCHANGE_RATE),
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
    <div className="w-full min-h-dvh bg-sand pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans antialiased [-webkit-tap-highlight-color]:transparent selection:bg-gold/20 selection:text-ink">
      
      {/* Tripzy Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-warm-gray">
        <div>
          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.25em] bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
            admin panel
          </span>
          <h1 className="text-3xl font-light font-display lowercase tracking-tight text-ink mt-3">
            tripzy admin
          </h1>
          <p className="text-xs text-stone mt-1">
            Manage destinations, experiences, and view analytics
          </p>
        </div>

        {/* Editorial tab controller */}
        <div className="flex bg-white border border-warm-gray p-1 rounded-2xl shadow-soft self-stretch md:self-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Analytics', icon: BarChart2 },
            { id: 'users', label: 'Users', icon: Users },
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
                className={`px-3 sm:px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 touch-action-manipulation select-none min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-gold text-white shadow-md shadow-gold/20'
                    : 'text-stone hover:text-ink hover:bg-cream/30'
                }`}
              >
                <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
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
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-stone">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em]">loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Telemetry Counter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Users</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.users?.toLocaleString() || 0}
                  </p>
                  <p className="text-[8px] font-mono text-stone/50 mt-0.5">{metrics?.totals?.admins || 0} admins</p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Destinations</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.destinations?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Experiences</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage/10 text-sage flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.experiences?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Saved Itineraries</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.savedItineraries?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Searches</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.searches?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Views</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                      <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.views?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">AI Plans</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage/10 text-sage flex items-center justify-center shrink-0">
                      <Compass className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.planners?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-warm-gray p-4 sm:p-6 shadow-card relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">Recs</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-ink mt-2 sm:mt-3">
                    {metrics?.totals?.recommendations?.toLocaleString() || 0}
                  </p>
                </div>

              </div>

              {/* RAG Telemetry Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Search query trend card */}
                <div className="bg-white border border-warm-gray rounded-3xl p-5 sm:p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-gray">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-stone">
                      Top Search Queries
                    </h3>
                    <Search className="w-4 h-4 text-gold" />
                  </div>
                  <div className="space-y-2">
                    {!metrics?.searchTrends || metrics.searchTrends.length === 0 ? (
                      <p className="text-xs text-stone py-6 text-center">No searches tracked yet.</p>
                    ) : (
                      metrics.searchTrends.map((s: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-cream/30 px-3 py-2.5 rounded-xl border border-warm-gray/60">
                          <span className="font-medium text-ink">"{s.query}"</span>
                          <span className="font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md text-[10px] font-mono">
                            {s.count} hits
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Destination views card */}
                <div className="bg-white border border-warm-gray rounded-3xl p-5 sm:p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-gray">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-stone">
                      Most Viewed Destinations
                    </h3>
                    <Eye className="w-4 h-4 text-ocean" />
                  </div>
                  <div className="space-y-2">
                    {!metrics?.destinationPopularity || metrics.destinationPopularity.length === 0 ? (
                      <p className="text-xs text-stone py-6 text-center">No views logged yet.</p>
                    ) : (
                      metrics.destinationPopularity.map((d: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-cream/30 px-3 py-2.5 rounded-xl border border-warm-gray/60">
                          <span className="font-medium text-ink">{d.name}</span>
                          <span className="font-bold text-ocean bg-ocean/10 px-2 py-0.5 rounded-md text-[10px] font-mono">
                            {d.count} views
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Rec engine hits card */}
                <div className="bg-white border border-warm-gray rounded-3xl p-5 sm:p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-gray">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-stone">
                      AI Recommendation Favorites
                    </h3>
                    <Brain className="w-4 h-4 text-sage" />
                  </div>
                  <div className="space-y-2">
                    {!metrics?.recommendationPopularity || metrics.recommendationPopularity.length === 0 ? (
                      <p className="text-xs text-stone py-6 text-center">No recommendations tracked yet.</p>
                    ) : (
                      metrics.recommendationPopularity.map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-cream/30 px-3 py-2.5 rounded-xl border border-warm-gray/60">
                          <span className="font-medium text-ink">{r.name}</span>
                          <span className="font-bold text-sage bg-sage/10 px-2 py-0.5 rounded-md text-[10px] font-mono">
                            {r.count} times
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Persona Discovery insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-warm-white/70 border border-warm-gray p-5 sm:p-6 rounded-3xl">
                
                {/* Budget Distribution */}
                <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-ink mb-4 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gold" />
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
                            <span className="text-stone font-medium">{tier} Tier</span>
                            <span className="font-bold text-ink">{count} planners</span>
                          </div>
                          <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out bg-gold`}
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
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-ink mb-3 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold" />
                      Average Travel Duration
                    </h3>
                    <p className="text-3xl font-light font-display text-ink">
                      {metrics?.planning?.averageDuration || 0} <span className="text-sm font-sans text-stone">days planned per itinerary</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-stone mb-2.5">
                      Top Requested Travel Styles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {!metrics?.planning?.travelStyles || metrics.planning.travelStyles.length === 0 ? (
                        <span className="text-xs text-stone">None yet</span>
                      ) : (
                        metrics.planning.travelStyles.map((ts: any, idx: number) => (
                          <span key={idx} className="bg-cream/30 border border-warm-gray/60 px-3 py-1 rounded-full text-xs font-medium text-ink flex items-center gap-1">
                            {ts.style}
                            <span className="text-[10px] text-stone">({ts.count})</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendation Feedback */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-ink flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                    AI Recommendation Feedback
                  </h3>
                  
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex justify-between items-center bg-cream/30 p-2.5 rounded-xl border border-warm-gray/60">
                      <span className="text-stone">Recommendation CTR</span>
                      <span className="font-bold text-gold">{metrics?.feedback?.ctr || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-cream/30 p-2.5 rounded-xl border border-warm-gray/60">
                      <span className="text-stone">Helpful Rating (👍)</span>
                      <span className="font-bold text-ink">{metrics?.feedback?.helpful || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-cream/30 p-2.5 rounded-xl border border-warm-gray/60">
                      <span className="text-stone">Not Relevant Rating (👎)</span>
                      <span className="font-bold text-red-500">{metrics?.feedback?.notRelevant || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-cream/30 p-2.5 rounded-xl border border-warm-gray/60">
                      <span className="text-stone">Saves from Recs</span>
                      <span className="font-bold text-sage">{metrics?.feedback?.saved || 0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-cream/30 p-2.5 rounded-xl border border-warm-gray/60">
                      <span className="text-stone">Plans from Recs</span>
                      <span className="font-bold text-ocean">{metrics?.feedback?.plans || 0}</span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-warm-gray text-base text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
              />
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-light font-display text-ink">{users.length}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-stone">Total Users</p>
            </div>
          </div>

          {/* Users Table (desktop) */}
          <div className="hidden sm:block bg-white border border-warm-gray rounded-3xl overflow-hidden shadow-card">
            {loadingUsers ? (
              <div className="text-center py-12 text-stone text-xs">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-sand text-stone uppercase font-bold tracking-wider border-b border-warm-gray">
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">User</th>
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Role</th>
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Joined</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Wishlist</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Itineraries</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Reviews</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Trips</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Chats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray/60">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-cream/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {u.image ? (
                              <img src={u.image} alt={u.name || u.email} className="w-9 h-9 rounded-full object-cover border border-warm-gray shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0 border border-warm-gray">
                                <Users className="w-4 h-4 text-stone" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-ink text-sm">{u.name || 'Unnamed'}</p>
                              <p className="text-[10px] text-stone mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3" />{u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {u.role === "ADMIN" ? (
                            <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                              <Shield className="w-3 h-3" />Admin
                            </span>
                          ) : (
                            <span className="bg-cream/40 text-stone px-2 py-0.5 rounded-full text-[9px] font-medium">User</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-stone font-mono text-[10px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone/60" />
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-mono text-[10px] text-ink">{u._count?.bookmarks || 0}</td>
                        <td className="py-4 px-6 text-center font-mono text-[10px] text-ink">{u._count?.savedItineraries || 0}</td>
                        <td className="py-4 px-6 text-center font-mono text-[10px] text-ink">{u._count?.reviews || 0}</td>
                        <td className="py-4 px-6 text-center font-mono text-[10px] text-ink">{u._count?.trips || 0}</td>
                        <td className="py-4 px-6 text-center font-mono text-[10px] text-ink">{u._count?.conversations || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Users Card List (mobile) */}
          <div className="sm:hidden space-y-3">
            {loadingUsers ? (
              <div className="text-center py-12 text-stone text-xs">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-stone">
                <Users className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone/40" />
                <p className="text-sm font-medium text-ink">No users registered</p>
                <p className="text-xs mt-1">Users will appear once they sign in.</p>
              </div>
            ) : (
              users.map((u: any) => (
                <div key={u.id} className="bg-white border border-warm-gray rounded-2xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    {u.image ? (
                      <img src={u.image} alt={u.name || u.email} className="w-12 h-12 rounded-full object-cover border border-warm-gray shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0 border border-warm-gray">
                        <Users className="w-5 h-5 text-stone" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink text-sm truncate">{u.name || 'Unnamed'}</p>
                        {u.role === "ADMIN" && (
                          <span className="bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5" />Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone mt-0.5">{u.email}</p>
                      <div className="flex gap-3 mt-2 text-[10px] text-stone">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{u._count?.bookmarks || 0}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{u._count?.savedItineraries || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{u._count?.conversations || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Destinations Tab */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="text"
                placeholder="Search destinations by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-warm-gray text-base text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
              />
            </div>

            <button
              onClick={openCreateDestForm}
              className="px-5 py-3 sm:py-2.5 rounded-xl bg-night text-white hover:bg-ink text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-action-manipulation select-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Destination</span>
            </button>
          </div>

          {/* Destinations Table (desktop) */}
          <div className="hidden sm:block bg-white border border-warm-gray rounded-3xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-sand text-stone uppercase font-bold tracking-wider border-b border-warm-gray">
                    <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Destination</th>
                    <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Location</th>
                    <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Coordinates</th>
                    <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Attributes</th>
                    <th className="py-4 px-6 text-right text-[10px] font-mono tracking-[0.25em]">Budget Guide</th>
                    <th className="py-4 px-6 text-right text-[10px] font-mono tracking-[0.25em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/60">
                  {filteredTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.bannerImage}
                            alt={tour.title}
                            loading="lazy"
                            decoding="async"
                            className="w-12 h-12 rounded-xl object-cover border border-warm-gray shrink-0"
                          />
                          <div>
                            <p className="font-medium text-ink text-sm">{tour.title}</p>
                            <p className="text-[10px] text-stone mt-0.5">{tour.duration}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-muted">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone" />
                          <span>{tour.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] text-stone">
                        {tour.latitude && tour.longitude ? (
                          <div className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-gold" />
                            <span>{tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}</span>
                          </div>
                        ) : (
                          <span className="text-red-400">No Coords</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1.5 flex-wrap">
                          {tour.category === 'trending' && (
                            <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Trending</span>
                          )}
                          {tour.category === 'popular' && (
                            <span className="bg-ocean/10 text-ocean border border-ocean/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Featured</span>
                          )}
                          <span className="bg-cream/30 text-stone px-2 py-0.5 rounded text-[9px] font-medium">{tour.difficulty}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-ink font-mono text-[11px]">
                        {formatINR(tour.price)}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditDestForm(tour)}
                          className="w-11 h-11 rounded-lg bg-cream/30 text-stone hover:bg-gold hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-warm-gray/60 touch-action-manipulation select-none"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestClick(tour.id, tour.title)}
                          className="w-11 h-11 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-red-200 touch-action-manipulation select-none"
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

          {/* Destinations Card List (mobile) */}
          <div className="sm:hidden space-y-3">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="bg-white border border-warm-gray rounded-2xl p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <img
                    src={tour.bannerImage}
                    alt={tour.title}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-xl object-cover border border-warm-gray shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{tour.title}</p>
                    <p className="text-[10px] text-stone mt-0.5 truncate">{tour.location}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {tour.category === 'trending' && (
                        <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Trending</span>
                      )}
                      {tour.category === 'popular' && (
                        <span className="bg-ocean/10 text-ocean border border-ocean/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Featured</span>
                      )}
                      <span className="bg-cream/30 text-stone px-2 py-0.5 rounded text-[9px] font-medium">{tour.difficulty}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-ink text-sm">{formatINR(tour.price)}</p>
                    <p className="text-[10px] text-stone mt-0.5">{tour.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-warm-gray/60">
                  {tour.latitude && tour.longitude ? (
                    <span className="text-[10px] text-stone font-mono flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-gold" />
                      {tour.latitude.toFixed(2)}, {tour.longitude.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-400">No coords</span>
                  )}
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => openEditDestForm(tour)}
                      className="w-11 h-11 rounded-lg bg-cream/30 text-stone hover:bg-gold hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-warm-gray/60"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDestClick(tour.id, tour.title)}
                      className="w-11 h-11 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-warm-gray text-base text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
              />
            </div>

            <button
              onClick={openCreateExpForm}
              className="px-5 py-3 sm:py-2.5 rounded-xl bg-night text-white hover:bg-ink text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-action-manipulation select-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Experience</span>
            </button>
          </div>

          {/* Experiences Table (desktop) */}
          <div className="hidden sm:block bg-white border border-warm-gray rounded-3xl overflow-hidden shadow-card">
            {loadingExperiences ? (
              <div className="text-center py-12 text-stone text-xs">Loading experiences...</div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-16 text-stone">
                <Sparkles className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone/40" />
                <p className="text-sm font-medium text-ink">No experiences registered</p>
                <p className="text-xs mt-1">Create experience nodes to enrich your AI recommendations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-sand text-stone uppercase font-bold tracking-wider border-b border-warm-gray">
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Experience Node</th>
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Icon</th>
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Budget Target</th>
                      <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Duration</th>
                      <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Featured</th>
                      <th className="py-4 px-6 text-right text-[10px] font-mono tracking-[0.25em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray/60">
                    {filteredExperiences.map((exp) => (
                      <tr key={exp.id} className="hover:bg-cream/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {exp.featuredImage ? (
                              <img
                                src={exp.featuredImage}
                                alt={exp.name}
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 rounded-lg object-cover border border-warm-gray shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center shrink-0 border border-warm-gray">
                                <Sparkles className="w-4 h-4 text-stone" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-ink text-sm">{exp.name}</p>
                              <p className="text-[10px] text-stone mt-0.5 font-mono">{exp.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-gold text-xs">
                          {exp.icon || 'Sparkles'}
                        </td>
                        <td className="py-4 px-6 font-medium text-muted font-mono text-[11px]">
                          {exp.estimatedBudget ? formatINR(exp.estimatedBudget) : 'Flexible'}
                        </td>
                        <td className="py-4 px-6 text-stone">
                          {exp.durationRange || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {exp.featured ? (
                            <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[9px] font-bold">YES</span>
                          ) : (
                            <span className="text-stone/40">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditExpForm(exp)}
                            className="w-11 h-11 rounded-lg bg-cream/30 text-stone hover:bg-gold hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-warm-gray/60 touch-action-manipulation select-none"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                    <button
                      onClick={() => handleDeleteExpClick(exp.id, exp.name)}
                      className="w-11 h-11 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-red-200 touch-action-manipulation select-none"
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

          {/* Experiences Card List (mobile) */}
          <div className="sm:hidden space-y-3">
            {loadingExperiences ? (
              <div className="text-center py-12 text-stone text-xs">Loading experiences...</div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-12 text-stone">
                <Sparkles className="w-10 h-10 mx-auto stroke-[1.2] mb-2 text-stone/40" />
                <p className="text-sm font-medium text-ink">No experiences registered</p>
              </div>
            ) : (
              filteredExperiences.map((exp) => (
                <div key={exp.id} className="bg-white border border-warm-gray rounded-2xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    {exp.featuredImage ? (
                      <img
                        src={exp.featuredImage}
                        alt={exp.name}
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 rounded-xl object-cover border border-warm-gray shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center shrink-0 border border-warm-gray">
                        <Sparkles className="w-5 h-5 text-stone" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm truncate">{exp.name}</p>
                      <p className="text-[10px] text-stone mt-0.5 font-mono truncate">{exp.slug}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] text-muted">{exp.estimatedBudget ? formatINR(exp.estimatedBudget) : 'Flexible'}</span>
                        <span className="text-[10px] text-stone">{exp.durationRange || ''}</span>
                        {exp.featured && (
                          <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[9px] font-bold">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => openEditExpForm(exp)}
                      className="w-11 h-11 rounded-lg bg-cream/30 text-stone hover:bg-gold hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-warm-gray/60"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpClick(exp.id, exp.name)}
                      className="w-11 h-11 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center justify-center border border-red-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Destination Form Slider Overlay */}
      {isDestFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div onClick={() => setIsDestFormOpen(false)} className="absolute inset-0" />
          <div className="relative w-full sm:max-w-2xl bg-warm-white border-l border-warm-gray shadow-elevated h-full flex flex-col p-4 sm:p-6 overflow-y-auto overscroll-behavior-contain [-webkit-overflow-scrolling]:touch">
            
            <div className="flex items-start justify-between pb-4 border-b border-warm-gray mb-6">
              <div>
                <h3 className="text-xl font-light font-display lowercase tracking-tight text-gold">
                  {editingDest ? 'edit destination' : 'new destination'}
                </h3>
                <p className="text-[10px] text-stone font-mono uppercase tracking-[0.25em] mt-1">
                  destination content model
                </p>
              </div>
              <button
                onClick={() => setIsDestFormOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-cream/30 hover:bg-cream text-stone hover:text-ink transition-all cursor-pointer shrink-0 touch-action-manipulation select-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDest} className="space-y-4 sm:space-y-5 flex-1 pb-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varanasi"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Region / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. South Asia"
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varanasi"
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. India"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Budget (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={destPrice}
                    onChange={(e) => setDestPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Guide</label>
                  <input
                    type="text"
                    value={destDuration}
                    onChange={(e) => setDestDuration(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
                  <select
                    value={destDifficulty}
                    onChange={(e) => setDestDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors appearance-none"
                  >
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
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={destLatitude}
                    onChange={(e) => setDestLatitude(Number(e.target.value))}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Longitude *</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={destLongitude}
                    onChange={(e) => setDestLongitude(Number(e.target.value))}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="p-4 bg-cream/30 rounded-2xl border border-warm-gray space-y-4">
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.25em] block">Scores (0-100)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-medium text-stone">Adventure</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destAdventureScore}
                      onChange={(e) => setDestAdventureScore(Number(e.target.value))}
                      className="w-full px-3 py-3 sm:py-2 bg-white border border-warm-gray rounded-lg text-xs text-ink text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-medium text-stone">Culture</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destCulturalScore}
                      onChange={(e) => setDestCulturalScore(Number(e.target.value))}
                      className="w-full px-3 py-3 sm:py-2 bg-white border border-warm-gray rounded-lg text-xs text-ink text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-medium text-stone">Luxury</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destLuxuryScore}
                      onChange={(e) => setDestLuxuryScore(Number(e.target.value))}
                      className="w-full px-3 py-3 sm:py-2 bg-white border border-warm-gray rounded-lg text-xs text-ink text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-medium text-stone">Family</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={destFamilyScore}
                      onChange={(e) => setDestFamilyScore(Number(e.target.value))}
                      className="w-full px-3 py-3 sm:py-2 bg-white border border-warm-gray rounded-lg text-xs text-ink text-center font-medium focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Best Months (commas)</label>
                  <input
                    type="text"
                    value={destBestMonths}
                    onChange={(e) => setDestBestMonths(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Travel Styles (commas)</label>
                  <input
                    type="text"
                    value={destTravelStyles}
                    onChange={(e) => setDestTravelStyles(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Activities (commas)</label>
                  <input
                    type="text"
                    value={destActivities}
                    onChange={(e) => setDestActivities(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Tags (commas)</label>
                  <input
                    type="text"
                    value={destTags}
                    onChange={(e) => setDestTags(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="/images/tours/destination-banner.jpg"
                  value={destBannerImage}
                  onChange={(e) => setDestBannerImage(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Destination description..."
                  value={destDescription}
                  onChange={(e) => setDestDescription(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setDestFeatured(!destFeatured);
                    if (destFeatured) setDestTrending(false);
                  }}
                  className={`flex-1 py-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-[0.18em] text-center transition-all cursor-pointer touch-action-manipulation select-none ${
                    destFeatured ? 'bg-ocean/10 border-ocean text-ocean' : 'bg-white border-warm-gray text-stone'
                  }`}
                >
                  featured
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestTrending(!destTrending);
                    if (destTrending) setDestFeatured(false);
                  }}
                  className={`flex-1 py-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-[0.18em] text-center transition-all cursor-pointer touch-action-manipulation select-none ${
                    destTrending ? 'bg-gold/10 border-gold text-gold' : 'bg-white border-warm-gray text-stone'
                  }`}
                >
                  trending
                </button>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsDestFormOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white border border-warm-gray text-stone hover:bg-cream/30 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center touch-action-manipulation select-none"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gold text-white hover:bg-gold-light text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center shadow-md"
                >
                  save destination
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Experience Form Slider Overlay */}
      {isExpFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div onClick={() => setIsExpFormOpen(false)} className="absolute inset-0" />
          <div className="relative w-full sm:max-w-xl bg-warm-white border-l border-warm-gray shadow-elevated h-full flex flex-col p-4 sm:p-6 overflow-y-auto overscroll-behavior-contain [-webkit-overflow-scrolling]:touch">
            
            <div className="flex items-start justify-between pb-4 border-b border-warm-gray mb-6">
              <div>
                <h3 className="text-xl font-light font-display lowercase tracking-tight text-gold">
                  {editingExp ? 'edit experience' : 'new experience'}
                </h3>
                <p className="text-[10px] text-stone font-mono uppercase tracking-[0.25em] mt-1">
                  experience content model
                </p>
              </div>
              <button
                onClick={() => setIsExpFormOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-cream/30 hover:bg-cream text-stone hover:text-ink transition-all cursor-pointer shrink-0 touch-action-manipulation select-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4 sm:space-y-5 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Experience Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Himalayan Trek"
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Icon Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mountain, Compass"
                    value={expIcon}
                    onChange={(e) => setExpIcon(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Target Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={expEstimatedBudget}
                    onChange={(e) => setExpEstimatedBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Duration Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 days"
                    value={expDurationRange}
                    onChange={(e) => setExpDurationRange(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Difficulty Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced"
                    value={expDifficultyLevel}
                    onChange={(e) => setExpDifficultyLevel(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Connected Styles (commas)</label>
                  <input
                    type="text"
                    placeholder="Adventure, Wildlife"
                    value={expTravelStyles}
                    onChange={(e) => setExpTravelStyles(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Search Tags (commas)</label>
                  <input
                    type="text"
                    placeholder="Winter, Sports"
                    value={expTags}
                    onChange={(e) => setExpTags(e.target.value)}
                    className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Featured Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="/images/cat-adventure.jpg"
                  value={expFeaturedImage}
                  onChange={(e) => setExpFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone uppercase tracking-[0.25em]">Description</label>
                <textarea
                  rows={4}
                  placeholder="Experience description..."
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 bg-white border border-warm-gray rounded-xl text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="expFeatured"
                  checked={expFeatured}
                  onChange={(e) => setExpFeatured(e.target.checked)}
                  className="w-4 h-4 border border-warm-gray rounded bg-white text-gold focus:ring-0 cursor-pointer"
                />
                <label htmlFor="expFeatured" className="text-xs text-ink font-medium select-none cursor-pointer">
                  Feature this experience on the landing page
                </label>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsExpFormOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white border border-warm-gray text-stone hover:bg-cream/30 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center touch-action-manipulation select-none"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gold text-white hover:bg-gold-light text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer text-center shadow-md"
                >
                  save experience
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
