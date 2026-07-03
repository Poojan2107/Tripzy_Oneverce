/** Simulated rich AI response for when Gemini API is unavailable.
 *  Covers all 18 card types in the renderer so the UI can be verified end-to-end. */

function detectPlace(text: string, fallback = "Goa"): string {
  const low = text.toLowerCase();
  if (low.includes("goa")) return "Goa";
  if (low.includes("varanasi")) return "Varanasi";
  if (low.includes("kerala")) return "Kerala";
  if (low.includes("udaipur")) return "Udaipur";
  if (low.includes("rajasthan")) return "Rajasthan";
  if (low.includes("himachal")) return "Himachal";
  if (low.includes("ladakh")) return "Ladakh";
  if (low.includes("delhi")) return "Delhi";
  if (low.includes("mumbai")) return "Mumbai";
  return fallback;
}

function makeFollowUp(destination: string, topic: string): string {
  return topic;
}

export function getSimulatedResponse(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMsg = userMessages[userMessages.length - 1]?.content || "Goa";
  const prevMsg = userMessages.length > 1 ? userMessages[userMessages.length - 2]?.content : "";
  const isFollowUp = userMessages.length > 1;
  const place = detectPlace(isFollowUp ? prevMsg : lastMsg, "Goa");
  const lowLast = lastMsg.toLowerCase();

  // Follow-up detection — return targeted section content
  if (isFollowUp) {
    const followUps: [RegExp, string][] = [
      [/hotel|accommo?dation|stay|where\s*to\s*stay|room/i, `
## Hotels & Accommodation
**Luxury**
**The St. Regis Goa** — Beachfront elegance with a butler for every room. Infinity pool. ₹25,000–₹40,000/night.
**W Goa** — Vibrant resort, best beach bar on Vagator. ₹18,000–₹30,000/night.

**Mid-Range**
**Alila Diwa** — Boutique luxury, rice field views. ₹8,000–₹12,000/night.
**Casa Candolim** — Contemporary apartments near beach. ₹5,500–₹8,000/night.

**Budget**
**The Hosteller Vagator** — Social hostel, pool. Dorm ₹1,200, private ₹3,000.
**Tiya Cottages Palolem** — Rustic-chic beach cottages. ₹2,500–₹4,000/night.`],
      [/food|eat|cuisine|dining|restaurant|market/i, `
## Food & Dining
**Goan Fish Curry** at Mum's Kitchen — coconut-based, tangy with kokum.
**Prawn Balchão** at Fisherman's Wharf — spicy, tangy, almost pickle-like.
**Vindaloo** at Rua do Ouvidor — vinegar-based, not tomato-based.
**Bebinca** at Cafe Tato — 16-layer Goan dessert.

**Street food**: Pav bhaji in Mapusa (₹50), chicken cafreal sandwiches from Candolim stalls.
**Unique experience**: Feni distillery tour in Candolim (₹500, includes tasting).`],
      [/budget|cost|price|expenses|cheap|affordable/i, `
## Budget Breakdown
| Category | Estimated Cost |
| Transport (return flights + local) | ₹15,000–₹25,000 |
| Accommodation (4 nights) | ₹12,000–₹60,000 |
| Food (per day × 4 days) | ₹4,000–₹8,000 |
| Activities & entry fees | ₹3,000–₹5,000 |
| Miscellaneous | ₹2,000–₹4,000 |
| **Total** | **₹36,000–₹1,02,000 per person** |

Want a more specific breakdown? I can adjust for your budget range.`],
      [/weather|best time|season|monsoon|climate|when/i, `
## Weather & Best Time
Since it's July, ${place} is in monsoon season — 28°C–32°C, high humidity. Expect heavy but brief showers. The landscape is at its lushest: waterfalls roaring, hills electric green, beaches blissfully empty.

**Best time**: November–February (25°C–30°C, clear skies). Book 2+ months ahead for December.`],
      [/pack|bring|essentials|what\s*to\s*(pack|wear)|clothing/i, `
## Packing Essentials
- **Clothing**: Light cottons, a wrap for temple visits, swimwear, rain jacket.
- **Footwear**: Flip-flops, walking sandals, closed shoes for nightlife.
- **Gear**: Reef-safe sunscreen, mosquito repellent, refillable water bottle, power bank.
- **Extras**: Sunglasses, a good book, a hammock.`],
      [/transport|get\s*there|reach|airport|train|flight|drive|scooter|taxi/i, `
## Transport & Getting Around
**By air**: ${place} International Airport. Direct flights from Delhi (2.5 hrs), Mumbai (1 hr).
**By train**: Madgaon station. Sleeper from Mumbai ₹400–₹800 (10 hrs).
**Local**: Scooter ₹400–₹600/day (best option). Taxi ₹200 base + ₹15/km. Uber/Ola in Panjim.`],
      [/hidden|offbeat|off\s*the\s*beaten|secret|gem/i, `
## Hidden Gems
**Butterfly Beach** — Boat or 20-min forest trek from Palolem. Tiny crescent of sand, untouched forest. Sea turtles nest Nov–Feb.

**Cab de Rama Fort** — Abandoned Portuguese fort 20 km south of Palolem. Climb every tower, no tourists. Go at sunrise with your own coffee.`],
      [/photo|photography|instagram|camera|spot/i, `
## Photography Spots
**Chapora Fort at golden hour** — Vagator Beach view. Best 45 mins before sunset. Wide-angle recommended.

**Dudhsagar from the train** — Madgaon–Mumbai train crosses in front of falls at mile marker 73. Permanent rainbow on sunny days.

**Fontainhas street corners** — Yellow and blue Portuguese houses. Morning light (7:30 AM) creates perfect shadows.`],
      [/etiquette|custom|local\s*culture|namaste|dress|code/i, `
## Etiquette & Local Customs
- **Remove footwear** before temples and some churches.
- **Greet with "Namaste"** (palms together) for older locals.
- **Cover shoulders and knees** in churches.
- **Ask before photographing** locals — some expect ₹20–₹50.
- **Eat with your right hand** in traditional settings.`],
      [/avoid|scam|tourist\s*trap|danger|safe/i, `
## Things to Avoid
- **"Private beach" touts** — no private beaches exist. Lounger scam for ₹500.
- **Unregulated water sports** — insist on life jackets, never pay upfront.
- **Casino boats** — crowded and overpriced.
- **"Official" airport guides** — 3x rates with commission kickbacks.
- **Late-night swimming** — undertow is real even for strong swimmers.`],
      [/festival|event|celebrate|fair|party/i, `
## Local Festivals
**Goa Carnival (February)** — Three-day colour and music parade. Panjim turns Rio-lite.
**Feast of St. Francis Xavier (December)** — Major pilgrimage event.
**Sao Joao (June)** — Men jump into wells and ponds. Celebrate near Mapusa.
**Ganesh Chaturthi (Aug–Sept)** — Idol immersions at Panjim riverside.`],
      [/nearby|day\s*trip|side\s*trip|around|hampi|gokarna/i, `
## Nearby Destinations
**Hampi (6 hr drive)** — UNESCO giant boulder landscape. 2-night extension. Overnight sleeper ₹400.
**Gokarna (2.5 hr drive)** — Goa 30 years ago. Five beaches, clifftop trails.
**Mumbai (1 hr flight)** — India's most electric city. Flights from ₹2,500.`],
    ];

    for (const [re, response] of followUps) {
      if (re.test(lowLast)) {
        return `Great question! Here's what I know about that for ${place}:${response}

Want to dive deeper into another section — or shall I adjust something?`;
      }
    }

    // Generic follow-up — try to detect a new destination
    if (lowLast.includes("plan") || lowLast.includes("trip") || userMessages.length > 1 && place !== detectPlace(lastMsg, "")) {
      return getFullPlan(detectPlace(lastMsg, "Goa"));
    }

    return `I'd love to help with that! Here are a few things you might find useful for ${place}:

## Pro Tips
1. **Skip the casino boats** — crowded and overpriced.
2. **Best photo spot**: Chapora Fort at 5 PM.
3. **Cover shoulders and knees** in churches — guards are strict.
4. **Book scooter 3+ days** — rate drops to ₹300/day.
5. **Walk north from Baga Beach** — cross river at low tide for a secluded cove.

## Food & Dining
**Goan Fish Curry** at Mum's Kitchen is a must. **Prawn Balchão** at Fisherman's Wharf. End with **Bebinca** at Cafe Tato.

Which section would you like me to go deeper on?`;
  }

  return getFullPlan(place);
}

