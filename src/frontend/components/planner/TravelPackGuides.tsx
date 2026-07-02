"use client";

const PACKING_GUIDES: Record<string, string[]> = {
  ladakh: ['thermal layers', 'windbreaker jacket', 'polarized sunglasses', 'cold cream', 'lip balm', 'hydration tablets'],
  kashmir: ['wool sweaters', 'warm shawl', 'waterproof boots', 'hand warmers', 'thermals'],
  varanasi: ['light cotton wear', 'comfortable walking shoes', 'scarf (for temples)', 'sunscreen', 'insect repellent'],
  kerala: ['light cotton wear', 'rain jacket', 'sandals', 'umbrella', 'sunscreen'],
  goa: ['beachwear', 'light linens', 'sunglasses', 'flip-flops', 'sunscreen'],
  default: ['light cotton wear', 'comfortable walking shoes', 'sunscreen', 'umbrella/rain jacket', 'sandals'],
};

const FOOD_HIGHLIGHTS: Record<string, string[]> = {
  varanasi: ['Tamatar Chaat (Deena Chaat)', 'Malaiyyo (Blue Lassi)', 'Kachori Sabzi at Kashi Chaat'],
  goa: ['Goan Fish Curry with Rice', 'Feni & Bebinca', 'Vindaloo (Pork or Veg)'],
  kerala: ['Kerala Sadya (Banana Leaf Meal)', 'Appam with Stew', 'Karimeen Pollichathu'],
  ladakh: ['Thukpa (Noodle Soup)', 'Momos with Spicy Chutney', 'Butter Tea (Gur Gur Chai)'],
  kashmir: ['Wazwan (Multi-Course Feast)', 'Rogan Josh', 'Kashmiri Kahwa Tea'],
  udaipur: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi'],
  jaisalmer: ['Ker Sangri', 'Dal Baati', 'Gatte ka Pulao'],
  munnar: ['Kerala Parotta with Kurma', 'Puttu and Kadala Curry', 'Fresh Tea Tasting'],
  hampi: ['Bisi Bele Bath', 'Ragi Mudde', 'Filter Coffee'],
  cherrapunji: ['Jadoh (Rice & Pork)', 'Tungrymbai (Fermented Soybean)', 'Pumaloi (Steamed Rice)'],
  andaman: ['Fresh Coconut Fish Curry', 'Grilled Lobster', 'Tropical Fruit Platter'],
  default: ['Local Thali Platter', 'Regional Street Food Special', 'Traditional Sweet Delicacy'],
};

function getKey(destination: string): string {
  const d = destination.toLowerCase();
  if (d.includes('ladakh')) return 'ladakh';
  if (d.includes('kashmir')) return 'kashmir';
  if (d.includes('varanasi')) return 'varanasi';
  if (d.includes('kerala') || d.includes('houseboat')) return 'kerala';
  if (d.includes('goa')) return 'goa';
  if (d.includes('udaipur') || d.includes('mewar')) return 'udaipur';
  if (d.includes('jaisalmer') || d.includes('fort')) return 'jaisalmer';
  if (d.includes('munnar') || d.includes('tea')) return 'munnar';
  if (d.includes('hampi') || d.includes('ruins')) return 'hampi';
  if (d.includes('cherrapunji') || d.includes('roots')) return 'cherrapunji';
  if (d.includes('andaman') || d.includes('reefs')) return 'andaman';
  return 'default';
}

export default function TravelPackGuides({ destination, month }: { destination: string; month: string }) {
  const key = getKey(destination);
  const packingList = PACKING_GUIDES[key] || PACKING_GUIDES.default;
  const foodHighlights = FOOD_HIGHLIGHTS[key] || FOOD_HIGHLIGHTS.default;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left">
      <div className="bg-surface border border-border/70 p-6 rounded-2xl shadow-sm">
        <h4 className="font-display text-sm font-semibold text-night lowercase mb-3">recommended outfits ({month})</h4>
        <ul className="space-y-2">
          {packingList.map(item => (
            <li key={item} className="text-xs text-muted/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-surface border border-border/70 p-6 rounded-2xl shadow-sm">
        <h4 className="font-display text-sm font-semibold text-night lowercase mb-3">culinary highlights</h4>
        <ul className="space-y-2">
          {foodHighlights.map(dish => (
            <li key={dish} className="text-xs text-muted/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" /> {dish}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
