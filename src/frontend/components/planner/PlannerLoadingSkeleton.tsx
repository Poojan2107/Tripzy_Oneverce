"use client";
import { motion } from 'framer-motion';

export default function PlannerLoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 space-y-12 py-12">
      {/* 1. Journey Hero Skeleton */}
      <div className="bg-surface border border-border/50 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-border/15">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-border/40 rounded animate-pulse" />
            <div className="h-8 w-64 bg-border/60 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-border/40 rounded-sm animate-pulse" />
              <div className="h-6 w-16 bg-border/40 rounded-sm animate-pulse" />
              <div className="h-6 w-20 bg-border/40 rounded-sm animate-pulse" />
            </div>
          </div>
          <div className="h-11 w-32 bg-border/40 rounded-md animate-pulse" />
        </div>
        <div className="h-4 w-full bg-border/30 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-border/30 rounded animate-pulse" />
      </div>

      {/* 2. Story Timeline Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-32 bg-border/40 rounded animate-pulse" />
          <div className="h-px flex-1 bg-border/20" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 w-16 bg-border/40 rounded-md animate-pulse shrink-0" />
          ))}
        </div>

        <div className="bg-surface border border-border/50 rounded-lg p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-border/40 rounded animate-pulse" />
            <div className="h-7 w-48 bg-border/60 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-border/30 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-border/30 rounded animate-pulse" />
          
          <div className="relative pl-6 border-l border-border mt-6 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-border/40 animate-pulse" />
                <div className="bg-border/20 h-16 rounded-md animate-pulse w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Route Map Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-border/40 rounded animate-pulse" />
          <div className="h-px flex-1 bg-border/20" />
        </div>
        <div className="bg-surface border border-border/50 rounded-lg h-44 w-full animate-pulse" />
      </div>

      {/* 4. Metrics & Pass Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border/50 rounded-3xl p-6 space-y-6">
          <div className="h-6 w-32 bg-border/40 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-border/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="bg-night rounded-3xl p-6 space-y-6">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-white/10 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}