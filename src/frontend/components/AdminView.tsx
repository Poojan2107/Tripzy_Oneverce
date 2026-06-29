"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Users, MapPin, Sparkles,
  Brain, BookOpen, MessageCircle, Heart, Shield, Mail, Calendar, Clock, Star, Navigation
} from 'lucide-react';
import { Tour } from '../types';
import { formatINR, EXCHANGE_RATE } from '../utils/currency';
import { getDashboardMetrics } from '../../backend/actions/analyticsActions';
import { getAdminUsers } from '../../backend/actions/adminActions';
import {
  createDestination, updateDestination, deleteDestination,
  createExperience, updateExperience, deleteExperience,
  getAllExperiences
} from '../../backend/actions/tourActions';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminDestinationsTab from './admin/AdminDestinationsTab';
import AdminExperiencesTab from './admin/AdminExperiencesTab';
import DestinationForm from './admin/DestinationForm';
import ExperienceForm from './admin/ExperienceForm';

interface ExperienceItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featuredImage: string | null;
  icon: string | null;
  travelStyles: any;
  estimatedBudget: number | null;
  durationRange: string | null;
  difficultyLevel: string | null;
  tags: any;
  featured: boolean;
}

interface AdminViewProps {
  tours: Tour[];
  wishlistCount: number;
  onAddTour: (tour: Tour) => void;
  onUpdateTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
}

const INIT_DEST_STATE = {
  name: '', country: '', city: '', region: 'North India', description: '',
  price: 1500, duration: '7 Days, 6 Nights', difficulty: 'Moderate' as 'Easy' | 'Moderate' | 'Challenging' | 'Expert',
  groupSize: 'Max 6 travelers', featured: false, trending: false,
  latitude: 20.5937, longitude: 78.9629,
  adventureScore: 70, culturalScore: 80, luxuryScore: 90, familyScore: 60,
  bestMonths: 'May, June, September', travelStyles: 'Luxury, Cultural',
  activities: 'Sightseeing, Local Dining, Museum tours', tags: 'Historic, High-end',
  bannerImage: '/images/tours/varanasi-banner.jpg',
};

const INIT_EXP_STATE = {
  name: '', icon: 'Sparkles', description: '', featuredImage: '/images/cat-adventure.jpg',
  travelStyles: 'Adventure, Luxury', estimatedBudget: 0, durationRange: '5-8 days',
  difficultyLevel: 'Moderate', tags: 'Exclusive, Nature', featured: false,
};

