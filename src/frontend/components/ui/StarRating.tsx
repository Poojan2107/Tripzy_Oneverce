"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

export default function StarRating({ rating, max = 5, size = 'md', interactive = false, onRate, showValue = false }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  const displayRating = interactive ? hovered || rating : rating;

  return (
    <div className={`flex items-center gap-0.5 ${showValue ? 'gap-1.5' : ''}`}>
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.floor(displayRating);
          const half = !filled && starValue - 0.5 <= displayRating && displayRating < starValue;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate?.(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(0)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${sizeMap[size]}`}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${sizeMap[size]} transition-colors ${
                  filled
                    ? 'fill-gold text-gold'
                    : half
                    ? 'fill-gold/30 text-gold/50'
                    : 'fill-transparent text-border'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-meta font-bold text-night">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
