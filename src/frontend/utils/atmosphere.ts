export interface Atmosphere {
  primaryColor: string;
  secondaryColor: string;
  glowClass: string;
  textAccent: string;
  badgeColor: string;
  badgeBg: string;
  lineAccent: string;
  mood: string;
  effects: string[];
  localSecret: string;
  travelerMemory: string;
  bestPhotoSpot: string;
  bestSunriseTime: string;
  bestSeason: string;
  culturalInsight: string;
  travelQuote: string;
  narrative: string;
}

export function getAtmosphere(location: string = ""): Atmosphere {
  const loc = location.toLowerCase();
  
  /* ── Indian Destinations ── */
  if (loc.includes('varanasi')) {
    return {
      primaryColor: '#E07B39', secondaryColor: '#1A237E',
      glowClass: 'bg-saffron-glow', textAccent: 'text-saffron',
      badgeColor: 'border-[#E07B39]/35 text-[#E07B39]',
      badgeBg: 'bg-[#E07B39]/15 text-[#E07B39] border-[#E07B39]/20',
      lineAccent: 'border-[#E07B39]/40',
      mood: 'Sacred River', effects: ['incense', 'temple-bells'],
      localSecret: 'A century-old clay pottery workshop hidden behind Lalita Ghat, open only at sunrise.',
      travelerMemory: 'The sound of Vedic chants echoing across the river as hundreds of clay lamps float downstream.',
      bestPhotoSpot: 'Dashashwamedh Ghat at 5:45 AM during the first incense flame offering.',
      bestSunriseTime: '05:42 AM', bestSeason: 'October to March',
      culturalInsight: 'Remove shoes before approaching any ghat shrine; photography is prohibited during the main Aarti ceremony.',
      travelQuote: 'Dawn breaks over the Ganges where fire and devotion have met for ten thousand years.',
      narrative: 'Witness the convergence of life, death, and devotion along the ancient stone steps of Varanasi.'
    };
  }
  if (loc.includes('jaisalmer')) {
    return {
      primaryColor: '#D84315', secondaryColor: '#ECE6DA',
      glowClass: 'bg-copper-glow', textAccent: 'text-terracotta',
      badgeColor: 'border-[#D84315]/35 text-[#D84315]',
      badgeBg: 'bg-[#D84315]/15 text-[#D84315] border-[#D84315]/20',
      lineAccent: 'border-[#D84315]/40',
      mood: 'Golden Desert', effects: ['sand-ripple', 'star-dust'],
      localSecret: 'An abandoned medieval stepwell at Kuldhara, completely silent at sunrise.',
      travelerMemory: 'The silence of the Thar Desert at midnight, lying on warm sand under a canopy of a million stars.',
      bestPhotoSpot: 'The sunset silhouette of Vyas Chhatri cenotaphs against the golden dunes.',
      bestSunriseTime: '06:08 AM', bestSeason: 'October to March',
      culturalInsight: 'Always accept chai when offered in desert camps; it is a gesture of hospitality.',
      travelQuote: 'A golden citadel rising from the sands, alive with stories carved in stone.',
      narrative: 'Walk inside an active sandstone fort where families still reside amidst ancient carvings.'
    };
  }
  if (loc.includes('kerala') || loc.includes('alleppey')) {
    return {
      primaryColor: '#00B0FF', secondaryColor: '#2E7D32',
      glowClass: 'bg-turquoise-glow', textAccent: 'text-teal',
      badgeColor: 'border-[#00B0FF]/35 text-[#00B0FF]',
      badgeBg: 'bg-[#00B0FF]/15 text-[#00B0FF] border-[#00B0FF]/20',
      lineAccent: 'border-[#00B0FF]/40',
      mood: 'Floating Silence', effects: ['water-ripple', 'palm-shadow'],
      localSecret: 'A canal-side toddy shop serving spicy karimeen curry on banana leaves, known only to local boatmen.',
      travelerMemory: 'Falling asleep to the gentle lap of backwater against the thatched hull, waking to kingfishers diving for breakfast.',
      bestPhotoSpot: 'Sunset reflections of palm silhouettes in Vembanad Lake.',
      bestSunriseTime: '06:15 AM', bestSeason: 'September to March',
      culturalInsight: 'Eat with your right hand; the left is considered unclean during meals.',
      travelQuote: 'Slow waters and emerald palms where time bends like the narrow canals.',
      narrative: 'Drift in a thatched roof houseboat through emerald paddy fields and sleeping lagoons.'
    };
  }
  if (loc.includes('ladakh') || loc.includes('leh')) {
    return {
      primaryColor: '#B71C1C', secondaryColor: '#D84315',
      glowClass: 'bg-copper-glow', textAccent: 'text-terracotta',
      badgeColor: 'border-[#B71C1C]/35 text-[#B71C1C]',
      badgeBg: 'bg-[#B71C1C]/15 text-[#B71C1C] border-[#B71C1C]/20',
      lineAccent: 'border-[#B71C1C]/40',
      mood: 'High-Altitude Odyssey', effects: ['prayer-flag', 'mountain-shadow'],
      localSecret: 'A quiet walking trail behind Hemis Monastery leading to a hidden meditation cave with ancient murals.',
      travelerMemory: 'Standing at Khardung La, the world falling away into a cold desert silence that stretches to Tibet.',
      bestPhotoSpot: 'First light reflecting on the turquoise waters of Pangong Tso.',
      bestSunriseTime: '05:30 AM', bestSeason: 'June to September',
      culturalInsight: 'Walk clockwise around all monasteries and stupas; never point your feet at religious objects.',
      travelQuote: 'Where the road ends, the sky begins.',
      narrative: 'Navigate winding trails through jagged cold deserts and high altitude cliff monasteries.'
    };
  }
  if (loc.includes('kashmir') || loc.includes('srinagar')) {
    return {
      primaryColor: '#00C853', secondaryColor: '#1B5E20',
      glowClass: 'bg-emerald-glow', textAccent: 'text-sage',
      badgeColor: 'border-[#00C853]/35 text-[#00C853]',
      badgeBg: 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/20',
      lineAccent: 'border-[#00C853]/40',
      mood: 'Alpine Paradise', effects: ['mist-layers', 'floating-garden'],
      localSecret: 'The hidden saffron fields of Pampore where the finest spice is handpicked before dawn.',
      travelerMemory: 'The scent of saffron tea on a hand-carved houseboat as mist rises off Dal Lake in the early light.',
      bestPhotoSpot: 'A wooden Shikara floating on Dal Lake during the golden hour.',
      bestSunriseTime: '05:55 AM', bestSeason: 'April to October',
      culturalInsight: 'Kashmiri Wazwan is a communal feast; wait for the host to begin before eating.',
      travelQuote: 'Mist rising over floating gardens and timber houseboats carved by hand.',
      narrative: 'Wake up to floating flower markets and heritage houseboats surrounded by pine forests.'
    };
  }
  if (loc.includes('udaipur')) {
    return {
      primaryColor: '#E0A96D', secondaryColor: '#334155',
      glowClass: 'bg-rose-glow', textAccent: 'text-gold',
      badgeColor: 'border-[#E0A96D]/35 text-[#E0A96D]',
      badgeBg: 'bg-[#E0A96D]/15 text-[#E0A96D] border-[#E0A96D]/20',
      lineAccent: 'border-[#E0A96D]/40',
      mood: 'Royal Lakeside', effects: ['palace-reflection', 'marble-glow'],
      localSecret: 'A hidden sunset viewpoint behind Sajjangarh Monsoon Palace away from the crowds.',
      travelerMemory: 'Gliding past the floating Lake Palace as the marble domes turn amber in the fading light.',
      bestPhotoSpot: 'The marble arches of Jag Mandir island reflecting on Lake Pichola.',
      bestSunriseTime: '06:10 AM', bestSeason: 'October to March',
      culturalInsight: 'Miniature painting is a living tradition in Udaipur; visit the guilds in the old city.',
      travelQuote: 'Palace domes float on shimmering water like a dream carved in marble.',
      narrative: 'Stroll royal stone corridors where palace domes rise out of the lake waters.'
    };
  }
  if (loc.includes('munnar')) {
    return {
      primaryColor: '#00C853', secondaryColor: '#1B5E20',
      glowClass: 'bg-emerald-glow', textAccent: 'text-sage',
      badgeColor: 'border-[#00C853]/35 text-[#00C853]',
      badgeBg: 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/20',
      lineAccent: 'border-[#00C853]/40',
      mood: 'Tea Country', effects: ['mist-layers', 'tea-scent'],
      localSecret: 'An old colonial bungalow trail that leads to a hidden waterfall deep in the tea estate.',
      travelerMemory: 'Walking through rolling tea plantations as mist pours over the hills like silk.',
      bestPhotoSpot: 'The morning fog lifting over Lockhart Gap.',
      bestSunriseTime: '06:20 AM', bestSeason: 'September to May',
      culturalInsight: 'Tea tasting etiquette: slurp loudly to aerate the liquor and fully taste the notes.',
      travelQuote: 'Green carpets roll across the hills where the clouds come to rest.',
      narrative: 'Walk through undulating green carpet tea plantations floating in high altitude clouds.'
    };
  }
  if (loc.includes('goa')) {
    return {
      primaryColor: '#FF6F59', secondaryColor: '#01579B',
      glowClass: 'bg-coral-glow', textAccent: 'text-coral',
      badgeColor: 'border-[#FF6F59]/35 text-[#FF6F59]',
      badgeBg: 'bg-[#FF6F59]/15 text-[#FF6F59] border-[#FF6F59]/20',
      lineAccent: 'border-[#FF6F59]/40',
      mood: 'Bohemian Coast', effects: ['sun-flare', 'palm-shadow'],
      localSecret: 'A private spring-fed pool hidden in the jungle behind Netravali wildlife sanctuary.',
      travelerMemory: 'Watching fishing dhows return at sunset while eating fresh grilled mackerel on the sand.',
      bestPhotoSpot: 'The pastel yellow facades and wooden balconies of Fontainhas.',
      bestSunriseTime: '06:30 AM', bestSeason: 'November to February',
      culturalInsight: 'Goan fish curry tastes best when eaten with your hands on a banana leaf.',
      travelQuote: 'Palm-fringed coves and sun-bleached Portuguese villas by the sea.',
      narrative: 'Find serenity in South Goan sandy bays and old Portuguese Latin quarters.'
    };
  }
  if (loc.includes('hampi')) {
    return {
      primaryColor: '#B71C1C', secondaryColor: '#D84315',
      glowClass: 'bg-copper-glow', textAccent: 'text-terracotta',
      badgeColor: 'border-[#B71C1C]/35 text-[#B71C1C]',
      badgeBg: 'bg-[#B71C1C]/15 text-[#B71C1C] border-[#B71C1C]/20',
      lineAccent: 'border-[#B71C1C]/40',
      mood: 'Ancient Ruins', effects: ['boulder-shadow', 'monument-glow'],
      localSecret: 'An ancient stepwell hidden behind the Queen\'s Bath, untouched and silent.',
      travelerMemory: 'Watching the sunset from Hemakuta Hill, the boulder landscape bathed in gold.',
      bestPhotoSpot: 'Sunset silhouette from the top of Matanga Hill.',
      bestSunriseTime: '06:05 AM', bestSeason: 'October to February',
      culturalInsight: 'Hampi\'s bazaar was once a global trade hub for diamonds and spices.',
      travelQuote: 'Giants of stone and the echoes of a fallen empire.',
      narrative: 'Explore the vast stone ruins of Vijayanagara rising from green coconut groves.'
    };
  }
  if (loc.includes('kutch')) {
    return {
      primaryColor: '#E07B39', secondaryColor: '#D84315',
      glowClass: 'bg-saffron-glow', textAccent: 'text-saffron',
      badgeColor: 'border-[#E07B39]/35 text-[#E07B39]',
      badgeBg: 'bg-[#E07B39]/15 text-[#E07B39] border-[#E07B39]/20',
      lineAccent: 'border-[#E07B39]/40',
      mood: 'Salt Desert', effects: ['salt-crystal', 'moon-reflection'],
      localSecret: 'A Rogan painting artisan village where the craft is kept alive by only one family.',
      travelerMemory: 'Standing on the white salt desert under a full moon, the horizon dissolving into the sky.',
      bestPhotoSpot: 'The cracked salt crust reflecting the full moon at midnight.',
      bestSunriseTime: '06:45 AM', bestSeason: 'November to February',
      culturalInsight: 'Kutchi embroidery uses mirror-work; each mirror is meant to ward off evil spirits.',
      travelQuote: 'An infinite white horizon where the earth meets the sky.',
      narrative: 'Stand on a flat salt expanse stretching to the sky, glowing under the moon.'
    };
  }
  if (loc.includes('cherrapunji') || loc.includes('sohra') || loc.includes('meghalaya')) {
    return {
      primaryColor: '#004D40', secondaryColor: '#2E7D32',
      glowClass: 'bg-forest-glow', textAccent: 'text-sage',
      badgeColor: 'border-[#004D40]/35 text-[#004D40]',
      badgeBg: 'bg-[#004D40]/15 text-[#004D40] border-[#004D40]/20',
      lineAccent: 'border-[#004D40]/40',
      mood: 'Cloud Forest', effects: ['mist-layers', 'water-droplets'],
      localSecret: 'A small limestone cave called Krem Mawmluh with underground crystal-clear streams.',
      travelerMemory: 'Crossing a living root bridge suspended over a rushing river, the jungle alive with mist and birdsong.',
      bestPhotoSpot: 'The double-decker living root bridge at Nongriat.',
      bestSunriseTime: '05:50 AM', bestSeason: 'October to May',
      culturalInsight: 'The Khasi tribe follows a matrilineal system — lineage and inheritance pass through the mother.',
      travelQuote: 'Where the clouds live on the earth and roots become bridges.',
      narrative: 'Walk across living root bridges woven by Khasi tribes over rushing jungle rivers.'
    };
  }
  if (loc.includes('andaman') || loc.includes('havelock')) {
    return {
      primaryColor: '#01579B', secondaryColor: '#00B0FF',
      glowClass: 'bg-teal-glow', textAccent: 'text-teal',
      badgeColor: 'border-[#01579B]/35 text-[#01579B]',
      badgeBg: 'bg-[#01579B]/15 text-[#01579B] border-[#01579B]/20',
      lineAccent: 'border-[#01579B]/40',
      mood: 'Coral Archipelago', effects: ['water-ripple', 'bio-glow'],
      localSecret: 'A quiet mangrove channel on Havelock where kayaking reveals bioluminescent plankton at night.',
      travelerMemory: 'Diving through coral gardens as schools of tropical fish spiral around you in the warm blue.',
      bestPhotoSpot: 'The curved white sands of Radhanagar Beach at sunset.',
      bestSunriseTime: '05:35 AM', bestSeason: 'November to May',
      culturalInsight: 'The indigenous Jarawa tribe has minimal contact with the outside world; respect their isolation.',
      travelQuote: 'Sapphire waters and white sand shores that time forgot.',
      narrative: 'Dive into colourful coral gardens and relax on quiet white sand beaches.'
    };
  }

  return {
    primaryColor: '#D6A85F',
    secondaryColor: '#78917A',
    glowClass: 'bg-swiss-glow',
    textAccent: 'text-gradient-gold',
    badgeColor: 'border-[#78917A]/35 text-[#78917A]',
    badgeBg: 'bg-[#78917A]/15 text-[#78917A] border-[#78917A]/20',
    lineAccent: 'border-[#78917A]/40',
    mood: 'Curated Adventure',
    effects: [],
    localSecret: 'Ask local hosts for the private sunrise overlook pathway away from the main safari trails.',
    travelerMemory: 'The smell of fresh morning dew and the raw power of wild animals in their natural habitats.',
    bestPhotoSpot: 'The high outlook deck at golden hour.',
    bestSunriseTime: '06:00 AM',
    bestSeason: 'Year-round',
    culturalInsight: 'Greet local elders first; show patience and respect in all community interactions.',
    travelQuote: 'The wilderness holds a thousand hidden stories.',
    narrative: 'Embark on pristine treks and slow expeditions designed to align with your travel passport.'
  };
}
