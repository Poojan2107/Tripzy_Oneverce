import { Waves, BookOpen, Mountain, Compass, User, Heart, Users } from 'lucide-react';

export const WIZARD_STYLE_OPTIONS = [
  { id: 'Nature', label: 'Nature Lover', desc: 'Mountains, lakes, forests, wildlife', color: '#148596', bg: 'bg-[#148596]/15', border: 'border-[#148596]/30 active:border-[#148596] selected:border-[#148596]', icon: Waves },
  { id: 'Culture', label: 'Culture Seeker', desc: 'Heritage, local culture, traditions', color: '#E6355A', bg: 'bg-[#E6355A]/15', border: 'border-[#E6355A]/30 active:border-[#E6355A] selected:border-[#E6355A]', icon: BookOpen },
  { id: 'Adventure', label: 'Adventure Junkie', desc: 'Thrills, treks, and adrenaline', color: '#286F98', bg: 'bg-[#286F98]/15', border: 'border-[#286F98]/30 active:border-[#286F98] selected:border-[#286F98]', icon: Mountain },
  { id: 'Relaxation', label: 'Peace Seeker', desc: 'Relaxation, wellness, and slow travel', color: '#FDB62F', bg: 'bg-[#FDB62F]/15', border: 'border-[#FDB62F]/30 active:border-[#FDB62F] selected:border-[#FDB62F]', icon: Compass }
];

export const COMPANION_OPTIONS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Slow reflection & independence', icon: User },
  { id: 'couple', label: 'Couple Escape', desc: 'Designed for private memory-making', icon: Heart },
  { id: 'family', label: 'Family Journey', desc: 'Relaxed pacing for everyone', icon: Users },
  { id: 'friends', label: 'Group Expedition', desc: 'Bespoke shared flow & discovery', icon: Users },
];

export const ENERGY_OPTIONS = [
  { id: 'peaceful', label: 'Slow & Peaceful', desc: 'Highly relaxed, deep immersion, few stops' },
  { id: 'deep_cultural', label: 'Deep Cultural', desc: 'Focus on history, local guilds, and rituals' },
  { id: 'adventure_packed', label: 'High Intensity', desc: 'Active crossings, bouldering, and boat treks' },
  { id: 'photography', label: 'Photography Focused', desc: 'Sunrise vantage spots and golden hour guides' },
  { id: 'food_focused', label: 'Food Focused', desc: 'Local bazaars, cooking steps, and estate tea' },
];

export const DURATION_OPTIONS = [
  { id: 'weekend', label: 'Weekend Reset', desc: '2 - 3 Days', days: 3 },
  { id: 'short', label: '4 - 6 Days', desc: 'Mid-week escape', days: 5 },
  { id: 'week', label: 'One Week', desc: '7 Days exploration', days: 7 },
  { id: 'extended', label: 'Two Weeks', desc: '14 Days grand journey', days: 14 },
];

export const LOADING_MESSAGES = [
  "Plotting coordinates for your explorer log...",
  "Consulting local archives for hidden gems...",
  "Weaving your journey chapters together...",
  "Adding photography spots and local secrets...",
];

export const PLANNER_STEPS = [
  { step: 1, title: "Who's Traveling?", desc: 'Choose your travel style' },
  { step: 2, title: 'Who Are You Traveling With?', desc: 'Companion & destination' },
  { step: 3, title: 'What Pace Fits You?', desc: 'Daily rhythm preference' },
  { step: 4, title: 'Craft Your Journey', desc: 'Duration & budget' },
  { step: 5, title: 'Review & Launch', desc: 'Finalize your companion journal' }
];

export const DEST_CUISINE: Record<string, string> = {
  'varanasi-spiritual': 'Kachori sabzi · Banarasi paan · Malaiyyo · Thandai · Street side chai',
  'jaisalmer-fort': 'Dal baati churma · Ker sangri · Gatte ki sabzi · Bajra roti · Desert thali',
  'kerala-houseboats': 'Kerala sadya · Appam with stew · Karimeen pollichathu · Puttu & kadala',
  'ladakh-passes': 'Thukpa · Momos · Skyu · Butter tea · Apricot jam & Tibetan bread',
  'kashmir-meadows': 'Wazwan feast · Rogan josh · Yakhni · Kashmiri pulao · Kahwa tea',
  'udaipur-mewar': 'Dal baati churma · Laal maas · Gatte · Mawa kachori · Rajasthani thali',
  'munnar-tea': 'Kerala sadya · Appam with vegetable stew · Fresh tea · Banana chips',
  'goa-beach': 'Fish curry rice · Prawn balchão · Bebinca · Pork vindaloo · Feni',
  'hampi-ruins': 'South Indian thali · Bisi bele bath · Filter coffee · Holige',
  'kutch-salt': 'Kutchi dabeli · Bajra roti · Kadhi · Khaman · Chaas',
  'cherrapunji-roots': 'Jadoh · Doh neiiong · Tungrymbai · Pukhlein · Rice beer',
  'andaman-reefs': 'Fresh seafood · Coconut prawn curry · Grilled lobster · Banana fritters',
};

