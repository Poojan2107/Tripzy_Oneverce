"use client";
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { STORIES } from './data';
import { Tour } from '../../types';
import SafeImage from '../ui/SafeImage';

interface TravelerStoriesProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

function StoryCard({ story, index, onClick }: { story: any; index: number; onClick: () => void }) {
  const tilt = useMemo(() => {
    // Generate stable values based on the story title and index to avoid hydration warnings
    const seed = (story.title || "") + "-" + index;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const rand1 = Math.abs(Math.sin(hash)) * 10000 % 1;
    const rand2 = Math.abs(Math.cos(hash)) * 10000 % 1;
    return {
      rotate: parseFloat(((rand1 - 0.5) * 3).toFixed(2)),
      y: parseFloat((rand2 * 8).toFixed(2)),
    };
  }, [story.title, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer shrink-0 w-[290px] md:w-auto"
      onClick={onClick}
    >
      <motion.div
        className="bg-surface border border-border shadow-card rounded-3xl p-5 pb-6"
        style={{ transform: `rotate(${tilt.rotate}deg)`, marginTop: `${tilt.y}px` }}
        whileHover={{ rotate: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        suppressHydrationWarning
      >
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary-surface mb-4">
          <SafeImage src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-2 px-0.5">
          <span className="text-[8px] font-mono text-coral uppercase tracking-widest block font-bold">{story.location}</span>
          <h3 className="font-display text-lg text-night font-medium lowercase leading-tight group-hover:text-coral transition-colors line-clamp-2">{story.title}</h3>
          <p className="text-[11px] text-muted/90 font-light leading-relaxed font-sans line-clamp-3">{story.excerpt}</p>
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
            <SafeImage src={story.avatar} alt={story.author} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-night/70">{story.author}</span>
            <span className="ml-auto text-[8px] text-muted/50">· {story.readTime}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TravelerStories({ tours, onSelectTour }: TravelerStoriesProps) {
  const findTourForStory = (story: any) => {
    return tours.find(t =>
      story.title.toLowerCase().includes(t.title.toLowerCase()) ||
      t.location.toLowerCase().includes(typeof story.location === 'string' ? story.location.split(',')[0]?.toLowerCase() || '' : '')
    );
  };

  const dynamicStories = useMemo(() => {
    const allReviews = tours.flatMap((t) =>
      (t.reviews || []).map((r) => ({
        title: `Journey through ${t.title}`,
        excerpt: r.comment,
        image: t.bannerImage,
        author: r.author,
        location: t.location,
        avatar: r.avatar || "/images/avatar-priya.jpg",
        readTime: "4 min"
      }))
    );
    const combined = [...allReviews, ...STORIES];
    const uniqueStories = combined.filter((story, index, self) =>
      index === self.findIndex((s) => s.title === story.title)
    );
    return uniqueStories.slice(0, 6);
  }, [tours]);

  return (
    <section className="py-20 md:py-28 bg-[#FFFDF9] border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <motion.div
          className="mb-12 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">chronicles of movement</span>
          <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
            traveler <em className="italic font-light text-gold">stories</em>
          </h2>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 scroll-snap-x">
          {dynamicStories.map((story, i) => (
            <StoryCard
              key={story.title + "-" + i}
              story={story}
              index={i}
              onClick={() => { const matched = findTourForStory(story); if (matched) onSelectTour(matched); }}
            />
          ))}
        </div>

        {/* Desktop: masonry polaroid columns */}
        <div className="hidden md:block columns-2 lg:columns-3 gap-6 space-y-6">
          {dynamicStories.map((story, i) => (
            <div key={story.title + "-" + i} className="break-inside-avoid">
              <StoryCard
                story={story}
                index={i}
                onClick={() => { const matched = findTourForStory(story); if (matched) onSelectTour(matched); }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
