import { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Clock, MapPin, Heart, Share2,
  Sparkles, Utensils, Plane, Home, Compass, User, Calendar, CheckCircle2,
  Leaf, AlertCircle, Zap, BookOpen
} from 'lucide-react';
import { Tour } from '../types';
import { formatINR } from '../utils/currency';
import { getHotelsByDestination } from '../data/hotels';
import HotelCard from './HotelCard';

interface TourDetailsViewProps {
  tour: Tour;
  onBack: () => void;
  onPlanClick: () => void;
  onToggleWishlist: (tourId: string) => void;
  isWishlisted: boolean;
}

// Rich per-destination cultural content
const CULTURAL_CONTEXT: Record<string, { tagline: string; context: string; etiquette: string[]; mustDo: string[]; avoid: string[] }> = {
  'varanasi-spiritual': {
    tagline: 'One of the oldest living cities on earth',
    context: 'Varanasi has been a center of Hindu pilgrimage for over 3,000 years. Every ghat along the 5km riverfront has its own ritual purpose — from cremations at Manikarnika to morning bathers at Dashashwamedh. The city operates on a spiritual time zone entirely its own.',
    etiquette: [
      'Remove shoes before entering any temple or ghat area',
      'Dress conservatively — cover shoulders and knees',
      'Do not photograph cremation ceremonies without explicit permission',
      'Accept chai from chai wallahs — it is part of local hospitality'
    ],
    mustDo: [
      'Dawn boat ride at 5:30 AM to see morning rituals',
      'Ganga Aarti at Dashashwamedh Ghat at sunset',
      'Explore the narrow lanes of Vishwanath Gali for street food',
      'Visit a silk weaving workshop in the old city'
    ],
    avoid: [
      'Entering the main Kashi Vishwanath Temple without ID proof',
      'Touching any sacred ritual items or flowers on ghats'
    ]
  },
  'jaisalmer-fort': {
    tagline: 'A living medieval city carved in golden sandstone',
    context: 'The Sonar Quila (Golden Fort) of Jaisalmer is one of the few living forts in the world — thousands of residents still inhabit its narrow lanes. Built in 1156 AD, its sandstone walls glow golden at sunset. The city is also the gateway to the Thar Desert, which covers 25% of India.',
    etiquette: [
      'Water is scarce in the desert — use it mindfully',
      'Bargain gently at bazaars — it is expected but be respectful',
      'Ask permission before photographing local women',
      'Always carry cash — card machines are unreliable in remote desert areas'
    ],
    mustDo: [
      'Watch sunset from Vyas Chhatri cenotaphs overlooking the dunes',
      'Spend a night in a luxury desert glamping tent at Sam',
      'Walk the "Patwon Ki Haveli" — five connected havelis with intricate carving',
      'Overnight camel safari watching the Milky Way'
    ],
    avoid: [
      'Visiting during May-June — extreme heat (50°C)',
      'Bargaining aggressively at craft guilds — artisans live on fair prices'
    ]
  },
  'kerala-houseboats': {
    tagline: 'God\'s Own Country — where time slows to a drift',
    context: 'Kerala\'s backwaters are a 900km network of interconnected canals, rivers and lakes running parallel to the Arabian Sea. The iconic Kettuvallam houseboats are made entirely of jackfruit wood and palm leaves — and were once used to carry rice and spices along the trade routes.',
    etiquette: [
      'Remove footwear before boarding any houseboat',
      'Avoid wearing swimwear on public backwater banks — locals may be offended',
      'Accept a banana leaf meal the traditional way — with your right hand',
      'Tip your houseboat cook generously — they wake at dawn to prepare your meals'
    ],
    mustDo: [
      'Board the houseboat before noon to catch the full day on the water',
      'Try karimeen pollichathu — pearl spot fish wrapped in banana leaf',
      'Watch fishermen cast their Chinese fishing nets at dusk in Fort Kochi',
      'Attend a traditional Kathakali performance at Kerala Kalamandalam'
    ],
    avoid: [
      'Visiting Alleppey in June-August — monsoon makes boat cruises rough',
      'Booking through unlicensed operators — safety standards vary widely'
    ]
  },
  'ladakh-passes': {
    tagline: 'The roof of the world — where prayers float on wind flags',
    context: 'Ladakh sits at 11,500ft above sea level and holds some of the highest motorable passes on earth. The region is a cultural crossroads of Tibetan Buddhism, Islamic tradition, and ancient nomadic herding culture. Less than 350mm of rain falls annually — making it a cold desert.',
    etiquette: [
      'Acclimatize for at least 2 full days before any high-altitude trek',
      'Walk clockwise around Buddhist stupas and monasteries',
      'Always ask a monk before photographing inside prayer halls',
      'Carry Diamox altitude tablets and drink at least 4L water daily'
    ],
    mustDo: [
      'Witness morning puja (prayers) at Hemis or Thiksey Monastery at 6 AM',
      'Drive over the Khardung La Pass at 18,380ft — world\'s highest motorable road',
      'Watch the sunrise color shift on Pangong Tso — 4 distinct hues in 20 minutes',
      'Stay in a traditional Ladakhi mud-brick homestay in Nubra Valley'
    ],
    avoid: [
      'Skipping acclimatization days — altitude sickness is serious',
      'Visiting October-May — the Leh-Manali highway is closed by snow'
    ]
  },
  'kashmir-meadows': {
    tagline: 'The Paradise Valley — a garden of Mughal emperors',
    context: 'The Kashmir Valley has been called "Paradise on Earth" since the Mughal period. Emperors built elaborate garden terraces here to escape Delhi\'s heat. The Dal Lake, covering 18 sq km, hosts a floating community of 50,000 people living on Shikaras and houseboats.',
    etiquette: [
      'Check government advisories before travel — conditions can change',
      'Always hire a registered government-approved guide for trekking',
      'Women should carry a scarf — draping it shows cultural respect',
      'Bargain politely in the famous Lal Chowk handicraft markets'
    ],
    mustDo: [
      'Take a Shikara at sunrise to see the floating flower market on Dal Lake',
      'Visit the saffron fields of Pampore in October during harvest season',
      'Ride the Gulmarg Gondola to 13,780ft for alpine meadow views',
      'Order a full Kashmiri Wazwan feast — 36-course royal banquet'
    ],
    avoid: [
      'Venturing to border areas near LoC without military clearance',
      'Visiting during late July-August — peak monsoon, leeches in trekking paths'
    ]
  },
  'udaipur-mewar': {
    tagline: 'The Venice of the East — royal palaces rising from still water',
    context: 'Udaipur was founded in 1558 by Maharana Udai Singh II. The city sits beside five interconnected lakes and is famous for its palace architecture. The City Palace — the largest palace complex in Rajasthan — was home to 22 successive Maharanas of the Mewar dynasty.',
    etiquette: [
      'Dress smartly to enter the City Palace museum — casual wear is acceptable',
      'Hire a local licensed guide inside the City Palace — they decode the art',
      'Book the Lake Palace restaurant well in advance — it fills up weeks ahead',
      'Photography is permitted in most palace rooms except private chambers'
    ],
    mustDo: [
      'Sunset boat cruise on Lake Pichola past the floating Lake Palace',
      'Watch the Bagore Ki Haveli traditional folk dance show at 7 PM',
      'Walk Jagdish Temple and the silver market in the old city bazaar',
      'Stay or dine at a heritage haveli with views over the lake'
    ],
    avoid: [
      'Visiting in May — peak summer, temperature can reach 43°C',
      'Booking standard hotel boats — private charters offer far better views'
    ]
  },
  'munnar-tea': {
    tagline: 'Rolling green carpets of the Western Ghats',
    context: 'Munnar sits at 6,000ft in the Anaimalai range. It was developed by British planters in the 1870s and now produces 10% of India\'s tea. The town itself sits at the junction of three rivers — Muthirapuzha, Nallathanni, and Kundaly — which give it an unusually temperate climate year-round.',
    etiquette: [
      'Dress in layers — mornings are misty and cold even in summer',
      'Do not pluck tea leaves — estate theft carries heavy fines',
      'Support family-run homestays over chain resorts for authentic meals',
      'Buy spices directly from certified spice guilds for fair trade prices'
    ],
    mustDo: [
      'Walk into a live tea factory to see withering, rolling, and firing steps',
      'Spot Nilgiri Tahr (endangered mountain goat) at Eravikulam National Park',
      'Trek the Lockhart Gap ridge at sunrise for panoramic valley views',
      'Try homemade cardamom-infused tea at a local estate bungalow'
    ],
    avoid: [
      'Visiting in July-August — heavy monsoon rains close many trails',
      'Trusting unofficial guides who take commissions from shops'
    ]
  },
  'goa-beach': {
    tagline: 'Where Portuguese spice meets Indian sea',
    context: 'Goa was a Portuguese colony for 450 years until 1961 — far longer than the British ruled most of India. This heritage left behind a unique blend of Catholic churches, Indo-Portuguese mansions, and a food culture where kokum, coconut, and fresh seafood dominate. The state has 105km of pristine coastline.',
    etiquette: [
      'Topless sunbathing is now prohibited on all public beaches in Goa',
      'Respect the local Sunday church-going culture in Old Goa villages',
      'Cashew feni is potent — drink slowly. It is around 42% alcohol',
      'Wear shoes at Fontainhas heritage walk — narrow cobblestone streets'
    ],
    mustDo: [
      'Walk the Latin Quarter at Fontainhas in the early morning before crowds',
      'Try a full Goan fish curry rice at a local beach shack — not hotel restaurants',
      'Explore the spice plantation at Savoi for organic black pepper and nutmeg',
      'Catch the sunset at Chapora Fort for the best view of North Goa'
    ],
    avoid: [
      'Going to Baga or Calangute in December — extremely overcrowded',
      'Renting vehicles without proper license — traffic police are strict'
    ]
  },
  'hampi-ruins': {
    tagline: 'A surreal boulder kingdom frozen in medieval time',
    context: 'Hampi was the capital of the Vijayanagara Empire — the wealthiest city on earth in the 1500s, with a population of over 500,000. The empire fell to the Deccan Sultanates in 1565 in the Battle of Talikota. Today the ruins cover 4,100 hectares — a UNESCO World Heritage Site.',
    etiquette: [
      'Do not climb on protected temple structures — heavy fines apply',
      'Remove footwear inside all temple complexes including Vittala Temple',
      'The Tungabhadra coracle boat crossing is only available at certain ghats',
      'Respect local religious activity — some temples have active daily puja'
    ],
    mustDo: [
      'Climb Matanga Hill before sunrise — best panoramic view of the ruins',
      'See the famous musical stone pillars of Vijaya Vittala Temple',
      'Cross the Tungabhadra river by coracle boat to the hippie island',
      'Explore the royal enclosure — the Queen\'s Bath and elephant stables'
    ],
    avoid: [
      'Visiting in April-May — extreme heat makes boulder climbing dangerous',
      'Missing the Hemakuta Hill sunset — views over the ruins are unforgettable'
    ]
  },
  'kutch-salt': {
    tagline: 'An endless white horizon where sky and earth become one',
    context: 'The Rann of Kutch is the world\'s largest salt desert — a seasonal wetland that floods during monsoon and dries into a cracked white expanse from November to February. The region supports one of India\'s oldest craft traditions — embroidery, mirror work, and Rogan painting — practiced by semi-nomadic communities.',
    etiquette: [
      'Carry permits for the restricted areas near the Pakistan border — issued at Khavda',
      'Buy directly from artisan guilds — many middlemen sell imitation work as authentic',
      'Wear sun-protective clothing on the Rann — UV intensity at ground level is extreme',
      'The Tent City resort requires advance booking — closes in March each year'
    ],
    mustDo: [
      'Walk onto the white salt expanse during a full moon night — no light pollution',
      'Visit Nirona village to watch the last surviving Rogan painting family at work',
      'Explore the Kala Dungar (Black Hills) for a panoramic view of the desert',
      'Attend the Rann Utsav cultural festival (November-February) for folk music'
    ],
    avoid: [
      'Visiting May-October — the entire Rann is flooded and inaccessible',
      'Buying craft items from Bhuj roadside stalls — many are machine-made replicas'
    ]
  },
  'cherrapunji-roots': {
    tagline: 'The wettest place on earth — a living cathedral of forest',
    context: 'Cherrapunji (officially called Sohra) receives over 12,000mm of rain annually — making it among the wettest places on earth. The Khasi tribe here developed a unique bio-engineering technique over centuries — training rubber tree roots across rivers to create natural living bridges that strengthen over time.',
    etiquette: [
      'Hire a local Khasi guide for the Nongriat root bridge trek — trails are unmarked',
      'The 3,000-step descent to the bridges is strenuous — carry trekking poles',
      'Do not touch or damage any root bridge — they take 10-15 years to grow',
      'Stay in locally-owned homestays in Nongriat village to support the community'
    ],
    mustDo: [
      'Trek down to the double-decker living root bridge at Nongriat village',
      'Swim in the natural blue pool at Nongriat — crystal clear mountain water',
      'Walk through Mawlynnong — Asia\'s cleanest village',
      'See the Nohkalikai Falls viewpoint — 340m plunge, India\'s tallest waterfall'
    ],
    avoid: [
      'Trekking in June-August — extremely slippery trails, some closures',
      'Visiting Dawki during weekends in winter — extremely crowded since viral social media'
    ]
  },
  'andaman-reefs': {
    tagline: 'Pristine sapphire seas where time still moves slowly',
    context: 'The Andaman Islands are part of an archipelago of 572 islands — only 38 of which are inhabited. The islands were isolated from outside contact until the 1800s. The coral reefs here are among the most biodiverse in Asia, supporting over 200 species of hard coral and 1,300 species of fish.',
    etiquette: [
      'Use only reef-safe sunscreen — chemical sunscreens are killing the coral',
      'The Jarawa Tribe Reserve is strictly off-limits — do not interact with them',
      'Book PADI-certified dive operators only — others may cut safety corners',
      'The cellular jail has a mandatory minimum 1-hour light and sound show — book ahead'
    ],
    mustDo: [
      'Snorkel at Elephant Beach, Havelock — easy access, stunning coral gardens',
      'Kayak through the mangrove tunnels at night for bioluminescence',
      'Visit the Cellular Jail for the evening light and sound show at 6 PM',
      'Take the government catamaran to Neil Island for a quieter beach experience'
    ],
    avoid: [
      'Visiting May-November — cyclone season, ferries are frequently cancelled',
      'Booking private boats for island hopping — only use licensed ferry services'
    ]
  }
};

