"use client";
import { useMemo } from 'react';
import { STORIES } from './data';
import { Tour } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';
import SafeImage from '../ui/SafeImage';

interface TravelerStoriesProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
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
    <section className="py-16 md:py-24 bg-white border-t border-warm-gray/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <ScrollReveal>
          <div className="mb-12 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-coral block mb-2 font-bold">chronicles of movement</span>
            <h2 className="font-display text-4xl sm:text-5xl text-night lowercase font-light tracking-[-0.03em]">
              traveler <em className="italic font-light text-gold">stories</em>
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicStories.map((story, i) => (
            <ScrollReveal key={story.title + "-" + i} delay={(i % 3) as 0 | 1 | 2}>
              <div role="button" tabIndex={0} onClick={() => { const matched = findTourForStory(story); if (matched) onSelectTour(matched); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const matched = findTourForStory(story); if (matched) onSelectTour(matched); } }}
                className="flex flex-col space-y-4 cursor-pointer group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-warm-gray/30 bg-cream">
                  <SafeImage src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" />
                  <span className="absolute bottom-3 left-4 text-[8px] font-mono text-white bg-black/45 px-2 py-0.5 rounded-full uppercase tracking-widest">{story.readTime} read</span>
                </div>
                <div className="space-y-2 text-left">
                  <span className="text-[8px] font-mono text-coral uppercase tracking-widest block">{story.location}</span>
                  <h3 className="font-display text-2xl text-night font-light lowercase group-hover:text-coral transition-colors">{story.title}</h3>
                  <p className="text-xs text-muted/90 leading-relaxed font-light font-sans">{story.excerpt}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-warm-gray/30">
                    <SafeImage src={story.avatar} alt={story.author} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-night/80">{story.author}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
