export interface DestinationImage {
  gradient: string;
  image?: string;
}

const GRADIENT_MAP: Record<string, DestinationImage> = {
  goa:         { gradient: 'from-amber-200 via-amber-100 to-coral-200', image: '/images/tours/goa-banner.jpg' },
  kerala:      { gradient: 'from-emerald-200 via-teal-100 to-emerald-300', image: '/images/tours/kerala-banner.jpg' },
  ladakh:      { gradient: 'from-blue-200 via-indigo-100 to-purple-200', image: '/images/tours/ladakh-banner.jpg' },
  jaipur:      { gradient: 'from-rose-200 via-orange-100 to-amber-200', image: '/images/tours/jaisalmer-banner.jpg' },
  jaisalmer:   { gradient: 'from-amber-200 via-orange-100 to-yellow-200', image: '/images/tours/jaisalmer-banner.jpg' },
  udaipur:     { gradient: 'from-amber-200 via-yellow-100 to-slate-300', image: '/images/tours/udaipur-banner.jpg' },
  varanasi:    { gradient: 'from-amber-200 via-orange-100 to-yellow-200', image: '/images/tours/varanasi-banner.jpg' },
  kashmir:     { gradient: 'from-blue-100 via-indigo-100 to-white', image: '/images/tours/kashmir-banner.jpg' },
  hampi:       { gradient: 'from-orange-200 via-amber-100 to-stone-300', image: '/images/tours/hampi-banner.jpg' },
  darjeeling:  { gradient: 'from-emerald-200 via-green-100 to-sky-200', image: '/images/tours/cherrapunji-banner.jpg' },
  rann:        { gradient: 'from-stone-100 via-gray-100 to-white', image: '/images/tours/kutch-banner.jpg' },
  kutch:       { gradient: 'from-stone-100 via-gray-100 to-white', image: '/images/tours/kutch-banner.jpg' },
  munnar:      { gradient: 'from-emerald-200 via-teal-100 to-emerald-300', image: '/images/tours/munnar-banner.jpg' },
  cherrapunji: { gradient: 'from-emerald-200 via-green-100 to-sky-200', image: '/images/tours/cherrapunji-banner.jpg' },
  andaman:     { gradient: 'from-blue-200 via-teal-100 to-cyan-200', image: '/images/tours/andaman-banner.jpg' },
};

const DEFAULT: DestinationImage = { gradient: 'from-amber-100 via-yellow-50 to-amber-200' };

export function getDestinationImage(destination: string): DestinationImage {
  if (!destination) return DEFAULT;
  return GRADIENT_MAP[destination.toLowerCase().trim()] || DEFAULT;
}
