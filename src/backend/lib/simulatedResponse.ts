import { detectIntent } from "./intentDetector";

function cleanPlaceName(name: string): string {
  // Remove common travel keywords
  let cleaned = name.replace(/\b(trip|plan|road|day|days|to|in|for|from|with|my|our|a|an|the)\b/gi, "").trim();
  if (!cleaned) return "";
  // Capitalize first letters of each word
  return cleaned
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function detectPlace(text: string, fallback = "Goa"): string {
  const low = text.toLowerCase();
  
  if (low.includes("goa")) return "Goa";
  if (low.includes("varanasi") || low.includes("banaras") || low.includes("kashi")) return "Varanasi";
  if (low.includes("kerala")) return "Kerala";
  if (low.includes("udaipur")) return "Udaipur";
  if (low.includes("rajasthan")) return "Rajasthan";
  if (low.includes("himachal") || low.includes("manali") || low.includes("shimla")) return "Himachal";
  if (low.includes("ladakh") || low.includes("leh")) return "Ladakh";
  if (low.includes("delhi")) return "Delhi";
  if (low.includes("mumbai") || low.includes("bombay")) return "Mumbai";
  if (low.includes("jaipur")) return "Jaipur";

  // Fall back to natural language regex patterns to extract custom places
  const patterns = [
    /trip to\s+([a-z\s]+)/i,
    /go to\s+([a-z\s]+)/i,
    /travel to\s+([a-z\s]+)/i,
    /explore\s+([a-z\s]+)/i,
    /\d+\s*days?\s+(?:road\s+)?(?:trip\s+)?(?:to\s+)?([a-z\s]+)\s+trip/i,
    /\d+\s*days?\s+(?:road\s+)?(?:trip\s+)?(?:to\s+)?([a-z\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = cleanPlaceName(match[1]);
      if (cleaned) return cleaned;
    }
  }

  return fallback;
}

function generateDynamicSimulatedJson(
  place: string, 
  duration: number, 
  budgetTier: string | null, 
  travelerType: string | null,
  isFollowUp = false,
  requestText = ""
): string {
  const tier = budgetTier || "mid";
  const traveler = travelerType || "couple";
  
  // Dynamic cost estimates per day based on tier & destination
  const isIntl = ["europe", "paris", "london", "dubai", "bali", "thailand", "singapore", "switzerland"].some(p => place.toLowerCase().includes(p));
  
  let hotelRate = 4000;
  let foodRate = 1500;
  let transitBase = 3000;
  let activityRate = 1000;
  let shoppingBase = 2000;
  
  if (tier === "budget") {
    hotelRate = isIntl ? 4000 : 1200;
    foodRate = isIntl ? 2000 : 600;
    transitBase = isIntl ? 15000 : 1000;
    activityRate = isIntl ? 2000 : 500;
    shoppingBase = isIntl ? 5000 : 1000;
  } else if (tier === "premium") {
    hotelRate = isIntl ? 15000 : 8000;
    foodRate = isIntl ? 5000 : 2500;
    transitBase = isIntl ? 45000 : 5000;
    activityRate = isIntl ? 6000 : 2000;
    shoppingBase = isIntl ? 15000 : 5000;
  } else if (tier === "luxury") {
    hotelRate = isIntl ? 30000 : 20000;
    foodRate = isIntl ? 8000 : 5000;
    transitBase = isIntl ? 80000 : 12000;
    activityRate = isIntl ? 12000 : 5000;
    shoppingBase = isIntl ? 30000 : 10000;
  } else {
    // mid
    hotelRate = isIntl ? 8000 : 4000;
    foodRate = isIntl ? 3500 : 1200;
    transitBase = isIntl ? 30000 : 2500;
    activityRate = isIntl ? 4000 : 1000;
    shoppingBase = isIntl ? 8000 : 2500;
  }
  
  const nights = Math.max(1, duration - 1);
  const totalHotel = hotelRate * nights;
  const totalFood = foodRate * duration;
  const totalActivities = activityRate * duration;
  const totalShopping = shoppingBase;
  const totalMisc = Math.round((totalHotel + totalFood) * 0.1);
  const totalTransit = transitBase;
  
  const grandTotal = totalTransit + totalHotel + totalFood + totalActivities + totalShopping + totalMisc;
  const grandTotalMin = Math.round(grandTotal * 0.85);
  const grandTotalMax = Math.round(grandTotal * 1.2);
  
  const formatCost = (val: number) => `₹${val.toLocaleString("en-IN")}`;
  const estimatedBudget = `${formatCost(grandTotalMin)}–${formatCost(grandTotalMax)} per person`;
  
  const activitiesByPlace: Record<string, { places: string[], food: string[], hotel: string }[]> = {
    "Goa": [
      { places: ["Vagator Beach", "Fort Aguada"], food: ["Mum's Kitchen (Goan Fish Curry)"], hotel: "W Goa" },
      { places: ["Palolem Beach", "Cabo de Rama Fort"], food: ["Dropadi Beach Shack (Lobster)"], hotel: "Tiya Cottages" },
      { places: ["Basilica of Bom Jesus", "Fontainhas Latin Quarter"], food: ["Viva Panjim (Pork Vindaloo)"], hotel: "Casa Candolim" },
      { places: ["Anjuna Beach", "Chapora Fort"], food: ["Gunpowder (Appam & Curry)"], hotel: "The Hosteller Vagator" },
      { places: ["Dudhsagar Waterfalls", "Spice Plantation Ponda"], food: ["Spice Farm Traditional Buffet"], hotel: "Alila Diwa Goa" }
    ],
    "Kerala": [
      { places: ["Fort Kochi Chinese Fishing Nets", "St. Francis Church"], food: ["Kashi Art Cafe (Organic Salad)"], hotel: "Brunton Boatyard" },
      { places: ["Munnar Tea Gardens", "Mattupetty Dam"], food: ["Saravana Bhavan (Dosa)"], hotel: "Windermere Estate" },
      { places: ["Eravikulam National Park", "Anamudi Peak View"], food: ["Hillview Restaurant (Kerala Meals)"], hotel: "Munnar Valley Resort" },
      { places: ["Alleppey Backwaters Houseboat Cruise", "Vembanad Lake"], food: ["Houseboat Chef (Karimeen Fish)"], hotel: "Spice Coast Cruises" },
      { places: ["Maranari Beach", "Kovalam Lighthouse Beach"], food: ["Curry Leaf (Seafood Thali)"], hotel: "The Leela Kovalam" }
    ],
    "Udaipur": [
      { places: ["City Palace Udaipur", "Lake Pichola Boat Ride"], food: ["Ambrai Restaurant (Lal Maas)"], hotel: "Taj Lake Palace" },
      { places: ["Jag Mandir", "Sajjangarh Monsoon Palace"], food: ["Upre Rooftop (Rajput Thali)"], hotel: "Amet Haveli" },
      { places: ["Saheliyon-ki-Bari", "Bagore ki Haveli Folk Dance"], food: ["Jheel's Ginger Coffee Bar"], hotel: "Jagmandir Island Palace" },
      { places: ["Fateh Sagar Lake", "Shilpgram Artisan Village"], food: ["Natraj Dining Hall (Gujarati Thali)"], hotel: "Radisson Blu Udaipur" },
      { places: ["Eklingji Temple", "Haldighati Pass"], food: ["Local Mewari Dhaba"], hotel: "The Oberoi Udaivilas" }
    ]
  };

  const defaultAttractions = [
    { name: "Historical Monument", desc: "A spectacular UNESCO world heritage site boasting beautiful local craftsmanship." },
    { name: "Traditional Market", desc: "A vibrant, colorful bazaar filled with authentic local clothes and hand-painted souvenirs." },
    { name: "Scenic Viewpoint", desc: "A quiet clifftop or hilltop offering breathtaking panoramic sunset views away from the main crowd." },
    { name: "Botanical Nature Park", desc: "A peaceful sanctuary of native flora and fauna with beautiful tree-lined trails." },
    { name: "Local Cultural Center", desc: "Watch traditional musicians, folk dancers, and artists bring the region's heritage to life." },
    { name: "Peaceful Lake Side", desc: "A tranquil lake shore perfect for a morning walk and a scenic boat ride." },
    { name: "Ancient Temple Ruins", desc: "Crumbling stone architectures telling stories of past royal empires." },
    { name: "Hidden Waterfall Trail", desc: "A scenic hike through dense forest leading to a pristine cascade." }
  ];

  let lat = 20.0000;
  let lng = 75.0000;
  if (place === "Goa") { lat = 15.4989; lng = 73.8278; }
  else if (place === "Kerala") { lat = 9.9312; lng = 76.2673; }
  else if (place === "Udaipur") { lat = 24.5854; lng = 73.7125; }
  else if (place === "Varanasi") { lat = 25.3176; lng = 82.9739; }
  else if (place === "Ladakh") { lat = 34.1526; lng = 77.5771; }
  else if (place === "Delhi") { lat = 28.6139; lng = 77.2090; }
  else if (place === "Mumbai") { lat = 18.9220; lng = 72.8347; }
  else if (place === "Jaipur") { lat = 26.9124; lng = 75.7873; }

  const days: any[] = [];
  const placeData = activitiesByPlace[place] || [];

  for (let d = 1; d <= duration; d++) {
    const dayIndex = (d - 1) % 5;
    const dataSlice = placeData[dayIndex] || {
      places: [`${place} Historic Monument ${d}`, `${place} Local Bazaar ${d}`],
      food: [`${place} Heritage Diner ${d} (Local Curry)`],
      hotel: `${place} Boutique Residency ${d}`
    };

    const dLat = (lat + (Math.sin(d) * 0.01)).toFixed(4);
    const dLng = (lng + (Math.cos(d) * 0.01)).toFixed(4);

    const placesArray = dataSlice.places.map((pName, idx) => {
      const defAtt = defaultAttractions[(d * 2 + idx) % defaultAttractions.length];
      return {
        name: pName,
        description: `${pName} is ${defAtt.desc}`,
        visitDuration: "~2 hours",
        entryFee: idx === 0 ? "₹100" : "Free",
        openingHours: "9:00 AM – 6:00 PM",
        rating: (4.2 + (d % 8) * 0.1).toFixed(1),
        coordinates: {
          lat: (parseFloat(dLat) + idx * 0.005).toFixed(4),
          lng: (parseFloat(dLng) - idx * 0.005).toFixed(4)
        },
        imageQueries: [`${pName.toLowerCase()} travel`, `${place.toLowerCase()} tourism`],
        googleMapsSearch: `${pName}, ${place}, India`
      };
    });

    const morningAct = [`Arrive at ${dataSlice.places[0]} for sightseeing`, `Take scenic photos and explore with a local guide`];
    const afternoonAct = [`Lunch at ${dataSlice.food[0].split(" (")[0]}`, `Visit the famous ${dataSlice.places[1] || 'Scenic Lookout'}`];
    const eveningAct = [`Enjoy sunset stroll near the main area`, `Dinner featuring authentic local street food and drinks`];

    days.push({
      day: d,
      title: d === 1 ? `Arrival & Welcome to ${place}` : d === duration ? `Farewell Souvenir Shopping & Departure` : `Exploring the Best of ${place}`,
      morning: morningAct,
      afternoon: afternoonAct,
      evening: d === duration ? [] : eveningAct,
      places: placesArray,
      restaurants: [
        {
          name: dataSlice.food[0].split(" (")[0],
          reason: `Highly recommended for its signature ${dataSlice.food[0].includes("(") ? dataSlice.food[0].split("(")[1].replace(")", "") : "specialty"} and traditional family recipes.`
        }
      ],
      hotels: d === duration ? [] : [
        {
          name: dataSlice.hotel,
          budgetType: tier.charAt(0).toUpperCase() + tier.slice(1),
          reason: `A highly rated stay offering comfortable amenities and convenient access, averaging ${formatCost(hotelRate)}/night.`
        }
      ],
      weather: `Sunny and pleasant, 24°C`,
      aiTips: [
        `Hire a certified local guide at major sights to get the best historical stories.`,
        `Wear comfortable walking shoes since there's plenty of ground to cover.`
      ]
    });
  }

  const cleanReq = requestText.trim();
  const isCustomRequest = cleanReq.length > 0 && !/^(hi|hello|hey|thanks|thank you|ok|okay)\b/i.test(cleanReq);
  
  if (isCustomRequest && days.length > 0) {
    days[0].description += ` [Special request focus: "${cleanReq}"]`;
    days[0].morning.push(`Explore custom preference for: "${cleanReq.slice(0, 60)}${cleanReq.length > 60 ? '...' : ''}"`);
  }

  let tripSummary = `A beautifully customized ${duration}-day journey through ${place} designed for a ${tier} traveler style. Explore stunning spots, savor delicious regional cuisines, and enjoy local secrets.`;
  if (isCustomRequest) {
    tripSummary += ` Custom focus: "${cleanReq.slice(0, 100)}${cleanReq.length > 100 ? '...' : ''}" incorporated.`;
  }

  const jsonPlan = {
    hero: {
      destination: `${place}, India`,
      coverImageQuery: `${place.toLowerCase()} scenic travel tourism`,
      tripDuration: `${duration} Days / ${nights} Nights`,
      travelMode: isIntl ? "Flight + Chauffeur Cab" : "Train + Local Scooter / Cab",
      bestTimeToVisit: "October–March",
      estimatedBudget,
      tripSummary
    },
    overview: {
      startLocation: isIntl ? "New Delhi (DEL)" : "Nearest major city",
      destination: place,
      totalDistance: isIntl ? "3,500 km" : "250 km",
      totalTravelTime: isIntl ? "6h 40m flight" : "4h 30m drive",
      currency: "INR (₹)",
      languages: ["Local Language", "Hindi", "English"],
      weatherSummary: `Clear skies, pleasant conditions. Temp: 18°C–28°C. Perfect for outdoor sightseeing.`,
      bestSeason: "October to March (winter and spring months offer ideal conditions)",
      tripType: traveler === "solo" ? "Solo Backpacking" : traveler === "couple" ? "Honeymoon / Couple Getaway" : "Family Vacation",
      difficulty: "Easy",
      estimatedDailyCost: formatCost(grandTotal / duration),
      totalCost: formatCost(grandTotal),
      travelStyle: tier === "luxury" ? "Premium Indulgent" : tier === "budget" ? "Lean & Cost-conscious" : "Balanced Comfort"
    },
    route: {
      mapSummary: `Scenic route around ${place} starting from transit entry hubs to top viewpoints and back.`,
      majorStops: [place, `${place} Center`, `${place} Heights`]
    },
    days,
    expenseCalculator: {
      fuel: formatCost(totalTransit),
      hotel: formatCost(totalHotel),
      food: formatCost(totalFood),
      activities: formatCost(totalActivities),
      shopping: formatCost(totalShopping),
      miscellaneous: formatCost(totalMisc),
      estimatedTotal: formatCost(grandTotal)
    },
    packingChecklist: [
      `Comfortable walking shoes — essential for daily heritage walks`,
      `Sunscreen and sunglasses — for outdoor beach/mountain sightseeing`,
      `Light jacket or cardigan — for cooler evening breezes`,
      `Reusable water bottle — keep hydrated and cut plastic waste`,
      `Digital power bank — ensure your phone stays charged for navigation`
    ],
    localFoods: [
      `Signature ${place} Traditional Thali`,
      `Spicy Regional Curry Rice`,
      `Famous Cardamom Dessert`,
      `Hot Clay-pot Masala Chai`
    ],
    shoppingPlaces: [
      `${place} Heritage Craft Bazaar`,
      `${place} Government Handloom Emporium`
    ],
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1800-11-1363"
    },
    faqs: [
      {
        question: `What is the best way to get around ${place}?`,
        answer: `Renting a local vehicle (scooter/bike) or hiring a cab for the day is the most flexible option. digital booking apps are available in core hubs.`
      },
      {
        question: `Is it safe for solo or family travel?`,
        answer: `Absolutely. ${place} is a major tourist destination with helpful locals and designated tourist police assistance.`
      }
    ]
  };

  return JSON.stringify(jsonPlan);
}

export function getSimulatedResponse(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMsg = userMessages[userMessages.length - 1]?.content || "Goa";
  
  const context = detectIntent(messages);
  const place = context.destination;
  const isFollowUp = context.isFollowUp;

  const lowLast = lastMsg.toLowerCase().trim();
  const isConversational = 
    /^(hi|hello|hey|thanks|thank you|ty|okay|ok|good morning|good evening|how's it going|how are you)\b/i.test(lowLast) ||
    (/^(what is|how many|tell me about|who is|where is the currency|what's the currency)\b/i.test(lowLast) && 
     !lowLast.includes("trip") && 
     !lowLast.includes("plan") && 
     !lowLast.includes("itinerary") &&
     !lowLast.includes(place.toLowerCase()));

  if (isConversational) {
    if (/thanks|thank you|ty/i.test(lowLast)) {
      return `You're very welcome! I hope this helps you plan a wonderful trip to ${place}. Let me know if there's anything else you need!`;
    }
    if (/hi|hello|hey/i.test(lowLast)) {
      return `Hello there! I'm Travebie AI, your premium travel companion. I'd love to help you plan a trip or answer any questions about Indian destinations. Where are you thinking of going?`;
    }
    return `That's a great question! For ${place}, usually the currency is INR, local languages include Hindi/English, and standard tourist safety practices apply. Let me know if you'd like a full dynamic day-by-day plan!`;
  }

  // Generate dynamic simulated JSON
  const duration = context.duration || 5;
  return generateDynamicSimulatedJson(place, duration, context.budgetTier, context.travelerType, isFollowUp, lastMsg);
}
