"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronLeft, ChevronRight, Trash2, Clock, User } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import StarRating from '../ui/StarRating';
import { createReview, getDestinationReviews, deleteReview, getDestinationRating } from '../../../backend/actions/reviewActions';

interface ReviewSectionProps {
  destinationId: string;
}

export default function ReviewSection({ destinationId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    const [res, ratingRes] = await Promise.all([
      getDestinationReviews(destinationId, page, 5),
      getDestinationRating(destinationId),
    ]);
    if (res.success) {
      setReviews(res.data ?? []);
      setTotalPages(res.totalPages ?? 1);
    }
    if (ratingRes.success) {
      setAverageRating(ratingRes.averageRating);
      setTotalReviews(ratingRes.totalReviews);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (destinationId) loadReviews();
  }, [destinationId, page]);

  const handleSubmit = async () => {
    if (!session) { signIn('google', { callbackUrl: window.location.href }); return; }
    if (newRating === 0) return;
    setSubmitting(true);
    const res = await createReview({ destinationId, rating: newRating, comment: newComment || undefined });
    setSubmitting(false);
    if (res.success) {
      setShowForm(false);
      setNewRating(0);
      setNewComment('');
      loadReviews();
    }
  };

  const handleDelete = async (reviewId: string) => {
    const res = await deleteReview(reviewId);
    if (res.success) loadReviews();
  };

  if (loading) return <div className="h-24 bg-secondary-surface animate-pulse rounded-lg" />;

  return (
    <div className="space-y-6">
      {/* Header / Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-section text-night font-bold lowercase">traveler stories</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={averageRating} size="sm" showValue />
            <span className="text-meta text-muted font-mono">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 btn-night text-micro font-bold uppercase tracking-wider rounded-md cursor-pointer">
          {showForm ? 'Cancel' : 'Write Review'}
        </button>
      </div>

      {/* Write Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="bg-surface border border-border rounded-lg p-4 space-y-3"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <p className="text-micro font-mono text-muted uppercase tracking-wider">Your Rating</p>
            <StarRating rating={newRating} size="lg" interactive onRate={setNewRating} />
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} maxLength={2000} rows={3} placeholder="Share your experience (optional)..."
              className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-xs text-night placeholder:text-stone/50 focus:outline-none focus:border-gold resize-none" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 btn-ghost text-micro font-bold uppercase tracking-wider text-muted cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={newRating === 0 || submitting}
                className="px-4 py-2 btn-night text-micro font-bold uppercase tracking-wider rounded-md cursor-pointer disabled:opacity-40">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <MessageSquare className="w-6 h-6 text-muted/30 mx-auto mb-2" />
            <p className="text-sm text-muted/60 font-light">No reviews yet. Be the first to share!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-border/70 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-meta font-bold text-night">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-micro text-muted/50 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                {(session?.user?.id === review.userId || session?.user?.role === 'ADMIN') && (
                  <button onClick={() => handleDelete(review.id)} className="text-muted/40 hover:text-coral transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-muted/80 font-light leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