export const DEST_TRANSPORT: Record<string, string> = {
  'varanasi-spiritual': 'Cycle rickshaw · Auto-rickshaw · Boat ghat crossing · Walking the narrow lanes',
  'jaisalmer-fort': 'Camel safari · Jeep safari · Auto-rickshaw · Private taxi from Jaisalmer station',
  'kerala-houseboats': 'Houseboat · Local ferry · Autorickshaw · Private cab with driver',
  'ladakh-passes': 'SUV/taxi hire · Shared jeep · Mountain bike · Local bus (limited)',
  'kashmir-meadows': 'Shikara on Dal Lake · Gondola at Gulmarg · Private taxi · Local bus',
  'udaipur-mewar': 'Boat on Lake Pichola · Auto-rickshaw · Cycle rickshaw · Palace on wheels',
  'munnar-tea': 'Private taxi · Local bus · Jeep safari to tea estates · Walking trails',
  'goa-beach': 'Scooter/bike rental · Taxi · Local bus · Ferry to islands',
  'hampi-ruins': 'Auto-rickshaw · Cycle rickshaw · Bicycle · Coracle boat on river',
  'kutch-salt': '4x4 jeep · Private taxi · Bus to Bhuj · Camel cart in villages',
  'cherrapunji-roots': 'Private taxi · Local sumo · Walking trails through villages',
  'andaman-reefs': 'Ferry to islands · Scooter at Havelock · Private cab · Boat taxi',
};

export const DEST_PHOTO: Record<string, string> = {
  'varanasi-spiritual': 'Dashashwamedh Ghat at dawn · Narrow lanes of old city · Ganga Aarti flames · Silk looms',
  'jaisalmer-fort': 'Golden Fort at sunset · Sam Sand Dunes · Haveli carvings · Desert night sky',
  'kerala-houseboats': 'Backwaters at golden hour · Tea gardens in Munnar · Chinese fishing nets · Kathakali performer',
  'ladakh-passes': 'Pangong Lake blues · Khardung La pass · Hemis Monastery · Starry sky at Nubra',
  'kashmir-meadows': 'Dal Lake sunrise · Mughal gardens · Gulmarg meadows · Saffron fields in bloom',
  'udaipur-mewar': 'Lake Pichola sunset · City Palace from water · Jag Mandir · Haveli architecture',
  'munnar-tea': 'Tea plantation rows · Nilgiri Tahr at Eravikulam · Misty hills · Waterfalls',
  'goa-beach': 'Anjuna sunset · Portuguese colonial architecture · Dudhsagar Falls · Spice garden flora',
  'hampi-ruins': 'Stone chariot at sunrise · Matanga Hill panorama · Vijaya Vittala temple · Boulders at Tungabhadra',
  'kutch-salt': 'White Rann at sunset · Kala Dungar view · Mirror work textiles · Desert wildlife',
  'cherrapunji-roots': 'Living root bridges · Nohkalikai Falls · Dawki River · Seven Sisters Falls',
  'andaman-reefs': 'Radhanagar Beach sunset · Coral reefs underwater · Cellular Jail · Mangrove creeks',
};

export const DEST_PACKING: Record<string, string> = {
  'varanasi-spiritual': 'Light cotton clothes · Walking shoes · Shawl for morning boat ride · Power bank · Reusable water bottle',
  'jaisalmer-fort': 'Light layers · Scarf for dust · Sunscreen · Sunglasses · Comfortable walking sandals · Power bank',
  'kerala-houseboats': 'Light cottons · Rain jacket (monsoon) · Insect repellent · Sun hat · Sarong for temples',
  'ladakh-passes': 'Thermal layers · Windproof jacket · Sunglasses · Lip balm · Sunscreen · Altitude sickness meds',
  'kashmir-meadows': 'Warm jacket · Waterproof shoes · Merino wool layers · Gloves in winter · Sunglasses',
  'udaipur-mewar': 'Light cottons · Scarf for temple visits · Sun hat · Camera · Comfortable walking shoes',
  'munnar-tea': 'Light layers · Rain jacket · Walking shoes · Insect repellent · Reusable water bottle',
  'goa-beach': 'Swimwear · Light cottons · Flip-flops · Sunscreen · Sunglasses · Beach bag',
  'hampi-ruins': 'Walking shoes · Sun hat · Sunscreen · Light layers · Water bottle · Comfy backpack',
  'kutch-salt': 'Light layers · Sun protection · Dust mask · Sunglasses · Scarf · Power bank',
  'cherrapunji-roots': 'Rain jacket · Waterproof shoes · Quick-dry clothes · Insect repellent · Torch/headlamp',
  'andaman-reefs': 'Swimwear · Snorkel gear (optional) · Reef-safe sunscreen · Light cottons · Flip-flops · Insect repellent',
};
