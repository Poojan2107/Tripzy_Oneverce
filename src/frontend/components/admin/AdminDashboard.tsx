"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, MapPin, Sparkles, BookOpen, Search, Eye, Compass, Brain, DollarSign, Calendar,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  metrics: any;
  loadingMetrics: boolean;
}

export default function AdminDashboard({ metrics, loadingMetrics }: AdminDashboardProps) {
  if (loadingMetrics) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-stone">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-micro sm:text-micro font-mono uppercase tracking-[0.25em]">loading analytics...</p>
      </div>
    );
  }

  const { totals } = metrics || {};

  const dailyData = metrics?.dailyTrends?.labels?.map((label: string, i: number) => ({
    date: label.slice(5),
    Views: metrics.dailyTrends.views[i],
    Searches: metrics.dailyTrends.searches[i],
  })) || [];

  const budgetData = ['Small', 'Medium', 'Luxury'].map(tier => {
    const found = metrics?.planning?.budgets?.find((b: any) => b.tier === tier);
    return { tier, count: found ? found.count : 0 };
  });

  return (
    <div className="space-y-8">
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
        {[
          { label: 'Users', icon: Users, value: totals?.users || 0, suffix: `${totals?.admins || 0} admins`, color: 'bg-gold/10 text-gold' },
          { label: 'Destinations', icon: MapPin, value: totals?.destinations || 0, color: 'bg-teal/10 text-teal' },
          { label: 'Experiences', icon: Sparkles, value: totals?.experiences || 0, color: 'bg-sage/10 text-sage' },
          { label: 'Saved Itineraries', icon: BookOpen, value: totals?.savedItineraries || 0, color: 'bg-coral/10 text-coral' },
          { label: 'Searches', icon: Search, value: totals?.searches || 0, color: 'bg-gold/10 text-gold' },
          { label: 'Views', icon: Eye, value: totals?.views || 0, color: 'bg-teal/10 text-teal' },
          { label: 'AI Plans', icon: Compass, value: totals?.planners || 0, color: 'bg-sage/10 text-sage' },
          { label: 'Recs', icon: Brain, value: totals?.recommendations || 0, color: 'bg-coral/10 text-coral' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } } }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 shadow-card relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-micro sm:text-micro font-mono font-bold text-stone uppercase tracking-[0.25em] truncate max-w-[60%]">{card.label}</span>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${card.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-light font-display tracking-tight text-night mt-2 sm:mt-3">
                {(card.value as number).toLocaleString()}
              </p>
              {card.suffix && <p className="text-micro font-mono text-stone/50 mt-0.5">{card.suffix}</p>}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-stone">Daily Activity (Last 7 Days)</h3>
          <Eye className="w-4 h-4 text-gold" />
        </div>
        {dailyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e5e5' }} />
                <Line type="monotone" dataKey="Views" stroke="#c8a66b" strokeWidth={2} dot={{ r: 3, fill: '#c8a66b' }} />
                <Line type="monotone" dataKey="Searches" stroke="#6b8e7b" strokeWidth={2} dot={{ r: 3, fill: '#6b8e7b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-stone py-8 text-center">No activity in the last 7 days.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-stone">Top Search Queries</h3>
            <Search className="w-4 h-4 text-gold" />
          </div>
          <div className="space-y-2">
            {!metrics?.searchTrends || metrics.searchTrends.length === 0 ? (
              <p className="text-xs text-stone py-6 text-center">No searches tracked yet.</p>
            ) : (
              metrics.searchTrends.map((s: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-secondary-surface/30 px-3 py-2.5 rounded-xl border border-border/60">
                  <span className="font-medium text-night">"{s.query}"</span>
                  <span className="font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md text-micro font-mono">{s.count} hits</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-stone">Most Viewed Destinations</h3>
            <Eye className="w-4 h-4 text-teal" />
          </div>
          <div className="space-y-2">
            {!metrics?.destinationPopularity || metrics.destinationPopularity.length === 0 ? (
              <p className="text-xs text-stone py-6 text-center">No views logged yet.</p>
            ) : (
              metrics.destinationPopularity.map((d: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-secondary-surface/30 px-3 py-2.5 rounded-xl border border-border/60">
                  <span className="font-medium text-night">{d.name}</span>
                  <span className="font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-md text-micro font-mono">{d.count} views</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-3xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border border-b">
            <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-stone">AI Recommendation Favorites</h3>
            <Brain className="w-4 h-4 text-sage" />
          </div>
          <div className="space-y-2">
            {!metrics?.recommendationPopularity || metrics.recommendationPopularity.length === 0 ? (
              <p className="text-xs text-stone py-6 text-center">No recommendations tracked yet.</p>
            ) : (
              metrics.recommendationPopularity.map((r: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-secondary-surface/30 px-3 py-2.5 rounded-xl border border-border/60">
                  <span className="font-medium text-night">{r.name}</span>
                  <span className="font-bold text-sage bg-sage/10 px-2 py-0.5 rounded-md text-micro font-mono">{r.count} times</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-warm-white/70 border border-border p-5 sm:p-6 rounded-3xl">
        <div>
          <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-night mb-4 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-gold" />
            Budget Selections Breakdown
          </h3>
          {budgetData.some(b => b.count > 0) ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e5e5' }} />
                  <Bar dataKey="count" fill="#c8a66b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-stone py-6 text-center">No budget data yet.</p>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-night mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              Average Travel Duration
            </h3>
            <p className="text-3xl font-light font-display text-night">
              {metrics?.planning?.averageDuration || 0} <span className="text-sm font-sans text-stone">days planned per itinerary</span>
            </p>
          </div>
          <div>
            <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-stone mb-2.5">Top Requested Travel Styles</h3>
            <div className="flex flex-wrap gap-2">
              {!metrics?.planning?.travelStyles || metrics.planning.travelStyles.length === 0 ? (
                <span className="text-xs text-stone">None yet</span>
              ) : (
                metrics.planning.travelStyles.map((ts: any, idx: number) => (
                  <span key={idx} className="bg-secondary-surface/30 border border-border/60 px-3 py-1 rounded-full text-xs font-medium text-night flex items-center gap-1">
                    {ts.style} <span className="text-micro text-stone">({ts.count})</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-micro font-mono font-bold uppercase tracking-[0.25em] text-night flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold" />
            AI Recommendation Feedback
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center bg-secondary-surface/30 p-2.5 rounded-xl border border-border/60">
              <span className="text-stone">Recommendation CTR</span>
              <span className="font-bold text-gold">{metrics?.feedback?.ctr || 0}%</span>
            </div>
            <div className="flex justify-between items-center bg-secondary-surface/30 p-2.5 rounded-xl border border-border/60">
              <span className="text-stone">Helpful Rating (👍)</span>
              <span className="font-bold text-night">{metrics?.feedback?.helpful || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-secondary-surface/30 p-2.5 rounded-xl border border-border/60">
              <span className="text-stone">Not Relevant Rating (👎)</span>
              <span className="font-bold text-red-500">{metrics?.feedback?.notRelevant || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-secondary-surface/30 p-2.5 rounded-xl border border-border/60">
              <span className="text-stone">Saves from Recs</span>
              <span className="font-bold text-sage">{metrics?.feedback?.saved || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-secondary-surface/30 p-2.5 rounded-xl border border-border/60">
              <span className="text-stone">Plans from Recs</span>
              <span className="font-bold text-teal">{metrics?.feedback?.plans || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
