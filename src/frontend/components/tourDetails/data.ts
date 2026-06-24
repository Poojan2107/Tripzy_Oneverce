export type CulturalContext = {
  tagline: string;
  context: string;
  etiquette: string[];
  mustDo: string[];
  avoid: string[];
};

export const CULTURAL_CONTEXT: Record<string, CulturalContext> = {
  'varanasi-spiritual': {
    tagline: 'One of the oldest living cities on earth',
    context: 'Varanasi has been a center of Hindu pilgrimage for over 3,000 years. Every ghat along the 5km riverfront has its own ritual purpose — from cremations at Manikarnika to morning bathers at Dashashwamedh. The city operates on a spiritual time zone entirely its own.',
    etiquette: ['Remove shoes before entering any temple or ghat area', 'Dress conservatively — cover shoulders and knees', 'Do not photograph cremation ceremonies without explicit permission', 'Accept chai from chai wallahs — it is part of local hospitality'],
    mustDo: ['Dawn boat ride at 5:30 AM to see morning rituals', 'Ganga Aarti at Dashashwamedh Ghat at sunset', 'Explore the narrow lanes of Vishwanath Gali for street food', 'Visit a silk weaving workshop in the old city'],
    avoid: ['Entering the main Kashi Vishwanath Temple without ID proof', 'Touching any sacred ritual items or flowers on ghats']
  },
  'jaisalmer-fort': {
    tagline: 'A living medieval city carved in golden sandstone',
    context: 'The Sonar Quila (Golden Fort) of Jaisalmer is one of the few living forts in the world — thousands of residents still inhabit its narrow lanes. Built in 1156 AD, its sandstone walls glow golden at sunset. The city is also the gateway to the Thar Desert, which covers 25% of India.',
    etiquette: ['Water is scarce in the desert — use it mindfully', 'Bargain gently at bazaars — it is expected but be respectful', 'Ask permission before photographing local women', 'Always carry cash — card machines are unreliable in remote desert areas'],
    mustDo: ['Watch sunset from Vyas Chhatri cenotaphs overlooking the dunes', 'Spend a night in a luxury desert glamping tent at Sam', 'Walk the "Patwon Ki Haveli" — five connected havelis with intricate carving', 'Overnight camel safari watching the Milky Way'],
    avoid: ['Visiting during May-June — extreme heat (50°C)', 'Bargaining aggressively at craft guilds — artisans live on fair prices']
  },
  'kerala-houseboats': {
    tagline: 'God\'s Own Country — where time slows to a drift',
    context: 'Kerala\'s backwaters are a 900km network of interconnected canals, rivers and lakes running parallel to the Arabian Sea. The iconic Kettuvallam houseboats are made entirely of jackfruit wood and palm leaves — and were once used to carry rice and spices along the trade routes.',
    etiquette: ['Remove footwear before boarding any houseboat', 'Avoid wearing swimwear on public backwater banks — locals may be offended', 'Accept a banana leaf meal the traditional way — with your right hand', 'Tip your houseboat cook generously — they wake at dawn to prepare your meals'],
    mustDo: ['Board the houseboat before noon to catch the full day on the water', 'Try karimeen pollichathu — pearl spot fish wrapped in banana leaf', 'Watch fishermen cast their Chinese fishing nets at dusk in Fort Kochi', 'Attend a traditional Kathakali performance at Kerala Kalamandalam'],
    avoid: ['Visiting Alleppey in June-August — monsoon makes boat cruises rough', 'Selecting unlicensed operators — safety standards vary widely']
  },
  'ladakh-passes': {
    tagline: 'The roof of the world — where prayers float on wind flags',
    context: 'Ladakh sits at 11,500ft above sea level and holds some of the highest motorable passes on earth. The region is a cultural crossroads of Tibetan Buddhism, Islamic tradition, and ancient nomadic herding culture. Less than 350mm of rain falls annually — making it a cold desert.',
    etiquette: ['Acclimatize for at least 2 full days before any high-altitude trek', 'Walk clockwise around Buddhist stupas and monasteries', 'Always ask a monk before photographing inside prayer halls', 'Carry Diamox altitude tablets and drink at least 4L water daily'],
    mustDo: ['Witness morning puja (prayers) at Hemis or Thiksey Monastery at 6 AM', 'Drive over the Khardung La Pass at 18,380ft — world\'s highest motorable road', 'Watch the sunrise color shift on Pangong Tso — 4 distinct hues in 20 minutes', 'Stay in a traditional Ladakhi mud-brick homestay in Nubra Valley'],
    avoid: ['Skipping acclimatization days — altitude sickness is serious', 'Visiting October-May — the Leh-Manali highway is closed by snow']
  },
  'kashmir-meadows': {
    tagline: 'The Paradise Valley — a garden of Mughal emperors',
    context: 'The Kashmir Valley has been called "Paradise on Earth" since the Mughal period. Emperors built elaborate garden terraces here to escape Delhi\'s heat. The Dal Lake, covering 18 sq km, hosts a floating community of 50,000 people living on Shikaras and houseboats.',
    etiquette: ['Check government advisories before travel — conditions can change', 'Always hire a registered government-approved guide for trekking', 'Women should carry a scarf — draping it shows cultural respect', 'Bargain politely in the famous Lal Chowk handicraft markets'],
    mustDo: ['Take a Shikara at sunrise to see the floating flower market on Dal Lake', 'Visit the saffron fields of Pampore in October during harvest season', 'Ride the Gulmarg Gondola to 13,780ft for alpine meadow views', 'Order a full Kashmiri Wazwan feast — 36-course royal banquet'],
    avoid: ['Venturing to border areas near LoC without military clearance', 'Visiting during late July-August — peak monsoon, leeches in trekking paths']
  },
  'udaipur-mewar': {
    tagline: 'The Venice of the East — royal palaces rising from still water',
    context: 'Udaipur was founded in 1558 by Maharana Udai Singh II. The city sits beside five interconnected lakes and is famous for its palace architecture. The City Palace — the largest palace complex in Rajasthan — was home to 22 successive Maharanas of the Mewar dynasty.',
    etiquette: ['Dress smartly to enter the City Palace museum — casual wear is acceptable', 'Hire a local licensed guide inside the City Palace — they decode the art', 'Reserve the Lake Palace restaurant well in advance — it fills up weeks ahead', 'Photography is permitted in most palace rooms except private chambers'],
    mustDo: ['Sunset boat cruise on Lake Pichola past the floating Lake Palace', 'Watch the Bagore Ki Haveli traditional folk dance show at 7 PM', 'Walk Jagdish Temple and the silver market in the old city bazaar', 'Stay or dine at a heritage haveli with views over the lake'],
    avoid: ['Visiting in May — peak summer, temperature can reach 43°C', 'Selecting standard hotel boats — private charters offer far better views']
  },
  'munnar-tea': {
    tagline: 'Rolling green carpets of the Western Ghats',
    context: 'Munnar sits at 6,000ft in the Anaimalai range. It was developed by British planters in the 1870s and now produces 10% of India\'s tea. The town itself sits at the junction of three rivers — Muthirapuzha, Nallathanni, and Kundaly — which give it an unusually temperate climate year-round.',
    etiquette: ['Dress in layers — mornings are misty and cold even in summer', 'Do not pluck tea leaves — estate theft carries heavy fines', 'Support family-run homestays over chain resorts for authentic meals', 'Buy spices directly from certified spice guilds for fair trade prices'],
    mustDo: ['Walk into a live tea factory to see withering, rolling, and firing steps', 'Spot Nilgiri Tahr (endangered mountain goat) at Eravikulam National Park', 'Trek the Lockhart Gap ridge at sunrise for panoramic valley views', 'Try homemade cardamom-infused tea at a local estate bungalow'],
    avoid: ['Visiting in July-August — heavy monsoon rains close many trails', 'Trusting unofficial guides who take commissions from shops']
  },
  'goa-beach': {
    tagline: 'Where Portuguese spice meets Indian sea',
    context: 'Goa was a Portuguese colony for 450 years until 1961 — far longer than the British ruled most of India. This heritage left behind a unique blend of Catholic churches, Indo-Portuguese mansions, and a food culture where kokum, coconut, and fresh seafood dominate. The state has 105km of pristine coastline.',
    etiquette: ['Topless sunbathing is now prohibited on all public beaches in Goa', 'Respect the local Sunday church-going culture in Old Goa villages', 'Cashew feni is potent — drink slowly. It is around 42% alcohol', 'Wear shoes at Fontainhas heritage walk — narrow cobblestone streets'],
    mustDo: ['Walk the Latin Quarter at Fontainhas in the early morning before crowds', 'Try a full Goan fish curry rice at a local beach shack — not hotel restaurants', 'Explore the spice plantation at Savoi for organic black pepper and nutmeg', 'Catch the sunset at Chapora Fort for the best view of North Goa'],
    avoid: ['Going to Baga or Calangute in December — extremely overcrowded', 'Renting vehicles without proper license — traffic police are strict']
  },
  'hampi-ruins': {
    tagline: 'A surreal boulder kingdom frozen in medieval time',
    context: 'Hampi was the capital of the Vijayanagara Empire — the wealthiest city on earth in the 1500s, with a population of over 500,000. The empire fell to the Deccan Sultanates in 1565 in the Battle of Talikota. Today the ruins cover 4,100 hectares — a UNESCO World Heritage Site.',
    etiquette: ['Do not climb on protected temple structures — heavy fines apply', 'Remove footwear inside all temple complexes including Vittala Temple', 'The Tungabhadra coracle boat crossing is only available at certain ghats', 'Respect local religious activity — some temples have active daily puja'],
    mustDo: ['Climb Matanga Hill before sunrise — best panoramic view of the ruins', 'See the famous musical stone pillars of Vijaya Vittala Temple', 'Cross the Tungabhadra river by coracle boat to the hippie island', 'Explore the royal enclosure — the Queen\'s Bath and elephant stables'],
    avoid: ['Visiting in April-May — extreme heat makes boulder climbing dangerous', 'Missing the Hemakuta Hill sunset — views over the ruins are unforgettable']
  },
  'kutch-salt': {
    tagline: 'An endless white horizon where sky and earth become one',
    context: 'The Rann of Kutch is the world\'s largest salt desert — a seasonal wetland that floods during monsoon and dries into a cracked white expanse from November to February. The region supports one of India\'s oldest craft traditions — embroidery, mirror work, and Rogan painting — practiced by semi-nomadic communities.',
    etiquette: ['Carry permits for the restricted areas near the Pakistan border — issued at Khavda', 'Buy directly from artisan guilds — many middlemen sell imitation work as authentic', 'Wear sun-protective clothing on the Rann — UV intensity at ground level is extreme', 'The Tent City resort requires advance reservation — closes in March each year'],
    mustDo: ['Walk onto the white salt expanse during a full moon night — no light pollution', 'Visit Nirona village to watch the last surviving Rogan painting family at work', 'Explore the Kala Dungar (Black Hills) for a panoramic view of the desert', 'Attend the Rann Utsav cultural festival (November-February) for folk music'],
    avoid: ['Visiting May-October — the entire Rann is flooded and inaccessible', 'Buying craft items from Bhuj roadside stalls — many are machine-made replicas']
  },
  'cherrapunji-roots': {
    tagline: 'The wettest place on earth — a living cathedral of forest',
    context: 'Cherrapunji (officially called Sohra) receives over 12,000mm of rain annually — making it among the wettest places on earth. The Khasi tribe here developed a unique bio-engineering technique over centuries — training rubber tree roots across rivers to create natural living bridges that strengthen over time.',
    etiquette: ['Hire a local Khasi guide for the Nongriat root bridge trek — trails are unmarked', 'The 3,000-step descent to the bridges is strenuous — carry trekking poles', 'Do not touch or damage any root bridge — they take 10-15 years to grow', 'Stay in locally-owned homestays in Nongriat village to support the community'],
    mustDo: ['Trek down to the double-decker living root bridge at Nongriat village', 'Swim in the natural blue pool at Nongriat — crystal clear mountain water', 'Walk through Mawlynnong — Asia\'s cleanest village', 'See the Nohkalikai Falls viewpoint — 340m plunge, India\'s tallest waterfall'],
    avoid: ['Trekking in June-August — extremely slippery trails, some closures', 'Visiting Dawki during weekends in winter — extremely crowded since viral social media']
  },
  'andaman-reefs': {
    tagline: 'Pristine sapphire seas where time still moves slowly',
    context: 'The Andaman Islands are part of an archipelago of 572 islands — only 38 of which are inhabited. The islands were isolated from outside contact until the 1800s. The coral reefs here are among the most biodiverse in Asia, supporting over 200 species of hard coral and 1,300 species of fish.',
    etiquette: ['Use only reef-safe sunscreen — chemical sunscreens are killing the coral', 'The Jarawa Tribe Reserve is strictly off-limits — do not interact with them', 'Select PADI-certified dive operators only — others may cut safety corners', 'The cellular jail has a mandatory minimum 1-hour light and sound show — reserve ahead'],
    mustDo: ['Snorkel at Elephant Beach, Havelock — easy access, stunning coral gardens', 'Kayak through the mangrove tunnels at night for bioluminescence', 'Visit the Cellular Jail for the evening light and sound show at 6 PM', 'Take the government catamaran to Neil Island for a quieter beach experience'],
    avoid: ['Visiting May-November — cyclone season, ferries are frequently cancelled', 'Booking private boats for island hopping — only use licensed ferry services']
  }
};

