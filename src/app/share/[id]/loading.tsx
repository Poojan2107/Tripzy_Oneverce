export default function ShareLoading() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6">
      <div className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin mb-4" />
      <span className="text-micro font-mono uppercase tracking-[0.2em] text-muted/50 animate-pulse">Loading itinerary...</span>
    </div>
  );
}