function getFullPlan(place: string): string {
  return `## Journey Overview
The first thing you notice about ${place} is the light — golden, soft, filtering through ancient banyan leaves and reflecting off whitewashed walls. By the time you've settled into your first chai at a roadside stall, you'll understand why this corner of India has captivated travellers for centuries. This isn't just a destination — it's a feeling that stays with you.

- **Destination highlights** — Pristine beaches, Portuguese-era architecture, vibrant night markets, spice plantations, dolphin spotting
- **Best for** — Solo travellers, couples, friend groups
- **Ideal duration** — 4-5 days
- **Vibe** — Relaxed, tropical, cultural, slightly bohemian

## Top Places to Visit
**Calangute Beach** — The queen of Goa's beaches. Golden sand stretches for miles, lined with shacks serving fresh kingfish. Best time: sunset. Time needed: ~2 hrs. Pro tip: walk north past the paid sunbeds for quieter stretches.

**Basilica of Bom Jesus** — A UNESCO World Heritage site housing the mortal remains of St. Francis Xavier. The baroque architecture is breathtaking. Best time: morning (9 AM — no crowds). Time needed: ~1 hr. Pro tip: cover your shoulders and knees — security is strict.

**Spice Plantation, Ponda** — Step into a fragrant world of cardamom, vanilla, and black pepper. Guided tours explain every leaf and root. Best time: 10 AM tour. Time needed: ~2.5 hrs. Pro tip: the included Goan lunch is worth arriving hungry for.

**Anjuna Flea Market** — Every Wednesday, this cliffside village transforms into a kaleidoscope of tie-dye, silver jewellery, and vintage sunglasses. Best time: morning (before heat peaks). Time needed: ~2-3 hrs. Pro tip: bargain to 60% of the asking price — start there.

**Dudhsagar Waterfalls** — A four-tiered waterfall cascading from 310m. The train bridge across it makes for an iconic photo. Best time: post-monsoon (Oct–Feb). Time needed: full day trip. Pro tip: book the shared jeep from the forest checkpoint — don't attempt walking.

**Fontainhas, Panjim** — Goa's Latin Quarter. Narrow streets lined with colourful Portuguese mansions, art galleries, and secret bars. Best time: early evening. Time needed: ~2 hrs. Pro tip: look for the blue plaque on Rua de Natal — that's the oldest house.

**Fort Aguada** — A 17th-century Portuguese fort with sweeping ocean views. The lighthouse and the freshwater spring inside are hidden highlights. Best time: sunrise. Time needed: ~1 hr. Pro tip: enter through the back gate near the Holiday Inn for a shorter walk.

## Local Experiences
**Learn to cook Goan curry** — Join a family-run cooking class in a village home. You'll grind fresh coconut masala, learn the perfect xacuti spice blend, and eat what you make. Most classes cost ₹1,500–₹2,500. Book through Goa Cooking Classes.

**Sunset dolphin cruise** — Take a traditional fishing boat from Palolem Beach. Dolphins surface at dusk, and the sky turns cotton-candy pink. Costs ₹500–₹800 per person. Skip the crowded party boats — go with a local fisherman.

**Saturday Night Market, Arpora** — More than 500 stalls selling everything from Moroccan lamps to Goan sausages. Live music, fire dancers, and a dedicated food court. Free entry. Go on an empty stomach.

## Daily Itinerary
**Day 1: Arrival & North Goa Beaches**
**Morning**: Land at Goa International Airport. Take a prepaid taxi (₹600) to your hotel in North Goa. Check in and head straight to Candolim Beach for a morning swim.
**Afternoon**: Lunch at Fisherman's Wharf (try the prawn balchão). Then explore Fort Aguada and the nearby lighthouse.
**Evening**: Dinner at Bomra's (Asian-fusion, ₹1,800 for two). Watch the sunset from the fort walls.
**Night**: Stay at The St. Regis Goa (Luxury) or a boutique villa in Assagao.

**Day 2: South Goa Exploration**
**Morning**: Drive to Palolem Beach (1 hr). Kayak through the backwaters spotting kingfishers.
**Afternoon**: Lunch at The Loft in Palolem (wood-fired pizzas, ₹800 for two). Visit the nearby butterfly beach.
**Evening**: Dinner on the beach at Cafe Lazy — literally tables in the sand under fairy lights. Order the BBQ squid.
**Night**: Stay at a beach hut in Palolem or drive back to your North Goa base.

## Hotels & Accommodation
**Luxury**
**The St. Regis Goa** — Beachfront elegance with a butler for every room. Infinity pool overlooking the Arabian Sea. ₹25,000–₹40,000/night. Best for: honeymooners and luxury seekers.
**W Goa** — Vibrant, design-forward resort with the best beach bar on Vagator. DJ sets on Sundays. ₹18,000–₹30,000/night. Best for: young couples and friend groups.

**Mid-Range**
**Alila Diwa** — Boutique luxury in South Goa. Rice field views, a stunning pool, and the best breakfast buffet in Goa. ₹8,000–₹12,000/night. Best for: couples wanting quiet luxury.
**Casa Candolim** — Contemporary apartments a 2-min walk from the beach. Full kitchen, modern bathrooms. ₹5,500–₹8,000/night. Best for: families and longer stays.

**Budget**
**The Hosteller Vagator** — Goa's best social hostel. Pool, rooftop cafe, and daily events. Dorm ₹1,200, private ₹3,000. Best for: solo backpackers.
**Tiya Cottages Palolem** — Rustic-chic beach cottages with outdoor showers. 30 seconds to the sand. ₹2,500–₹4,000/night. Best for: budget-conscious couples.

## Food & Dining
**Signature dishes**
- **Goan Fish Curry** — The quintessential dish. Coconut-based, tangy with kokum, loaded with fresh kingfish. Best at: Mum's Kitchen, Panjim.
- **Prawn Balchão** — Spicy, tangy, almost pickle-like prawn preparation. Best at: Fisherman's Wharf.
- **Vindaloo** — The original Goan vindaloo is vinegar-based, not tomato-based. Pork is traditional. Best at: Rua do Ouvidor, Panjim.
- **Bebinca** — A 16-layer Goan dessert made with coconut milk, egg yolks, and jaggery. Best at: Cafe Tato, Panjim.
- **Feni** — The local spirit made from cashew apples. A must-try for adventurous palates. Best at: any local bar (₹80 a peg).

**Street food**
- **Pav bhaji** in Mapusa market — ₹50 and life-changing.
- **Chicken cafreal sandwiches** from the stalls outside Candolim.
- **Fresh tender coconut** from any beach — ₹30.

**Unique experience**: Join a Feni distillery tour in Candolim. ₹500 per person, includes tasting.

## Budget Breakdown
| Category | Estimated Cost |
| Transport (return flights + local) | ₹15,000–₹25,000 |
| Accommodation (4 nights) | ₹12,000–₹60,000 |
| Food (per day × 4 days) | ₹4,000–₹8,000 |
| Activities & entry fees | ₹3,000–₹5,000 |
| Miscellaneous | ₹2,000–₹4,000 |
| **Total** | **₹36,000–₹1,02,000 per person** |

## Transport & Getting Around
**By air**: Goa International Airport (GOI) — direct flights from Delhi (2.5 hrs), Mumbai (1 hr), Bangalore (1 hr). Prepaid taxi ₹600 to North Goa, ₹1,200 to South Goa.

**By train**: Madgaon (45 mins from airport) or Thivim (closer to North Goa). Sleeper trains from Mumbai (₹400–₹800, 10 hrs).

**Local transport**: 
- Scooter rental: ₹400–₹600/day (most popular option)
- Taxi (non-app): ₹200 base + ₹15/km — negotiate before getting in
- Uber/Ola: available in Panjim and major tourist areas
- Local bus: ₹10–₹30 but unreliable for tourists

**Pro tip**: Download "GoaMiles" app — it's the most reliable taxi service here.

## Packing Essentials
- **Clothing**: Light cottons and linens. A wrap for church visits. Swimwear (multiple — they take time to dry). Light rain jacket (monsoon season June–Sept).
- **Footwear**: Flip-flops (essential), walking sandals, one pair of closed shoes for nightlife.
- **Gear**: Reef-safe sunscreen, mosquito repellent (Dengue is real), refillable water bottle, power bank.
- **Extras**: Sunglasses, a good book, and a hammock if you plan on beach time.

## Weather & Best Time
Since it's July, Goa is in the middle of monsoon season. Expect heavy but brief showers — 28°C–32°C, high humidity. The landscape is at its lushest: waterfalls are roaring, hills are electric green, and the beaches are blissfully empty. Pack a rain jacket and waterproof shoes. The best time to visit is November–February (25°C–30°C, clear skies, peafowl in full dance).

## Pro Tips
1. **Skip the casino boats** — they're crowded, overpriced, and nothing like Vegas. Instead, visit a beach shack for sunset drinks.
2. **Best photo spot**: Chapora Fort at 5 PM. The view of Vagator Beach curving into the Arabian Sea is unbeatable.
3. **When visiting a church** — cover your shoulders and knees. Guards at Basilica of Bom Jesus will turn you away otherwise, even at 35°C.
4. **Book your scooter for 3+ days** — the daily rate drops to ₹300/day instead of ₹500.
5. **Walk north from Baga Beach** — cross the small river at low tide to reach a secluded cove that 90% of tourists miss.

## Hidden Gems
**Butterfly Beach** — Accessible only by boat or a 20-min forest trek from Palolem. It's a tiny crescent of sand surrounded by untouched forest. Sea turtles nest here between November and February. The water is impossibly clear. Take only photos — this place needs preservation.

**Cab de Rama Fort** — An abandoned Portuguese fort 20 km south of Palolem. You can climb every crumbling tower, and on a clear day, you'll see the Western Ghats from the ramparts. There's nobody selling tickets or chai — that's part of its charm. Go at sunrise with your own coffee.

## Photography Spots
**Chapora Fort at golden hour** — The view of Vagator Beach from the fort's highest rampart. The light paints everything in amber and terracotta. Best time: 45 mins before sunset. Bring a wide-angle lens.

**Dudhsagar Waterfalls from the train** — The Madgaon–Mumbai train crosses directly in front of the falls. Lean out of the door (carefully) at mile marker 73. The spray creates a permanent rainbow on sunny days.

**Fontainhas street corners** — Every corner in this Latin Quarter is a photo. Look for the yellow and blue Portuguese houses with red-tiled roofs. The morning light (7:30 AM) creates perfect shadows.

## Etiquette & Local Customs
- **Remove your footwear** before entering temples and some churches. There's usually a shoe stand outside (₹5–₹10).
- **Greet with "Namaste"** (palms together) — especially with older locals. A simple handshake works for younger people.
- **Public displays of affection** are okay on beaches but frowned upon in villages and religious sites.
- **Ask before photographing** locals — especially fishermen, spice plantation workers, and market vendors. A smile and gesture goes a long way. Some may expect ₹20–₹50.
- **Eat with your right hand** in traditional settings — the left hand is considered impolite for eating.

## Things to Avoid
- **The "private beach" touts** — there are no private beaches in Goa. Anyone claiming otherwise is trying to sell you a lounger for ₹500.
- **Unregulated water sports** — insist on life jackets and do not pay upfront. Scams are common at busy beaches.
- **The casino boats** — already mentioned, but worth repeating. They're floating warehouses of regret.
- **"Official" tourist guides** at airport arrival halls — they charge 3x and take you to commission-paying shops. Book through a verified operator.
- **Late-night swimming** — drunk beachgoers drowning is tragically common. The undertow is real even for strong swimmers.

## Emergency Contacts
| Service | Number |
|---|:---:|
| Police | 100 |
| Ambulance | 108 / 102 |
| Fire | 101 |
| Tourist Police (Panjim) | +91-832-242-8270 |
| Goa Medical College (Casualty) | +91-832-245-8802 |
| 24/7 Pharmacy (Mapusa) | +91-832-226-2286 |

Keep your hotel's address written in Konkani when taking taxis after dark — most drivers speak Hindi/English, but having it written helps.

## Local Festivals
**Goa Carnival (February)** — A three-day explosion of colour, music, and parades. Panjim turns into Rio-lite with elaborate floats and street parties. Don't miss the Red-and-Black dance at Club Nacional.

**Feast of St. Francis Xavier (December)** — The saint's body is brought out for veneration every 10 years. The next exposition is in 2034. In non-exposition years, the basilica hosts smaller processions. Thousands of pilgrims attend.

**Sao Joao Festival (June)** — A unique Goan festival where young men jump into wells and ponds to celebrate St. John the Baptist. Villages near Mapusa have the most authentic celebrations.

**Ganesh Chaturthi (August–September)** — Elaborate idols are installed in homes and immersed in the sea with song and dance. Panjim's riverside is the best place to watch the immersions.

## Nearby Destinations
**Hampi (6 hr drive)** — A UNESCO wonderland of giant boulders and Vijayanagara ruins. The Virupaksha Temple and the stone chariot are unmissable. Best for a 2-night extension. Trains from Madgaon (overnight sleeper, ₹400).

**Gokarna (2.5 hr drive)** — Essentially what Goa was 30 years ago. Five pristine beaches connected by clifftop trails. Om Beach's cafe serves the best banana pancakes in Karnataka.

**Dudhsagar (1 hr from South Goa)** — Already mentioned above, but worth repeating as a day trip. The waterfall is at its most spectacular post-monsoon (Oct–Dec). Book the jeep safari at the forest checkpoint.

**Mumbai (1 hr flight)** — India's most electric city. Fly out from Goa International Airport for ₹2,500–₹4,000. A weekend in Mumbai is the perfect city buffer after Goa's beaches.`;
}