const NEARBY_DAYTRIPS: Record<string, Array<{ name: string; distance: string; type: string }>> = {
  'varanasi-spiritual': [
    { name: 'Sarnath Buddhist Ruins', distance: '10 km', type: 'Heritage' },
    { name: 'Ramnagar Fort', distance: '14 km', type: 'Palace' },
    { name: 'Chunar Fort', distance: '40 km', type: 'History' }
  ],
  'jaisalmer-fort': [
    { name: 'Kuldhara Ghost Village', distance: '18 km', type: 'Ruins' },
    { name: 'Sam Sand Dunes', distance: '42 km', type: 'Desert' },
    { name: 'Gadisar Lake', distance: '2 km', type: 'Nature' }
  ],
  'kerala-houseboats': [
    { name: 'Kumarakom Bird Sanctuary', distance: '15 km', type: 'Wildlife' },
    { name: 'Ambalapuzha Temple', distance: '12 km', type: 'Spiritual' },
    { name: 'Kuttanad — Venice of East', distance: '20 km', type: 'Waterway' }
  ],
  'ladakh-passes': [
    { name: 'Pangong Tso Lake', distance: '160 km', type: 'Nature' },
    { name: 'Nubra Valley', distance: '150 km', type: 'Landscape' },
    { name: 'Tso Moriri Lake', distance: '240 km', type: 'Remote' }
  ],
  'kashmir-meadows': [
    { name: 'Gulmarg Meadow & Gondola', distance: '56 km', type: 'Alpine' },
    { name: 'Pahalgam Valley', distance: '95 km', type: 'Trek' },
    { name: 'Yusmarg Meadows', distance: '47 km', type: 'Pastoral' }
  ],
  'udaipur-mewar': [
    { name: 'Kumbhalgarh Fort & Wall', distance: '84 km', type: 'Heritage' },
    { name: 'Ranakpur Jain Temples', distance: '90 km', type: 'Spiritual' },
    { name: 'Chittorgarh Fort Ruins', distance: '115 km', type: 'History' }
  ],
  'munnar-tea': [
    { name: 'Eravikulam National Park', distance: '13 km', type: 'Wildlife' },
    { name: 'Mattupetty Dam & Lake', distance: '13 km', type: 'Nature' },
    { name: 'Chinnakanal Waterfalls', distance: '22 km', type: 'Waterfalls' }
  ],
  'goa-beach': [
    { name: 'Dudhsagar Waterfalls', distance: '60 km', type: 'Waterfall' },
    { name: 'Cotigao Wildlife Sanctuary', distance: '80 km', type: 'Wildlife' },
    { name: 'Old Goa Churches', distance: '9 km', type: 'Heritage' }
  ],
  'hampi-ruins': [
    { name: 'Daroji Sloth Bear Sanctuary', distance: '15 km', type: 'Wildlife' },
    { name: 'Tungabhadra Dam View', distance: '13 km', type: 'Landscape' },
    { name: 'Anegundi Palace Village', distance: '5 km', type: 'Heritage' }
  ],
  'kutch-salt': [
    { name: 'Wild Ass Sanctuary, Little Rann', distance: '210 km', type: 'Wildlife' },
    { name: 'Mandvi Beach & Palace', distance: '60 km', type: 'Coastal' },
    { name: 'Dholavira Indus Site', distance: '250 km', type: 'Ancient' }
  ],
  'cherrapunji-roots': [
    { name: 'Dawki River Border Viewpoint', distance: '82 km', type: 'Scenic' },
    { name: 'Mawsynram — Wettest Village', distance: '16 km', type: 'Record' },
    { name: 'Krem Mawmluh Cave', distance: '3 km', type: 'Spelunking' }
  ],
  'andaman-reefs': [
    { name: 'Neil Island — Coral Garden', distance: '37 km', type: 'Reef' },
    { name: 'Baratang Limestone Caves', distance: '100 km', type: 'Geology' },
    { name: 'Barren Island Volcano', distance: '135 km', type: 'Volcano' }
  ]
};