export default function AdminView({ tours, wishlistCount, onAddTour, onUpdateTour, onDeleteTour }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'destinations' | 'experiences' | 'users'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [isDestFormOpen, setIsDestFormOpen] = useState(false);
  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Tour | null>(null);
  const [editingExp, setEditingExp] = useState<any | null>(null);

  const [dest, setDest] = useState(INIT_DEST_STATE);
  const [exp, setExp] = useState(INIT_EXP_STATE);

  const loadData = useCallback(async () => {
    try { setLoadingMetrics(true); const r = await getDashboardMetrics(); if (r.success) setMetrics(r.data); } catch (e) { console.error("[admin] Failed to load dashboard metrics:", e); } finally { setLoadingMetrics(false); }
    try { setLoadingExperiences(true); const r = await getAllExperiences(); if (r.success && r.data) setExperiences(r.data as any); } catch (e) { console.error("[admin] Failed to load experiences:", e); } finally { setLoadingExperiences(false); }
    try { setLoadingUsers(true); const r = await getAdminUsers(); if (r.success) setUsers(r.data); } catch (e) { console.error("[admin] Failed to load users:", e); } finally { setLoadingUsers(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => {
    document.body.style.overflow = (isDestFormOpen || isExpFormOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDestFormOpen, isExpFormOpen]);

  const openCreateDestForm = () => {
    setEditingDest(null); setDest(INIT_DEST_STATE); setIsDestFormOpen(true);
  };

  const openEditDestForm = (tour: Tour) => {
    const loc = tour.location.split(',');
    setEditingDest(tour);
    setDest({
      name: tour.title, city: loc[0]?.trim() || '', country: loc[1]?.trim() || '',
      region: tour.tags?.[0] || 'Global', description: tour.description,
      price: Math.round(tour.price * EXCHANGE_RATE), duration: tour.duration,
      difficulty: tour.difficulty, groupSize: tour.groupSize,
      featured: tour.category === 'popular', trending: tour.category === 'trending',
      latitude: tour.latitude || 0, longitude: tour.longitude || 0,
      adventureScore: 70, culturalScore: 75, luxuryScore: 60, familyScore: 50,
      bestMonths: 'October, November, December', travelStyles: 'Cultural, Adventure',
      activities: 'Guided walks, Local dining, Photography', tags: 'Historic, Scenic',
      bannerImage: tour.bannerImage,
    });
    setIsDestFormOpen(true);
  };

  const openCreateExpForm = () => {
    setEditingExp(null); setExp(INIT_EXP_STATE); setIsExpFormOpen(true);
  };

  const openEditExpForm = (e: any) => {
    const stylesArr = Array.isArray(e.travelStyles) ? e.travelStyles : [];
    const tagsArr = Array.isArray(e.tags) ? e.tags : [];
    setEditingExp(e);
    setExp({
      name: e.name, icon: e.icon || 'Sparkles', description: e.description || '',
      featuredImage: e.featuredImage || '', travelStyles: stylesArr.join(', '),
      estimatedBudget: Math.round((e.estimatedBudget || 2000) * EXCHANGE_RATE),
      durationRange: e.durationRange || '5 days', difficultyLevel: e.difficultyLevel || 'Moderate',
      tags: tagsArr.join(', '), featured: e.featured,
    });
    setIsExpFormOpen(true);
  };

  const handleSaveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dest.name || !dest.city || !dest.country || !dest.bannerImage) { alert("Please fill in all required fields."); return; }
    const payload = {
      name: dest.name, slug: dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      country: dest.country, city: dest.city, region: dest.region,
      description: dest.description, images: [dest.bannerImage],
      metadata: {
        subtitle: `${dest.city} Boutique Experience`,
        itinerary: [{ day: 1, title: "Grand Arrival & Private Dinner", description: "Arrive at the retreat.", activities: ["Airport Transfer", "Elite Dining"] }],
        includedServices: [{ name: "5-Star Boutique Lodging", iconName: "Hotel" }, { name: "VIP Concierge Host", iconName: "UserCheck" }]
      },
      price: Math.round(Number(dest.price) / EXCHANGE_RATE), duration: dest.duration,
      difficulty: dest.difficulty, groupSize: dest.groupSize,
      featured: dest.featured, trending: dest.trending,
      latitude: Number(dest.latitude), longitude: Number(dest.longitude),
      adventureScore: Number(dest.adventureScore), culturalScore: Number(dest.culturalScore),
      luxuryScore: Number(dest.luxuryScore), familyScore: Number(dest.familyScore),
      bestMonths: dest.bestMonths.split(',').map(m => m.trim()).filter(Boolean),
      travelStyles: dest.travelStyles.split(',').map(s => s.trim()).filter(Boolean),
      activities: dest.activities.split(',').map(a => a.trim()).filter(Boolean),
      tags: dest.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      const res = editingDest ? await updateDestination(editingDest.id, payload) : await createDestination(payload);
      if (res.success && res.data) {
        const tour: Tour = {
          id: res.data.id, title: res.data.name, subtitle: (res.data.metadata as any)?.subtitle || res.data.description.slice(0, 80) + '...',
          description: res.data.description, category: (res.data.trending ? 'trending' : res.data.featured ? 'popular' : 'international') as any,
          duration: res.data.duration || '5 Days', rating: 4.8, reviewsCount: 0,
          price: res.data.price || 1500, location: `${res.data.city}, ${res.data.country}`,
          groupSize: res.data.groupSize || 'Max 6', difficulty: (res.data.difficulty || 'Moderate') as any,
          bannerImage: (res.data.images as string[])?.[0] || dest.bannerImage,
          images: (res.data.images as string[]) || [],
          itinerary: (res.data.metadata as any)?.itinerary || [], reviews: [],
          includedServices: (res.data.metadata as any)?.includedServices || [],
          tags: (res.data.tags as string[]) || [], moods: [], bestSeason: undefined,
          latitude: res.data.latitude || undefined, longitude: res.data.longitude || undefined,
        };
        editingDest ? onUpdateTour(tour) : onAddTour(tour);
        alert(editingDest ? "Destination updated successfully." : "Destination created.");
      } else { alert("Error: " + res.error); }
      setIsDestFormOpen(false); loadData();
    } catch (err: any) { console.error(err); alert("Database mutation failed."); }
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exp.name || !exp.featuredImage) { alert("Please fill in required fields."); return; }
    const payload = {
      name: exp.name, slug: exp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: exp.description, featuredImage: exp.featuredImage, icon: exp.icon,
      travelStyles: exp.travelStyles.split(',').map(s => s.trim()).filter(Boolean),
      estimatedBudget: Math.round(Number(exp.estimatedBudget) / EXCHANGE_RATE),
      durationRange: exp.durationRange, difficultyLevel: exp.difficultyLevel,
      tags: exp.tags.split(',').map(t => t.trim()).filter(Boolean), featured: exp.featured,
    };
    try {
      const res = editingExp ? await updateExperience(editingExp.id, payload) : await createExperience(payload);
      if (res.success) { alert("Experience saved successfully!"); } else { alert("Error: " + res.error); }
      setIsExpFormOpen(false); loadData();
    } catch (err: any) { console.error(err); alert("Failed to save experience."); }
  };

  const handleDeleteDest = async (id: string, name: string) => {
    if (confirm(`Permanently delete "${name}"?`)) {
      try { const r = await deleteDestination(id); if (r.success) { onDeleteTour(id); loadData(); } else alert("Delete failed: " + r.error); } catch { alert("Failed to delete."); }
    }
  };

  const handleDeleteExp = async (id: string, name: string) => {
    if (confirm(`Delete experience "${name}"?`)) {
      try { const r = await deleteExperience(id); if (r.success) loadData(); else alert("Delete failed: " + r.error); } catch { alert("Failed to delete."); }
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Analytics', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'experiences', label: 'Experiences', icon: Sparkles },
  ] as const;

  return (
    <div className="w-full min-h-dvh bg-sand pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans antialiased [-webkit-tap-highlight-color]:transparent selection:bg-gold/20 selection:text-ink">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-warm-gray">
        <div>
          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.25em] bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">admin panel</span>
          <h1 className="text-3xl font-light font-display lowercase tracking-tight text-ink mt-3">travebie admin</h1>
          <p className="text-xs text-stone mt-1">Manage destinations, experiences, and view analytics</p>
        </div>
        <div className="relative flex bg-white border border-warm-gray p-1 rounded-2xl shadow-soft self-stretch md:self-auto overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }} className={`relative px-3 sm:px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 whitespace-nowrap touch-action-manipulation select-none min-h-[44px] transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-stone hover:text-ink hover:bg-cream/30'}`}>
                {activeTab === tab.id && (
                  <motion.div layoutId="adminTabActive" className="absolute inset-0 bg-gold rounded-xl shadow-md shadow-gold/20" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-1.5"><Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <AdminDashboard metrics={metrics} loadingMetrics={loadingMetrics} />
          </motion.div>
        )}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <AdminUsersTab users={users} loadingUsers={loadingUsers} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </motion.div>
        )}
        {activeTab === 'destinations' && (
          <motion.div key="destinations" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <AdminDestinationsTab tours={tours} searchTerm={searchTerm} onSearchChange={setSearchTerm} onEdit={openEditDestForm} onDelete={handleDeleteDest} onCreate={openCreateDestForm} />
          </motion.div>
        )}
        {activeTab === 'experiences' && (
          <motion.div key="experiences" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <AdminExperiencesTab experiences={experiences} loadingExperiences={loadingExperiences} searchTerm={searchTerm} onSearchChange={setSearchTerm} onEdit={openEditExpForm} onDelete={handleDeleteExp} onCreate={openCreateExpForm} />
          </motion.div>
        )}
      </AnimatePresence>

      <DestinationForm
        state={{ isOpen: isDestFormOpen, editingDest, ...dest }}
        actions={{
          setEditingDest, setOpen: setIsDestFormOpen,
          setName: (v) => setDest(p => ({ ...p, name: v })),
          setCountry: (v) => setDest(p => ({ ...p, country: v })),
          setCity: (v) => setDest(p => ({ ...p, city: v })),
          setRegion: (v) => setDest(p => ({ ...p, region: v })),
          setDescription: (v) => setDest(p => ({ ...p, description: v })),
          setPrice: (v) => setDest(p => ({ ...p, price: v })),
          setDuration: (v) => setDest(p => ({ ...p, duration: v })),
          setDifficulty: (v) => setDest(p => ({ ...p, difficulty: v })),
          setGroupSize: (v) => setDest(p => ({ ...p, groupSize: v })),
          setFeatured: (v) => setDest(p => ({ ...p, featured: v })),
          setTrending: (v) => setDest(p => ({ ...p, trending: v })),
          setLatitude: (v) => setDest(p => ({ ...p, latitude: v })),
          setLongitude: (v) => setDest(p => ({ ...p, longitude: v })),
          setAdventureScore: (v) => setDest(p => ({ ...p, adventureScore: v })),
          setCulturalScore: (v) => setDest(p => ({ ...p, culturalScore: v })),
          setLuxuryScore: (v) => setDest(p => ({ ...p, luxuryScore: v })),
          setFamilyScore: (v) => setDest(p => ({ ...p, familyScore: v })),
          setBestMonths: (v) => setDest(p => ({ ...p, bestMonths: v })),
          setTravelStyles: (v) => setDest(p => ({ ...p, travelStyles: v })),
          setActivities: (v) => setDest(p => ({ ...p, activities: v })),
          setTags: (v) => setDest(p => ({ ...p, tags: v })),
          setBannerImage: (v) => setDest(p => ({ ...p, bannerImage: v })),
        }}
        onSubmit={handleSaveDest}
      />

      <ExperienceForm
        state={{ isOpen: isExpFormOpen, editingExp, ...exp }}
        actions={{
          setEditingExp, setOpen: setIsExpFormOpen,
          setName: (v) => setExp(p => ({ ...p, name: v })),
          setIcon: (v) => setExp(p => ({ ...p, icon: v })),
          setDescription: (v) => setExp(p => ({ ...p, description: v })),
          setFeaturedImage: (v) => setExp(p => ({ ...p, featuredImage: v })),
          setTravelStyles: (v) => setExp(p => ({ ...p, travelStyles: v })),
          setEstimatedBudget: (v) => setExp(p => ({ ...p, estimatedBudget: v })),
          setDurationRange: (v) => setExp(p => ({ ...p, durationRange: v })),
          setDifficultyLevel: (v) => setExp(p => ({ ...p, difficultyLevel: v })),
          setTags: (v) => setExp(p => ({ ...p, tags: v })),
          setFeatured: (v) => setExp(p => ({ ...p, featured: v })),
        }}
        onSubmit={handleSaveExp}
      />
    </div>
  );
}