export const NEARBY_DAYTRIPS: Record<string, Array<{ name: string; distance: string; type: string }>> = {
  'varanasi-spiritual': [{ name: 'Sarnath Buddhist Ruins', distance: '10 km', type: 'Heritage' }, { name: 'Ramnagar Fort', distance: '14 km', type: 'Palace' }, { name: 'Chunar Fort', distance: '40 km', type: 'History' }],
  'jaisalmer-fort': [{ name: 'Kuldhara Ghost Village', distance: '18 km', type: 'Ruins' }, { name: 'Sam Sand Dunes', distance: '42 km', type: 'Desert' }, { name: 'Gadisar Lake', distance: '2 km', type: 'Nature' }],
  'kerala-houseboats': [{ name: 'Kumarakom Bird Sanctuary', distance: '15 km', type: 'Wildlife' }, { name: 'Ambalapuzha Temple', distance: '12 km', type: 'Spiritual' }, { name: 'Kuttanad — Venice of East', distance: '20 km', type: 'Waterway' }],
  'ladakh-passes': [{ name: 'Pangong Tso Lake', distance: '160 km', type: 'Nature' }, { name: 'Nubra Valley', distance: '150 km', type: 'Landscape' }, { name: 'Tso Moriri Lake', distance: '240 km', type: 'Remote' }],
  'kashmir-meadows': [{ name: 'Gulmarg Meadow & Gondola', distance: '56 km', type: 'Alpine' }, { name: 'Pahalgam Valley', distance: '95 km', type: 'Trek' }, { name: 'Yusmarg Meadows', distance: '47 km', type: 'Pastoral' }],
  'udaipur-mewar': [{ name: 'Kumbhalgarh Fort & Wall', distance: '84 km', type: 'Heritage' }, { name: 'Ranakpur Jain Temples', distance: '90 km', type: 'Spiritual' }, { name: 'Chittorgarh Fort Ruins', distance: '115 km', type: 'History' }],
  'munnar-tea': [{ name: 'Eravikulam National Park', distance: '13 km', type: 'Wildlife' }, { name: 'Mattupetty Dam & Lake', distance: '13 km', type: 'Nature' }, { name: 'Chinnakanal Waterfalls', distance: '22 km', type: 'Waterfalls' }],
  'goa-beach': [{ name: 'Dudhsagar Waterfalls', distance: '60 km', type: 'Waterfall' }, { name: 'Cotigao Wildlife Sanctuary', distance: '80 km', type: 'Wildlife' }, { name: 'Old Goa Churches', distance: '9 km', type: 'Heritage' }],
  'hampi-ruins': [{ name: 'Daroji Sloth Bear Sanctuary', distance: '15 km', type: 'Wildlife' }, { name: 'Tungabhadra Dam View', distance: '13 km', type: 'Landscape' }, { name: 'Anegundi Palace Village', distance: '5 km', type: 'Heritage' }],
  'kutch-salt': [{ name: 'Wild Ass Sanctuary, Little Rann', distance: '210 km', type: 'Wildlife' }, { name: 'Mandvi Beach & Palace', distance: '60 km', type: 'Coastal' }, { name: 'Dholavira Indus Site', distance: '250 km', type: 'Ancient' }],
  'cherrapunji-roots': [{ name: 'Dawki River Border Viewpoint', distance: '82 km', type: 'Scenic' }, { name: 'Mawsynram — Wettest Village', distance: '16 km', type: 'Record' }, { name: 'Krem Mawmluh Cave', distance: '3 km', type: 'Spelunking' }],
  'andaman-reefs': [{ name: 'Neil Island — Coral Garden', distance: '37 km', type: 'Reef' }, { name: 'Baratang Limestone Caves', distance: '100 km', type: 'Geology' }, { name: 'Barren Island Volcano', distance: '135 km', type: 'Volcano' }]
};
