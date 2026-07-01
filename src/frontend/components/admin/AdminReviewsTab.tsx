"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllReviews, updateReviewStatus, deleteReview } from '../../../backend/actions/reviewActions';

export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await getAllReviews(page, 15);
    if (res.success) {
      setReviews(res.data ?? []);
      setTotalPages(res.totalPages ?? 1);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const handleStatus = async (id: string, status: "PENDING" | "APPROVED" | "REJECTED") => {
    await updateReviewStatus(id, status);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
    load();
  };

  if (loading) return <div className="p-8 text-center text-muted/60">Loading reviews...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-night font-light lowercase">review moderation</h2>
        <span className="text-micro font-mono text-muted">{reviews.length} reviews</span>
      </div>

      <div className="space-y-2">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted/40 font-light">No reviews found.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-meta font-bold text-night truncate">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-micro text-muted/50 font-mono truncate">{review.user?.email || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-micro font-bold uppercase tracking-wider ${
                    review.status === 'APPROVED' ? 'bg-teal/10 text-teal' :
                    review.status === 'REJECTED' ? 'bg-coral/10 text-coral' :
                    'bg-gold/10 text-gold'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-micro text-muted">
                <span className="text-gold font-bold">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <span className="text-border/40">·</span>
                <span>{review.destination?.name || 'Unknown'}</span>
                <span className="text-border/40">·</span>
                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
              </div>

              {review.comment && (
                <p className="text-sm text-muted/80 font-light leading-relaxed line-clamp-2">{review.comment}</p>
              )}

              <div className="flex items-center gap-1.5 pt-1">
                {review.status !== 'APPROVED' && (
                  <button onClick={() => handleStatus(review.id, 'APPROVED')}
                    className="px-3 py-1 rounded text-micro font-bold uppercase tracking-wider bg-teal/10 text-teal hover:bg-teal/20 cursor-pointer transition-colors flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                )}
                {review.status !== 'REJECTED' && (
                  <button onClick={() => handleStatus(review.id, 'REJECTED')}
                    className="px-3 py-1 rounded text-micro font-bold uppercase tracking-wider bg-coral/10 text-coral hover:bg-coral/20 cursor-pointer transition-colors flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                )}
                {review.status === 'PENDING' && (
                  <button onClick={() => handleStatus(review.id, 'PENDING')}
                    className="px-3 py-1 rounded text-micro font-bold uppercase tracking-wider bg-gold/10 text-gold hover:bg-gold/20 cursor-pointer transition-colors flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Flag Pending
                  </button>
                )}
                <button onClick={() => handleDelete(review.id)}
                  className="px-3 py-1 rounded text-micro font-bold uppercase tracking-wider bg-coral/5 text-coral/60 hover:bg-coral/10 hover:text-coral cursor-pointer transition-colors flex items-center gap-1 ml-auto">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded btn-ghost border border-border disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-micro font-mono text-muted">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="w-8 h-8 flex items-center justify-center rounded btn-ghost border border-border disabled:opacity-30">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