function ServiceIcon({ iconName }: { iconName: string }) {
  const cn = "w-5 h-5 text-ocean";
  switch (iconName) {
    case 'Utensils': return <Utensils className={cn} />;
    case 'Plane': return <Plane className={cn} />;
    case 'Home': return <Home className={cn} />;
    default: return <Compass className={cn} />;
  }
}

export default function TourDetailsView({
  tour,
  onBack,
  onPlanClick,
  isWishlisted,
  onToggleWishlist
}: TourDetailsViewProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'itinerary' | 'local' | 'logistics' | 'hotels'>('story');

  useEffect(() => {
    if (tour && tour.id) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'view',
          payload: { destinationId: tour.dbId || tour.id }
        })
      }).catch(() => {});
    }
  }, [tour]);

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href).catch((err) => {
      console.warn("Clipboard copy failed (non-HTTPS or iOS):", err);
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cultural = CULTURAL_CONTEXT[tour.id];
  const dayTrips = NEARBY_DAYTRIPS[tour.id] || [];
  const accentColor = tour.accents?.primary || '#D6A85F';

  const TABS = [
    { id: 'story', label: 'The Story' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'local', label: 'Local Intel' },
    { id: 'logistics', label: 'Plan & Book' },
    { id: 'hotels', label: 'Hotels' },
  ] as const;

  return (
    <div className="pb-32 bg-sand min-h-[100dvh] select-none">

      {/* ── EDITORIAL HERO ── */}
      <div className="relative w-full h-[45vh] md:h-[60vh] min-h-[300px] md:min-h-[440px] overflow-hidden">
        <img
          src={tour.bannerImage}
          alt={tour.title}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.opacity = '0' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/25 transition-all cursor-pointer z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Wishlist + Share */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleWishlist(tour.id)}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <div className="flex items-center gap-3 mb-3">
            {tour.chapterName && (
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-white/70 uppercase tracking-widest">
                {tour.chapterName}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-gold/90 text-[10px] font-bold text-white uppercase tracking-wider">96% Match</span>
            {tour.moods?.slice(0, 2).map(m => (
              <span key={m} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wider">{m}</span>
            ))}
          </div>
          <h1
            className="font-display text-white lowercase font-light tracking-[-0.03em] leading-none"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', lineHeight: '0.88' }}
          >
            {tour.title}
          </h1>
          {cultural?.tagline && (
            <p className="text-sm text-white/60 font-light mt-3 italic max-w-md">{cultural.tagline}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-gold" /> {tour.location}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest">{tour.duration}</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-white/60">
              <Star className="w-3 h-3 fill-gold text-gold" />
              {tour.rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* ── QUICK STAT BAR ── */}
      <div className="border-b border-warm-gray bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 py-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <Clock className="w-4 h-4 text-gold" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Duration</p>
                <p className="text-xs font-bold text-night">{tour.duration}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-warm-gray" />
            <div className="flex items-center gap-2 shrink-0">
              <User className="w-4 h-4 text-ocean" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Group</p>
                <p className="text-xs font-bold text-night">{tour.groupSize}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-warm-gray" />
            <div className="flex items-center gap-2 shrink-0">
              <Zap className="w-4 h-4 text-sage" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Difficulty</p>
                <p className="text-xs font-bold text-night">{tour.difficulty}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-warm-gray" />
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="w-4 h-4 text-saffron" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Best Time</p>
                <p className="text-xs font-bold text-night">{tour.bestSeason || 'Oct – Mar'}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-warm-gray" />
            <div className="flex items-center gap-2 shrink-0">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Rating</p>
                <p className="text-xs font-bold text-night">{parseFloat(tour.rating.toFixed(1))} ({tour.reviewsCount} reviews)</p>
              </div>
            </div>
            {tour.budgetRange && (
              <>
                <div className="w-px h-8 bg-warm-gray" />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg" style={{ lineHeight: 1 }}>₹</span>
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider text-muted/50">Budget Range</p>
                    <p className="text-xs font-bold text-night">{tour.budgetRange}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-0">
            
            {/* Tab Navigation */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-4 border-b border-warm-gray mb-8">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                    activeTab === tab.id
                      ? 'bg-night text-white border-night'
                      : 'bg-white text-muted border-warm-gray hover:border-gold'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB: THE STORY ── */}
            {activeTab === 'story' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Subtitle & Moods */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-night font-light lowercase leading-tight mb-3">{tour.subtitle}</h2>
                  {tour.moods && tour.moods.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tour.moods.map((m) => (
                        <span key={m} className="px-3.5 py-1 rounded-full bg-cream text-night border border-warm-gray text-[10px] font-bold uppercase tracking-wider">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="border-l-4 pl-6" style={{ borderColor: accentColor }}>
                  <p className="text-sm text-muted font-light leading-relaxed">{tour.description}</p>
                </div>

                {/* Cultural Context */}
                {cultural && (
                  <div className="p-6 rounded-3xl border border-warm-gray bg-white shadow-card space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gold" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted/60 font-bold">Cultural Context</span>
                    </div>
                    <h3 className="font-display text-xl text-night font-light leading-snug">{cultural.context}</h3>
                  </div>
                )}

                {/* Chapter Lore */}
                {(tour.storyHeadline || tour.storyNarrative) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {tour.chapterName && (
                        <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold uppercase tracking-widest">
                          {tour.chapterName}
                        </span>
                      )}
                      {tour.chapterTitle && (
                        <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{tour.chapterTitle}</span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl text-night font-bold leading-tight">
                      {tour.storyHeadline || 'Chapter Lore'}
                    </h2>
                    {tour.storyNarrative && (
                      <p className="text-sm text-muted font-light leading-relaxed italic border-l-2 border-gold/30 pl-4">
                        "{tour.storyNarrative}"
                      </p>
                    )}
                  </div>
                )}

                {/* Signature Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.localSecret && (
                    <div className="p-4 rounded-2xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-saffron uppercase tracking-widest font-bold block mb-1.5">🤫 Local Secret</span>
                      <p className="text-xs text-night/70 font-light leading-relaxed">{tour.localSecret}</p>
                    </div>
                  )}
                  {tour.photographySpot && (
                    <div className="p-4 rounded-2xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-gold uppercase tracking-widest font-bold block mb-1.5">📷 Best Photo Spot</span>
                      <p className="text-xs text-night/70 font-light leading-relaxed">{tour.photographySpot}</p>
                    </div>
                  )}
                  {tour.signatureExperience && (
                    <div className="p-4 rounded-2xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-sage uppercase tracking-widest font-bold block mb-1.5">✨ Signature Experience</span>
                      <p className="text-xs text-night/70 font-light leading-relaxed">{tour.signatureExperience}</p>
                    </div>
                  )}
                  {tour.budgetRange && (
                    <div className="p-4 rounded-2xl bg-white border border-warm-gray shadow-soft">
                      <span className="text-[8px] font-mono text-ocean uppercase tracking-widest font-bold block mb-1.5">💰 Budget Guide</span>
                      <p className="text-xs text-night/70 font-light leading-relaxed">{tour.budgetRange}</p>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="border-t border-warm-gray/50 pt-6">
                    <h2 className="font-display text-xl text-night font-bold mb-4">Top Highlights</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tour.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-warm-gray">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: accentColor }}>
                            {i + 1}
                          </span>
                          <span className="text-xs text-night font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: ITINERARY ── */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-night font-bold mb-1">Daily Itinerary</h2>
                  <p className="text-xs text-muted font-light">Each day is crafted around natural rhythms — sunrise rituals, midday exploration, and evening culture.</p>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {tour.itinerary.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setActiveDay(day.day)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                        activeDay === day.day
                          ? 'bg-night text-white border-night'
                          : 'bg-white text-muted border-warm-gray hover:border-ocean/30'
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>
                {tour.itinerary.filter(d => d.day === activeDay).map((day) => (
                  <div key={day.day} className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card animate-scale-in space-y-4">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-saffron font-bold block mb-1">Day {day.day}</span>
                      <h3 className="font-display text-xl text-night font-bold">{day.title}</h3>
                      <p className="text-xs text-muted font-light mt-2 leading-relaxed">{day.description}</p>
                    </div>
                    {day.activities.length > 0 && (
                      <div className="border-t border-warm-gray/30 pt-4 space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted/50 font-bold">Activities</span>
                        <ul className="space-y-2">
                          {day.activities.map((a, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs text-muted font-light">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Included Services */}
                <div>
                  <h2 className="font-display text-xl text-night font-bold mb-4">What's Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.includedServices.map((s, i) => (
                      <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-warm-gray">
                        <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center">
                          <ServiceIcon iconName={s.iconName} />
                        </div>
                        <span className="text-xs text-night font-semibold">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: LOCAL INTEL ── */}
            {activeTab === 'local' && cultural && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Must-Do Experiences */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <h2 className="font-display text-xl text-night font-bold">Must-Do Experiences</h2>
                  </div>
                  <div className="space-y-2">
                    {cultural.mustDo.map((item, i) => (
                      <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-warm-gray shadow-soft">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: accentColor }}>
                          {i + 1}
                        </span>
                        <p className="text-xs text-night font-medium leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Etiquette */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-4 h-4 text-sage" />
                    <h2 className="font-display text-xl text-night font-bold">Cultural Etiquette</h2>
                  </div>
                  <div className="p-5 rounded-3xl bg-sage/5 border border-sage/20 space-y-3">
                    {cultural.etiquette.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-muted font-light">
                        <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Things to Avoid */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-saffron" />
                    <h2 className="font-display text-xl text-night font-bold">Traveler Cautions</h2>
                  </div>
                  <div className="p-5 rounded-3xl bg-saffron/5 border border-saffron/20 space-y-3">
                    {cultural.avoid.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-muted font-light">
                        <AlertCircle className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Day Trips */}
                {dayTrips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="w-4 h-4 text-ocean" />
                      <h2 className="font-display text-xl text-night font-bold">Nearby Day Trips</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dayTrips.map((trip, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white border border-warm-gray shadow-soft text-center">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-ocean font-bold block mb-1">{trip.type}</span>
                          <p className="text-xs font-bold text-night mb-1">{trip.name}</p>
                          <span className="text-[10px] text-muted font-light">{trip.distance} away</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traveler Reviews */}
                {tour.reviews.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl text-night font-bold mb-4">Traveler Notes</h2>
                    <div className="space-y-4">
                      {tour.reviews.map((r) => (
                        <div key={r.id} className="p-5 rounded-2xl bg-white border border-warm-gray shadow-soft">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-full object-cover border border-warm-gray" onError={e => { e.currentTarget.style.opacity = '0' }} />
                            <div>
                              <p className="text-xs font-bold text-night">{r.author}</p>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: r.rating }).map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 text-gold fill-gold" />
                                ))}
                                <span className="text-[9px] text-muted ml-1">{r.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted font-light leading-relaxed italic">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: LOGISTICS ── */}
            {activeTab === 'logistics' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-night font-bold mb-1">Plan & Reserve</h2>
                  <p className="text-xs text-muted font-light">Everything you need to know before arriving, and how to book your journey.</p>
                </div>

                {/* Price & CTA */}
                <div className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-4xl font-display font-bold text-night">{formatINR(tour.price)}</span>
                      <span className="text-xs text-muted font-light ml-2">/ person per day</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-bold text-sm text-night">{parseFloat(tour.rating.toFixed(1))}</span>
                      <span className="text-xs text-muted font-light">({tour.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={onPlanClick}
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-warm-gray text-xs font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-sand/40 transition-all cursor-pointer bg-white"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-ocean" />
                      <span>Generate AI Journey Plan</span>
                    </button>
                  </div>
                </div>

                {/* Practical Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-warm-gray">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Best Season</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-saffron" />
                      <span className="text-xs font-bold text-night">{tour.bestSeason || 'Oct – Mar'}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-warm-gray">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Difficulty</span>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-sage" />
                      <span className="text-xs font-bold text-night">{tour.difficulty}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-warm-gray">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Group Size</span>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-ocean" />
                      <span className="text-xs font-bold text-night">{tour.groupSize}</span>
                    </div>
                  </div>
                  {tour.budgetRange && (
                    <div className="p-4 rounded-2xl bg-white border border-warm-gray">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Budget Guide</span>
                      <span className="text-xs font-bold text-night">{tour.budgetRange}</span>
                    </div>
                  )}
                </div>

                {/* Included Services */}
                <div>
                  <h3 className="font-display text-lg text-night font-bold mb-3">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.includedServices.map((s, i) => (
                      <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-warm-gray">
                        <ServiceIcon iconName={s.iconName} />
                        <span className="text-xs text-night font-semibold">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: HOTELS ── */}
            {activeTab === 'hotels' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-night font-bold mb-1">Where to Stay</h2>
                  <p className="text-xs text-muted font-light">Curated hotels and stays in {tour.title}. Compare and book via our partner sites.</p>
                </div>
                <div className="space-y-4">
                  {getHotelsByDestination(tour.id).length > 0 ? (
                    getHotelsByDestination(tour.id).map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))
                  ) : (
                    <div className="p-8 rounded-2xl bg-white border border-warm-gray text-center">
                      <p className="text-xs text-muted font-light">Hotels for this destination are being curated. Check back soon.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="max-lg:static lg:sticky lg:top-24 space-y-4">
              
              {/* Booking Actions Card */}
              <div className="p-6 rounded-3xl bg-white border border-warm-gray shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-bold text-sm text-night">{parseFloat(tour.rating.toFixed(1))}</span>
                    <span className="text-xs text-muted font-light">({tour.reviewsCount} reviews)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sand border border-warm-gray text-night">
                    {tour.difficulty}
                  </span>
                </div>

                <div className="py-4 border-y border-warm-gray/40 mb-5">
                  <span className="text-3xl font-display font-bold text-night">{formatINR(tour.price)}</span>
                  <span className="text-xs text-muted font-light ml-1">/ person daily</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={onPlanClick}
                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-warm-gray text-xs font-bold uppercase tracking-wider text-muted hover:text-night hover:bg-sand/40 transition-all cursor-pointer bg-white"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ocean" />
                    <span>Start AI Planning</span>
                  </button>
                </div>
              </div>

              {/* Destination Quick Facts */}
              {cultural && (
                <div className="p-5 rounded-3xl bg-white border border-warm-gray shadow-card">
                  <h3 className="font-bold text-xs text-night uppercase tracking-wider mb-4 border-b border-warm-gray/40 pb-2">Destination Snapshot</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-1">Best Time</span>
                      <span className="text-xs font-bold text-night flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-saffron" /> {tour.bestSeason || 'Oct – Mar'}
                      </span>
                    </div>
                    <div className="border-t border-warm-gray/30 pt-3">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Must Try</span>
                      <p className="text-[10px] text-night/70 font-medium leading-relaxed">{cultural.mustDo[0]}</p>
                    </div>
                    <div className="border-t border-warm-gray/30 pt-3">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-muted/50 block mb-2">Local Secret</span>
                      <p className="text-[10px] text-night/70 font-medium leading-relaxed">{tour.localSecret}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {tour.reviews.length > 0 && (
                <div className="p-5 rounded-3xl bg-white border border-warm-gray shadow-card">
                  <h3 className="font-bold text-xs text-night uppercase tracking-wider mb-4 border-b border-warm-gray/40 pb-2">Traveler Notes</h3>
                  <div className="space-y-4">
                    {tour.reviews.slice(0, 2).map((r) => (
                      <div key={r.id} className="space-y-1.5 pb-3 border-b border-warm-gray/20 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={r.avatar} alt={r.author} className="w-7 h-7 rounded-full object-cover border border-warm-gray" onError={e => { e.currentTarget.style.opacity = '0' }} />
                          <div>
                            <p className="text-xs font-bold text-night">{r.author}</p>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                              <span className="text-[9px] font-bold text-muted">{r.rating}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
