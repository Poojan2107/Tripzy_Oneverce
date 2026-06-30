"use client";
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Tour } from '../../types';
import { CulturalContext } from './data';

interface StoryTabProps {
  tour: Tour;
  cultural?: CulturalContext;
  accentColor: string;
}

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };

export default function StoryTab({ tour, cultural, accentColor }: StoryTabProps) {
  return (
    <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-section text-night font-light lowercase leading-tight mb-3">{tour.subtitle}</h2>
        {tour.moods && tour.moods.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tour.moods.map((m) => (
              <span key={m} className="px-3 py-1 rounded-sm bg-secondary-surface text-night border border-border text-meta font-bold">{m}</span>
            ))}
          </div>
        )}
      </motion.div>
 
      <motion.div variants={fadeUp} className="border-l-4 pl-6" style={{ borderColor: accentColor }}>
        <p className="text-body text-muted/80 font-light leading-relaxed">{tour.description}</p>
      </motion.div>
 
      {cultural && (
        <motion.div variants={fadeUp} className="p-6 rounded-lg border border-border/70 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            <span className="text-meta font-mono text-muted/60 font-bold">Cultural Context</span>
          </div>
          <h3 className="font-display text-card text-night font-light leading-snug">{cultural.context}</h3>
        </motion.div>
      )}
 
      {(tour.storyHeadline || tour.storyNarrative) && (
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex items-center gap-3">
            {tour.chapterName && <span className="px-2.5 py-1 rounded-sm bg-gold/10 text-gold border border-gold/20 text-meta font-bold">{tour.chapterName}</span>}
            {tour.chapterTitle && <span className="text-meta font-mono text-muted">{tour.chapterTitle}</span>}
          </div>
          <h2 className="font-display text-section text-night font-bold leading-tight">{tour.storyHeadline || 'Chapter Lore'}</h2>
          {tour.storyNarrative && <p className="text-body text-muted/80 font-light leading-relaxed italic border-l-2 border-gold/30 pl-4">"{tour.storyNarrative}"</p>}
        </motion.div>
      )}
 
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tour.localSecret && (
          <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
            <span className="text-meta font-mono text-coral block mb-1.5">Local Secret</span>
            <p className="text-body text-night/70 font-light leading-relaxed">{tour.localSecret}</p>
          </div>
        )}
        {tour.photographySpot && (
          <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
            <span className="text-meta font-mono text-gold block mb-1.5">Best Photo Spot</span>
            <p className="text-body text-night/70 font-light leading-relaxed">{tour.photographySpot}</p>
          </div>
        )}
        {tour.signatureExperience && (
          <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
            <span className="text-meta font-mono text-teal block mb-1.5">Signature Experience</span>
            <p className="text-body text-night/70 font-light leading-relaxed">{tour.signatureExperience}</p>
          </div>
        )}
        {tour.budgetRange && (
          <div className="p-4 rounded-md bg-white border border-border/70 shadow-sm">
            <span className="text-meta font-mono text-teal block mb-1.5">Budget Guide</span>
            <p className="text-body text-night/70 font-light leading-relaxed">{tour.budgetRange}</p>
          </div>
        )}
      </motion.div>
 
      {tour.highlights && tour.highlights.length > 0 && (
        <motion.div variants={fadeUp} className="border-t border-border/15 pt-6">
          <h2 className="font-display text-section text-night font-bold mb-4">Top Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tour.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-md bg-white border border-border/70">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-meta font-bold text-white shrink-0" style={{ backgroundColor: accentColor }}>{i + 1}</span>
                <span className="text-body text-night font-medium">{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
