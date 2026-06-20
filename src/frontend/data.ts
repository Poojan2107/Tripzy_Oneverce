import { Tour } from './types';

export const TOURS_DATA: Tour[] = [
  {
    id: 'varanasi-spiritual',
    title: 'Varanasi',
    subtitle: 'Dawn on the Ganges, Ancient Temples & Vedic Chants',
    description: 'Experience Varanasi, one of the oldest living cities on earth. Observe the mesmerizing Ganga Aarti fire ceremonies from a private wooden boat on the sacred river Ganges, walk through narrow lanes alive with clay tea cups and silk weavers, and sit with local Vedic scholars for private chanting sessions.',
    category: 'trending',
    duration: '3 Days, 2 Nights',
    rating: 4.95,
    reviewsCount: 184,
    price: 550,
    location: 'Varanasi, Uttar Pradesh, India',
    groupSize: 'Max 8 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Twilight Ganges Cruise & Ganga Aarti',
        description: 'Board a private wooden hand-rowed boat as dusk falls. Witness the grand fire ceremonies at Dashashwamedh Ghat from the water.',
        activities: ['Ganges boat ride', 'Ganga Aarti viewing', 'Traditional welcome satvik thali']
      },
      {
        day: 2,
        title: 'Morning Ghat Walk & Silk Weaving Heritage',
        description: 'Wake up at sunrise for a peaceful stroll along ancient river banks, seeing bathers and morning chants. Explore old silk-weaving workshops.',
        activities: ['Subah-e-Banaras ghat walk', 'Silk weavers guild visit', 'Vedic chanting monastery session']
      }
    ],
    includedServices: [
      { name: 'Heritage Riverfront Haveli', iconName: 'Home' },
      { name: 'Private Rowing Boat Charter', iconName: 'Compass' },
      { name: 'Vedic Scholar Guide', iconName: 'Sparkles' }
    ],
    reviews: [
      {
        id: 'rev-v1',
        author: 'Arjun Mehta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
        rating: 5,
        date: 'October 14, 2025',
        comment: 'Deeply spiritual and beautifully organized. Row boat dining was an unforgettable editorial experience.'
      }
    ],
    tags: ['Spiritual', 'Culture', 'Heritage'],
    moods: ['Spiritual', 'Culture'],
    bestSeason: 'October to March',
    latitude: 25.3176,
    longitude: 82.9739,
    
    // PRD Specifics
    chapterName: 'Chapter 01',
    chapterTitle: 'The Sacred River',
    storyHeadline: 'Dawn on the Ganges',
    storyNarrative: 'Witness the convergence of life, death, and devotion along the ancient stone steps.',
    localSecret: 'A century-old, family-run clay pottery workshop hidden behind Lalita Ghat.',
    photographySpot: 'Dashashwamedh Ghat at 5:45 AM during the first incense flame offering.',
    signatureExperience: 'A private evening Bajra boat ride during the Ganga Aarti.',
    budgetRange: '₹25,000 - ₹80,000',
    accents: {
      primary: '#E07B39', // Saffron
      secondary: '#1A237E' // Indigo
    }
  },
  {
    id: 'jaisalmer-fort',
    title: 'Jaisalmer',
    subtitle: 'Golden Citadel, Thar Desert Dunes & Folk Music',
    description: 'Unveil the mystery of the Golden City. Live inside the active sandstone citadel of Jaisalmer, traverse the Thar desert dunes on camelback under an expansive starry sky, and stay in luxurious desert canopy tents featuring authentic Rajasthani folk music.',
    category: 'popular',
    duration: '3 Days, 2 Nights',
    rating: 4.94,
    reviewsCount: 130,
    price: 950,
    location: 'Jaisalmer, Rajasthan, India',
    groupSize: 'Max 8 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Fort Citadel Walk & Sandstone Havelis',
        description: 'Wander the narrow streets and active homes inside the massive living fort. Tour Patwon-ki-Haveli carved stone facades.',
        activities: ['Golden fort walking tour', 'Carved havelis visit', 'Sunset rooftop desert view']
      },
      {
        day: 2,
        title: 'Thar Desert Camel Safari & Canopy Dunes Camp',
        description: 'Drive jeep cruisers to the sand dunes of Sam. Ride camels along the ridge lines and sleep in premium canvas glamping tents.',
        activities: ['Thar desert jeep cruise', 'Camel sand dune ride', 'Rajasthani folk music & desert thali']
      }
    ],
    includedServices: [
      { name: 'Sandstone Fort Suite', iconName: 'Home' },
      { name: 'Thar Glamping Canvas', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Culture', 'Adventure', 'Royal'],
    moods: ['Culture', 'Adventure'],
    bestSeason: 'October to March',
    latitude: 26.9157,
    longitude: 70.9083,
    
    // PRD Specifics
    chapterName: 'Chapter 02',
    chapterTitle: 'The Desert Kingdom',
    storyHeadline: 'The Living Golden Citadel',
    storyNarrative: 'Walk inside a massive sandstone fort where families still reside amidst ancient carvings.',
    localSecret: 'An abandoned medieval stepwell at Kuldhara, completely silent at sunrise.',
    photographySpot: 'The sunset silhouette of Vyas Chhatri cenotaphs against the golden dunes.',
    signatureExperience: 'A slow camel caravan trek during twilight in the Thar Desert.',
    budgetRange: '₹30,000 - ₹90,000',
    accents: {
      primary: '#D84315', // Copper / Terracotta
      secondary: '#ECE6DA' // Sandstone
    }
  },
  {
    id: 'kerala-houseboats',
    title: 'Kerala Backwaters',
    subtitle: 'Private Luxury Kettuvallam & Palm-Fringed Backwaters',
    description: 'Drift along the peaceful, palm-fringed backwaters of Alleppey inside a private luxury Kettuvallam houseboat. Sleep to the gentle sound of water, savor fresh pearl-spot fish prepared by your personal chef, and explore narrow canals lined with coconut trees.',
    category: 'trending',
    duration: '4 Days, 3 Nights',
    rating: 4.93,
    reviewsCount: 110,
    price: 850,
    location: 'Alleppey, Kerala, India',
    groupSize: 'Max 4 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Boarding the Kettuvallam & Lagoon Lunch',
        description: 'Welcome aboard your private thatched-roof wooden houseboat. Set sail into Vembanad Lake while enjoying traditional spiced meals.',
        activities: ['Houseboat boarding', 'Traditional banana leaf lunch', 'Sunset lagoon cruise']
      },
      {
        day: 2,
        title: 'Canal Kayaking & Village Paddy Fields',
        description: 'Board a small canoe to navigate narrow canals under low bridges. Walk through backwater village farms and watch coconut climbing.',
        activities: ['Narrow canal canoe trip', 'Village coir-making workshop', 'Chef-prepared backwater dinner']
      }
    ],
    includedServices: [
      { name: 'Private Luxury Houseboat', iconName: 'Home' },
      { name: 'Personal Backwater Chef', iconName: 'Utensils' }
    ],
    reviews: [],
    tags: ['Nature', 'Luxury', 'Food'],
    moods: ['Nature', 'Luxury'],
    bestSeason: 'September to March',
    latitude: 9.4981,
    longitude: 76.3388,
    
    // PRD Specifics
    chapterName: 'Chapter 03',
    chapterTitle: 'The Floating World',
    storyHeadline: 'Slow Waters of Alleppey',
    storyNarrative: 'Drift in a thatched roof houseboat past emerald paddy fields and sleeping lagoons.',
    localSecret: 'A canal-side toddy shop serving spicy karimeen curry on banana leaves.',
    photographySpot: 'Sunset reflections of palm silhouettes in Vembanad Lake.',
    signatureExperience: 'Overnight backwater cruise on a luxury Kettuvallam.',
    budgetRange: '₹35,000 - ₹1,10,000',
    accents: {
      primary: '#00B0FF', // Turquoise
      secondary: '#2E7D32' // Palm Green
    }
  },
  {
    id: 'ladakh-passes',
    title: 'Ladakh',
    subtitle: 'Overland Trails, Pangong Tso & Cliff Monasteries',
    description: 'Embark on a high-altitude overland odyssey across the highest motorable passes in the world. Behold the shifting turquoise shades of Pangong Tso Lake, camp under pristine dark skies, and visit century-old Buddhist monasteries perched precariously on sheer mountain cliffs.',
    category: 'popular',
    duration: '8 Days, 7 Nights',
    rating: 4.97,
    reviewsCount: 145,
    price: 1100,
    location: 'Leh, Ladakh, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Challenging',
    bannerImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Leh Arrival & Acclimatization Rest',
        description: 'Land in Leh and spend the day resting to adapt to the 11,500ft altitude. Take a light evening stroll to local bazaars.',
        activities: ['Oxygen-assisted hotel rest', 'Bazaar spice walk', 'Buddhist butter tea tasting']
      },
      {
        day: 2,
        title: 'Cliff Monasteries & Hall of Fame',
        description: 'Explore the grand Thiksey and Hemis monasteries, observing morning monk prayers. Visit local war memorials.',
        activities: ['Monastery prayer circle', 'Acclimatization trail walk', 'Traditional Ladakhi dinner']
      }
    ],
    includedServices: [
      { name: 'High-Altitude Domes', iconName: 'Home' },
      { name: 'All-Terrain Cruiser Transit', iconName: 'Plane' }
    ],
    reviews: [],
    tags: ['Adventure', 'Nature', 'Hidden'],
    moods: ['Adventure', 'Nature'],
    bestSeason: 'June to September',
    latitude: 34.1526,
    longitude: 77.5771,
    
    // PRD Specifics
    chapterName: 'Chapter 04',
    chapterTitle: 'The Last Himalayan Road',
    storyHeadline: 'Breathtaking High Passes',
    storyNarrative: 'Navigate winding trails through jagged cold deserts and high altitude monasteries.',
    localSecret: 'A quiet walking trail behind Hemis Monastery leading to a hidden meditation cave.',
    photographySpot: 'First light reflecting on the turquoise waters of Pangong Tso.',
    signatureExperience: 'Motorcycle crossing of the Khardung La Pass.',
    budgetRange: '₹45,000 - ₹1,30,000',
    accents: {
      primary: '#B71C1C', // Copper
      secondary: '#D84315' // Sandstone
    }
  },
  {
    id: 'kashmir-meadows',
    title: 'Kashmir',
    subtitle: 'Floating Dal Lake Houseboats & Alpine Meadow Walks',
    description: 'Savor the paradise on earth. Stay in meticulously hand-carved heritage wooden houseboats on Dal Lake, drift through floating morning flower markets, and discover the pine-forested alpine slopes and meadows of Gulmarg and Pahalgam.',
    category: 'popular',
    duration: '6 Days, 5 Nights',
    rating: 4.96,
    reviewsCount: 154,
    price: 1150,
    location: 'Srinagar, Jammu & Kashmir, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Shikara Check-in & Dal Lake Evening Cruise',
        description: 'Board your heritage wooden houseboat. Take a slow evening Shikara ride to watch floating vendor markets and see the Zabarwan range.',
        activities: ['Houseboat boarding', 'Shikara cruise on Dal Lake', 'Kashmiri Wazwan dinner']
      },
      {
        day: 2,
        title: 'Mughal Gardens & Saffron Trail',
        description: 'Walk through the terraced fountains of Shalimar Bagh and Nishat Bagh gardens. Tour local hand-loom pashmina weaving guilds.',
        activities: ['Mughal garden walk', 'Pashmina shawl workshop', 'Floating market tea tour']
      }
    ],
    includedServices: [
      { name: 'Heritage Dal Lake Houseboat', iconName: 'Home' },
      { name: 'Private Shikara Access', iconName: 'Compass' }
    ],
    reviews: [],
    tags: ['Luxury', 'Nature', 'Food'],
    moods: ['Luxury', 'Nature'],
    bestSeason: 'April to October',
    latitude: 34.0837,
    longitude: 74.7973,
    
    // PRD Specifics
    chapterName: 'Chapter 05',
    chapterTitle: 'The Valley of Meadows',
    storyHeadline: 'Echoes of the Dal Lake',
    storyNarrative: 'Wake up to floating flower markets and timber-carved houseboats surrounded by mist.',
    localSecret: 'The hidden saffron fields of Pampore where the finest spice is handpicked.',
    photographySpot: 'A wooden Shikara floating in Dal Lake during sunset.',
    signatureExperience: 'Gondola ride over Gulmarg\'s snow-capped valleys.',
    budgetRange: '₹40,000 - ₹1,20,000',
    accents: {
      primary: '#00C853', // Emerald
      secondary: '#1B5E20' // Pine
    }
  },
  {
    id: 'udaipur-mewar',
    title: 'Udaipur',
    subtitle: 'Lake Pichola Palace Domes & Royal mewar Hospitality',
    description: 'Wander through the shimmering Mewar palace city of Udaipur. Watch golden-hour boat reflections on Lake Pichola, tour the grand City Palace museum, experience royal Mewari hospitality, and stay in a heritage palace floating in the center of the lake.',
    category: 'popular',
    duration: '3 Days, 2 Nights',
    rating: 4.96,
    reviewsCount: 220,
    price: 1300,
    location: 'Udaipur, Rajasthan, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'City Palace Walk & Shimmering Pichola Cruise',
        description: 'Explore the royal armory and museum inside City Palace. Glide past Lake Palace on a private canopy boat at sunset.',
        activities: ['City palace guided walk', 'Sunset Pichola private cruise', 'Mewari royal thali dinner']
      },
      {
        day: 2,
        title: 'Bazaar Craft Guilds & Saheliyon-ki-Bari Garden',
        description: 'Walk through old city silversmith and miniature painting guilds. Stroll the historic fountains and marble pools of the maidens garden.',
        activities: ['Craft bazaar mini-workshop', 'Fountain garden walk', 'Rooftop sitar performance']
      }
    ],
    includedServices: [
      { name: 'Floating Palace Stay', iconName: 'Home' },
      { name: 'Private Lake Canopy Cruiser', iconName: 'Compass' }
    ],
    reviews: [],
    tags: ['Luxury', 'Royal', 'Culture'],
    moods: ['Luxury', 'Culture'],
    bestSeason: 'October to March',
    latitude: 24.5854,
    longitude: 73.7125,
    
    // PRD Specifics
    chapterName: 'Chapter 06',
    chapterTitle: 'The City of Lakes',
    storyHeadline: 'Mewari Palace Reflections',
    storyNarrative: 'Stroll royal stone corridors where shimmering palace domes rise out of the water.',
    localSecret: 'A hidden sunset viewpoint behind Sajjangarh Monsoon Palace away from the crowds.',
    photographySpot: 'The marble arches of Jag Mandir island reflecting on Lake Pichola.',
    signatureExperience: 'Sunset lake cruise past the floating palaces.',
    budgetRange: '₹35,000 - ₹1,40,000',
    accents: {
      primary: '#E0A96D', // Rose Gold
      secondary: '#334155' // Charcoal
    }
  },
  {
    id: 'munnar-tea',
    title: 'Munnar',
    subtitle: 'Tea Valley Vistas, Organic Spice Hills & Cloud Trails',
    description: 'Wander the rolling green carpets of Munnar\'s estate plantations. Learn organic spice cultivation, trek mist-covered ridges of Lockhart Gap, and experience colonial estate bungalow living.',
    category: 'weekend',
    duration: '3 Days, 2 Nights',
    rating: 4.88,
    reviewsCount: 92,
    price: 680,
    location: 'Munnar, Kerala, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bungalow Arrival & Tea Processing walk',
        description: 'Arrive at your colonial tea estate bungalow. Take an afternoon walk to see handpicking and tea leaf sorting.',
        activities: ['Colonial tea bungalow check-in', 'Tea estate sorting house tour', 'Local Kalaripayattu martial display']
      },
      {
        day: 2,
        title: 'Lockhart Ridge Hike & Spice Trails',
        description: 'Trek up to Lockhart Gap for mountain sunrise views. Continue with a guided walk through cardamom and pepper slopes.',
        activities: ['Lockhart sunrise ridge walk', 'Cardamom spice trail guided tour', 'Local Kerala-style thali']
      }
    ],
    includedServices: [
      { name: 'Colonial Tea Bungalow', iconName: 'Home' },
      { name: 'Organic Spice Guide', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Nature', 'Food', 'Relaxation'],
    moods: ['Nature', 'Food'],
    bestSeason: 'September to May',
    latitude: 10.0889,
    longitude: 77.0595,
    
    // PRD Specifics
    chapterName: 'Chapter 07',
    chapterTitle: 'The Spice Hills',
    storyHeadline: 'Mist Over the Tea Valleys',
    storyNarrative: 'Walk through undulating green carpet tea plantations floating in high clouds.',
    localSecret: 'An old colonial bungalow trail that leads to a hidden waterfall deep in the estate.',
    photographySpot: 'The morning fog lifting over Lockhart Gap.',
    signatureExperience: 'Guided walk through organic spice hills and tea processing.',
    budgetRange: '₹20,000 - ₹65,000',
    accents: {
      primary: '#00C853', // Emerald
      secondary: '#1B5E20' // Pine
    }
  },
  {
    id: 'goa-beach',
    title: 'Goa',
    subtitle: 'Old Goa Latin Quarters, Sandy Coves & Spice Plantations',
    description: 'Bask in the relaxed, bohemian spirit of South Goa. Unwind in luxury eco-shacks directly on the beach, explore the colorful Portuguese Latin Quarters in Fontainhas, and wander through organic spice plantations before enjoying fresh seafood curries.',
    category: 'weekend',
    duration: '4 Days, 3 Nights',
    rating: 4.89,
    reviewsCount: 156,
    price: 600,
    location: 'South Goa, India',
    groupSize: 'Max 8 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Eco-Lodge Check-in & Sunset Beach Walk',
        description: 'Arrive at your private ocean-front cottage in Palolem. Enjoy fresh coconut beverages and watch traditional fishing dhows at sunset.',
        activities: ['Sunset beach bonfire', 'Traditional Goan fish curry lunch', 'Starlight deck walk']
      },
      {
        day: 2,
        title: 'Fontainhas Latin Quarter & Spice Farms',
        description: 'Stroll past yellow-washed Portuguese villas in old Panaji. Travel inland to a organic spice plantation for lunch on banana leaves.',
        activities: ['Latin quarter architecture walk', 'Spice plantation guided tour', 'Local Feni spirit tasting']
      }
    ],
    includedServices: [
      { name: 'Eco beachfront villa', iconName: 'Home' },
      { name: 'Portuguese heritage guide', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Beach', 'Culture', 'Relaxation'],
    moods: ['Relaxation', 'Food'],
    bestSeason: 'November to February',
    latitude: 15.2993,
    longitude: 74.1240,
    
    // PRD Specifics
    chapterName: 'Chapter 08',
    chapterTitle: 'The Sun and Silt',
    storyHeadline: 'Bohemian Palm Coves',
    storyNarrative: 'Find serenity in South Goan sandy bays and old Portuguese Latin quarters.',
    localSecret: 'A private spring-fed pool hidden in the jungle behind Netravali wildlife sanctuary.',
    photographySpot: 'The pastel yellow facades and wooden balconies of Fontainhas.',
    signatureExperience: 'Walking tour of the old Portuguese heritage mansions.',
    budgetRange: '₹25,000 - ₹75,000',
    accents: {
      primary: '#FF6F59', // Sunset Coral
      secondary: '#01579B' // Ocean Blue
    }
  },
  {
    id: 'hampi-ruins',
    title: 'Hampi',
    subtitle: 'Ancient Vijayanagara Temples & Coracle River Crossings',
    description: 'Step into a surreal boulder-strewn landscape where the ruins of the grand Vijayanagara Empire reside. Climb Hemakuta Hill for a breathtaking sunset, cross the Tungabhadra river in a traditional round coracle boat, and lodge in a boutique heritage retreat.',
    category: 'popular',
    duration: '4 Days, 3 Nights',
    rating: 4.92,
    reviewsCount: 98,
    price: 720,
    location: 'Hampi, Karnataka, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Moderate',
    bannerImage: 'https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Stone Chariot & Hemakuta Sunset Boulders',
        description: 'Visit the iconic stone chariot of Vittala Temple. Scramble up Hemakuta Hill sandstone boulders to see the sun melt over coconut groves.',
        activities: ['Stone chariot guided walk', 'Boulders sunset climb', 'Boutique heritage stay check-in']
      },
      {
        day: 2,
        title: 'Tungabhadra Coracle Crossing & Hippie Island',
        description: 'Cross the river in a traditional circular woven grass coracle. Explore the bouldering tracks and ancient step wells of Anegundi.',
        activities: ['Coracle boat crossing', 'Ancient stepwell photography', 'Banana plantation stroll']
      }
    ],
    includedServices: [
      { name: 'Heritage Eco Lodge', iconName: 'Home' },
      { name: 'Vijayanagara Historian Guide', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Culture', 'Adventure', 'Heritage'],
    moods: ['Culture', 'Adventure'],
    bestSeason: 'October to February',
    latitude: 15.3350,
    longitude: 76.4600,
    
    // PRD Specifics
    chapterName: 'Chapter 09',
    chapterTitle: 'The Ruins of Empire',
    storyHeadline: 'Surreal Boulder Landscapes',
    storyNarrative: 'Explore the vast stone ruins of Vijayanagara rising from green coconut groves.',
    localSecret: 'An ancient stepwell hidden behind the Queen\'s Bath, mostly untouched.',
    photographySpot: 'Sunset silhouette from the top of Matanga Hill.',
    signatureExperience: 'Crossing the Tungabhadra River in a circular woven coracle boat.',
    budgetRange: '₹20,000 - ₹55,000',
    accents: {
      primary: '#B71C1C', // Copper
      secondary: '#D84315' // Sandstone
    }
  },
  {
    id: 'kutch-salt',
    title: 'Rann of Kutch',
    subtitle: 'Infinite White Salt Horizon & Artisanal Embroidery Guilds',
    description: 'Explore the vast white salt marshlands of Kutch. Feel the stillness under a brilliant full moon, listen to Rajasthani and Kutchi folk musicians, and visit block-printing and Rogan painting artisans.',
    category: 'popular',
    duration: '3 Days, 2 Nights',
    rating: 4.90,
    reviewsCount: 88,
    price: 780,
    location: 'Kutch, Gujarat, India',
    groupSize: 'Max 8 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Salt desert Sunset & Campfire Performance',
        description: 'Check in at your tent city resort. Move onto the Rann white salt fields as dusk settles. Gather for local folk thrumming.',
        activities: ['Tent City luxury check-in', 'Sunset Rann salt walk', 'Kutchi folk music gathering']
      },
      {
        day: 2,
        title: 'Rogan Painting & Block Print Guilds',
        description: 'Tour Nirona village to meet the sole family practicing ancestral oil-base Rogan fabric painting. Stroll Ajrakhpur printing hubs.',
        activities: ['Ancestral Rogan workshop', 'Ajrakh block-print guild visit', 'Gujarati traditional thali']
      }
    ],
    includedServices: [
      { name: 'Premium Canopy glamping tent', iconName: 'Home' },
      { name: 'Artisan Guild Liaison guide', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Culture', 'Hidden', 'Heritage'],
    moods: ['Culture', 'Hidden'],
    bestSeason: 'November to February',
    latitude: 23.8203,
    longitude: 69.8329,
    
    // PRD Specifics
    chapterName: 'Chapter 10',
    chapterTitle: 'The Salt Horizon',
    storyHeadline: 'The Infinite White Salt Desert',
    storyNarrative: 'Stand on a flat salt expanse that stretches to the sky, glowing under the moon.',
    localSecret: 'A local Rogan painting artisan village where the craft is kept alive by only one family.',
    photographySpot: 'The cracked salt crust reflecting the full moon at midnight.',
    signatureExperience: 'Traditional Kutchi music around a desert campfire.',
    budgetRange: '₹30,000 - ₹85,000',
    accents: {
      primary: '#E07B39', // Saffron
      secondary: '#D84315' // Sandstone
    }
  },
  {
    id: 'cherrapunji-roots',
    title: 'Cherrapunji',
    subtitle: 'Living Root Bridges, Deep Forest Falls & Cloud Canyons',
    description: 'Venture into Meghalaya, the abode of the clouds. Walk living root bridges bio-engineered by the indigenous Khasi tribe, discover dense cavern cascades, and walk ridges looking onto Bangladesh plains.',
    category: 'popular',
    duration: '4 Days, 3 Nights',
    rating: 4.91,
    reviewsCount: 84,
    price: 760,
    location: 'Sohra, Meghalaya, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Moderate',
    bannerImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Mawlynnong Cleanest Village & Canyon Check-in',
        description: 'Trek through the cleanest village in Asia, seeing organic bamboo waste structures. Check in at Sohra forest dome.',
        activities: ['Mawlynnong village stroll', 'Sohra forest resort check-in', 'Local Khasi herb chicken dinner']
      },
      {
        day: 2,
        title: 'Nongriat Double-Decker Bridge Trek',
        description: 'Descend 3000 stone steps into deep jungle river gorges. Cross the ancestral double-decker living root bridge.',
        activities: ['Root bridge suspension crossing', 'Nohkalikai waterfall photography', 'Khasi botanical overview walk']
      }
    ],
    includedServices: [
      { name: 'Eco Jungle Forest Dome', iconName: 'Home' },
      { name: 'Indigenous Khasi Guide', iconName: 'Sparkles' }
    ],
    reviews: [],
    tags: ['Nature', 'Adventure', 'Hidden'],
    moods: ['Nature', 'Adventure'],
    bestSeason: 'October to May',
    latitude: 25.2702,
    longitude: 91.7325,
    
    // PRD Specifics
    chapterName: 'Chapter 11',
    chapterTitle: 'The Cloud Sanctuary',
    storyHeadline: 'Whispers of the Rain Forest',
    storyNarrative: 'Walk across living root bridges woven by local Khasi tribes over rushing rivers.',
    localSecret: 'A small, deep limestone cave called Krem Mawmluh with underground streams.',
    photographySpot: 'The double-decker living root bridge at Nongriat.',
    signatureExperience: 'Hike through sacred green forest valleys.',
    budgetRange: '₹22,000 - ₹60,000',
    accents: {
      primary: '#004D40', // Rainforest Green
      secondary: '#2E7D32' // Palm Green
    }
  },
  {
    id: 'andaman-reefs',
    title: 'Andaman',
    subtitle: 'Sapphire Reefs, Bioluminescent Kayak & Radhanagar Beaches',
    description: 'Immerse in the pristine bays of Havelock Island. Snorkel with marine naturalists through untouched coral formations, kayak at midnight through glowing bio-luminescent mangrove streams, and rest on soft Radhanagar shores.',
    category: 'trending',
    duration: '6 Days, 5 Nights',
    rating: 4.93,
    reviewsCount: 112,
    price: 1250,
    location: 'Havelock Island, Andaman, India',
    groupSize: 'Max 6 travelers',
    difficulty: 'Easy',
    bannerImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ferry Arrival & Radhanagar Beach Sunset walk',
        description: 'Board the catamaran from Port Blair to Havelock. Walk the wide white sands of Radhanagar beach as twilight glows.',
        activities: ['Catamaran cruise transit', 'Beach cottage check-in', 'Sunset seafood dinner']
      },
      {
        day: 2,
        title: 'Scuba Marine Snorkel & Bioluminescent Kayak',
        description: 'Explore the colorful reef life with a marine biologist. At night, paddle quiet mangrove channels to see bio-glowing waters.',
        activities: ['Coral reef diving', 'Bioluminescent night kayak', 'Coconut grove dinner']
      }
    ],
    includedServices: [
      { name: 'Ocean beachfront cottage', iconName: 'Home' },
      { name: 'PADI Marine Scuba Team', iconName: 'Compass' }
    ],
    reviews: [],
    tags: ['Beach', 'Nature', 'Relaxation'],
    moods: ['Relaxation', 'Nature'],
    bestSeason: 'November to May',
    latitude: 12.0125,
    longitude: 92.7915,
    
    // PRD Specifics
    chapterName: 'Chapter 12',
    chapterTitle: 'The Coral Archipelago',
    storyHeadline: 'Pristine Sapphire Waters',
    storyNarrative: 'Dive into colorful coral gardens and relax on quiet white sand beaches.',
    localSecret: 'A quiet mangrove channel in Havelock Island where you can kayak in bio-luminescent water at night.',
    photographySpot: 'The curved white sands of Radhanagar Beach at sunset.',
    signatureExperience: 'Deep-sea snorkeling through pristine reefs.',
    budgetRange: '₹40,000 - ₹1,30,000',
    accents: {
      primary: '#01579B', // Ocean Blue
      secondary: '#00B0FF' // Turquoise
    }
  }
];

export const CATEGORY_CHIPS = [
  { id: 'all', label: 'All India', icon: 'Compass' },
  { id: 'Spiritual', label: 'Spiritual India', icon: 'Compass' },
  { id: 'Royal', label: 'Royal India', icon: 'Compass' },
  { id: 'Adventure', label: 'Adventure India', icon: 'Compass' },
  { id: 'Nature', label: 'Nature India', icon: 'Compass' },
  { id: 'Food', label: 'Food India', icon: 'Compass' },
  { id: 'Hidden', label: 'Hidden India', icon: 'Compass' },
];
