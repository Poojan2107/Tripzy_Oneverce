import React from 'react';
import Image from 'next/image';
import { Search, MapPin, Navigation, Edit3, Trash2, Plus } from 'lucide-react';
import { Tour } from '../../types';
import { formatINR } from '../../utils/currency';

interface AdminDestinationsTabProps {
  tours: Tour[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string, name: string) => void;
  onCreate: () => void;
  onStatusChange: (id: string, status: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
}

export default function AdminDestinationsTab({ tours, searchTerm, onSearchChange, onEdit, onDelete, onCreate, onStatusChange }: AdminDestinationsTabProps) {
  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            type="text"
            placeholder="Search destinations by name or country..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-border text-base text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
          />
        </div>
        <button
          onClick={onCreate}
          className="px-5 py-3 sm:py-2.5 btn-night text-micro font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-action-manipulation select-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="hidden sm:block bg-white border border-border rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-background text-stone uppercase font-bold tracking-wider border-b border-border">
                <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Destination</th>
                <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Location</th>
                <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Coordinates</th>
                <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Attributes</th>
                <th className="py-4 px-6 text-micro font-mono tracking-[0.25em]">Status</th>
                <th className="py-4 px-6 text-right text-micro font-mono tracking-[0.25em]">Budget Guide</th>
                <th className="py-4 px-6 text-right text-micro font-mono tracking-[0.25em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((tour) => (
                <tr key={tour.id} className="hover:bg-secondary-surface/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Image src={tour.bannerImage} alt={tour.title} width={48} height={48} className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" />
                      <div>
                        <p className="font-medium text-night text-sm">{tour.title}</p>
                        <p className="text-micro text-stone mt-0.5">{tour.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-stone">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone" />
                      <span>{tour.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-micro text-stone">
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
                        <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-micro font-bold uppercase">Trending</span>
                      )}
                      {tour.category === 'popular' && (
                        <span className="bg-teal/10 text-teal border border-teal/20 px-2 py-0.5 rounded text-micro font-bold uppercase">Featured</span>
                      )}
                      <span className="bg-secondary-surface/30 text-stone px-2 py-0.5 rounded text-micro font-medium">{tour.difficulty}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={tour.status || 'DRAFT'}
                      onChange={(e) => onStatusChange(tour.id, e.target.value as any)}
                      className="bg-background border border-border rounded-lg px-2 py-1 text-micro font-mono text-night uppercase"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="REVIEW">Review</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-night font-mono text-small">{formatINR(tour.price)}</td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => onEdit(tour)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer touch-action-manipulation select-none" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(tour.id, tour.title)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer touch-action-manipulation select-none" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((tour) => (
          <div key={tour.id} className="bg-white border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-start gap-3">
              <Image src={tour.bannerImage} alt={tour.title} width={64} height={64} className="w-16 h-16 rounded-xl object-cover border border-border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-night text-sm truncate">{tour.title}</p>
                <p className="text-micro text-stone mt-0.5 truncate">{tour.location}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {tour.category === 'trending' && <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-micro font-bold uppercase">Trending</span>}
                  {tour.category === 'popular' && <span className="bg-teal/10 text-teal border border-teal/20 px-2 py-0.5 rounded text-micro font-bold uppercase">Featured</span>}
                  <span className="bg-secondary-surface/30 text-stone px-2 py-0.5 rounded text-micro font-medium">{tour.difficulty}</span>
                  <span className="bg-night/5 text-night border border-night/10 px-2 py-0.5 rounded text-micro font-bold uppercase">{tour.status || 'DRAFT'}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-night text-sm">{formatINR(tour.price)}</p>
                <p className="text-micro text-stone mt-0.5">{tour.duration}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/60">
              {tour.latitude && tour.longitude ? (
                <span className="text-micro text-stone font-mono flex items-center gap-1"><Navigation className="w-3 h-3 text-gold" />{tour.latitude.toFixed(2)}, {tour.longitude.toFixed(2)}</span>
              ) : (
                <span className="text-micro text-red-400">No coords</span>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={() => onEdit(tour)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer" title="Edit">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete(tour.id, tour.title)} className="w-11 h-11 btn-ghost inline-flex items-center justify-center active:scale-95 cursor-pointer" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
