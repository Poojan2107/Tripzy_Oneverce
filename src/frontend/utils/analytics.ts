/**
 * Tripzy V2 Centralized Analytics utility
 */

export function trackEvent(type: string, payload: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Track] ${type}:`, payload);
  }
  
  // Safe fetch to API endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload })
  }).catch(() => {
    // Fail silently in case endpoint is not mounted or offline
  });
}

export function trackPageView(page: string) {
  trackEvent('page_view', { page, timestamp: new Date().toISOString() });
}

export function trackDestinationClick(tourId: string, name: string) {
  trackEvent('destination_click', { tourId, name, timestamp: new Date().toISOString() });
}

export function trackPlannerCompletion(destination: string, duration: number, budgetTier: string) {
  trackEvent('planner_completion', { destination, duration, budgetTier, timestamp: new Date().toISOString() });
}

export function trackAffiliateClick(hotelId: string, hotelName: string, partner: string) {
  trackEvent('affiliate_click', { hotelId, hotelName, partner, timestamp: new Date().toISOString() });
}

export function trackWishlistSave(tourId: string, saved: boolean) {
  trackEvent('wishlist_save', { tourId, saved, timestamp: new Date().toISOString() });
}
