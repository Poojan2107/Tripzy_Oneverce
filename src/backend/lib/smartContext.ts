import { Intent } from "./intentDetector";

export function pruneItineraryForContext(currentTrip: any, intent: Intent, message: string): any {
  if (!currentTrip) return null;

  const lowMsg = message.toLowerCase();

  const getDayNumber = (text: string): number | null => {
    const match = text.match(/\bday\s+(\d+)\b/i);
    if (match) return parseInt(match[1], 10);

    if (/\bfirst\s+day\b/i.test(text)) return 1;
    if (/\bsecond\s+day\b/i.test(text)) return 2;
    if (/\bthird\s+day\b/i.test(text)) return 3;
    if (/\bfourth\s+day\b/i.test(text)) return 4;
    if (/\bfifth\s+day\b/i.test(text)) return 5;
    if (/\bsixth\s+day\b/i.test(text)) return 6;
    if (/\bseventh\s+day\b/i.test(text)) return 7;
    if (/\beighth\s+day\b/i.test(text)) return 8;
    if (/\bninth\s+day\b/i.test(text)) return 9;
    if (/\btenth\s+day\b/i.test(text)) return 10;

    return null;
  };

  const daySpecificIntents: Intent[] = ["UPDATE_DAY", "ADD_PLACE", "REMOVE_PLACE", "ADD_ACTIVITY", "REMOVE_ACTIVITY"];
  if (daySpecificIntents.includes(intent) || lowMsg.includes("day ")) {
    const targetDay = getDayNumber(lowMsg);
    if (targetDay !== null && currentTrip.days) {
      const dayData = currentTrip.days.find((d: any) => d.day === targetDay);
      if (dayData) {
        return {
          hero: {
            destination: currentTrip.hero?.destination,
            tripDuration: currentTrip.hero?.tripDuration,
          },
          days: [dayData],
        };
      }
    }
  }

  // CHANGE_HOTEL
  if (intent === "CHANGE_HOTEL") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
        estimatedBudget: currentTrip.hero?.estimatedBudget,
      },
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
        hotels: d.hotels || [],
      })),
    };
  }

  // CHANGE_RESTAURANT
  if (intent === "CHANGE_RESTAURANT") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
      },
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
        restaurants: d.restaurants || [],
      })),
    };
  }

  // CHANGE_BUDGET
  if (intent === "CHANGE_BUDGET") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
        estimatedBudget: currentTrip.hero?.estimatedBudget,
      },
      overview: {
        estimatedDailyCost: currentTrip.overview?.estimatedDailyCost,
        totalCost: currentTrip.overview?.totalCost,
        travelStyle: currentTrip.overview?.travelStyle,
      },
      expenseCalculator: currentTrip.expenseCalculator || {},
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
        hotels: d.hotels || [],
        restaurants: d.restaurants || [],
      })),
    };
  }

  // CHANGE_DURATION
  if (intent === "CHANGE_DURATION") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
        tripDuration: currentTrip.hero?.tripDuration,
      },
      overview: {
        totalDistance: currentTrip.overview?.totalDistance,
        totalTravelTime: currentTrip.overview?.totalTravelTime,
      },
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
      })),
    };
  }

  // CHANGE_TRANSPORT
  if (intent === "CHANGE_TRANSPORT") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
        travelMode: currentTrip.hero?.travelMode,
      },
      overview: {
        startLocation: currentTrip.overview?.startLocation,
        destination: currentTrip.overview?.destination,
        totalDistance: currentTrip.overview?.totalDistance,
        totalTravelTime: currentTrip.overview?.totalTravelTime,
        travelStyle: currentTrip.overview?.travelStyle,
      },
      route: currentTrip.route || {},
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
        fuelStops: d.fuelStops || [],
      })),
    };
  }

  // CHANGE_TRAVEL_STYLE
  if (intent === "CHANGE_TRAVEL_STYLE") {
    return {
      hero: {
        destination: currentTrip.hero?.destination,
        tripSummary: currentTrip.hero?.tripSummary,
      },
      overview: {
        travelStyle: currentTrip.overview?.travelStyle,
        tripType: currentTrip.overview?.tripType,
        difficulty: currentTrip.overview?.difficulty,
      },
      days: (currentTrip.days || []).map((d: any) => ({
        day: d.day,
        title: d.title,
        places: (d.places || []).map((p: any) => ({ name: p.name })),
        hotels: d.hotels || [],
        restaurants: d.restaurants || [],
      })),
    };
  }

  // Default compacted outline
  return {
    hero: {
      destination: currentTrip.hero?.destination,
      tripDuration: currentTrip.hero?.tripDuration,
      estimatedBudget: currentTrip.hero?.estimatedBudget,
      tripSummary: currentTrip.hero?.tripSummary,
    },
    overview: {
      destination: currentTrip.overview?.destination,
      weatherSummary: currentTrip.overview?.weatherSummary,
      travelStyle: currentTrip.overview?.travelStyle,
    },
    days: (currentTrip.days || []).map((d: any) => ({
      day: d.day,
      title: d.title,
      morning: d.morning || [],
      afternoon: d.afternoon || [],
      evening: d.evening || [],
      places: (d.places || []).map((p: any) => ({
        name: p.name,
        description: p.description,
      })),
      hotels: (d.hotels || []).map((h: any) => ({ name: h.name, budgetType: h.budgetType })),
    })),
  };
}

export function mergeItineraryPatch(current: any, patch: any): any {
  if (!current) return patch;
  if (!patch) return current;

  const merged = { ...current };

  // 1. Deep merge hero
  if (patch.hero) {
    merged.hero = { ...merged.hero, ...patch.hero };
  }

  // 2. Deep merge overview
  if (patch.overview) {
    merged.overview = { ...merged.overview, ...patch.overview };
  }

  // 3. Deep merge route
  if (patch.route) {
    merged.route = { ...merged.route, ...patch.route };
  }

  // 4. Merge days matching by day number
  if (patch.days && Array.isArray(patch.days)) {
    if (!merged.days) merged.days = [];
    
    const daysMap = new Map<number, any>();
    merged.days.forEach((d: any) => {
      if (d && typeof d.day === 'number') {
        daysMap.set(d.day, d);
      }
    });

    patch.days.forEach((patchDay: any) => {
      if (!patchDay || typeof patchDay.day !== 'number') return;
      const existingDay = daysMap.get(patchDay.day);
      if (existingDay) {
        const mergedDay = { ...existingDay };
        
        if (patchDay.title !== undefined) mergedDay.title = patchDay.title;
        if (patchDay.weather !== undefined) mergedDay.weather = patchDay.weather;

        if (patchDay.morning) mergedDay.morning = patchDay.morning;
        if (patchDay.afternoon) mergedDay.afternoon = patchDay.afternoon;
        if (patchDay.evening) mergedDay.evening = patchDay.evening;
        if (patchDay.fuelStops) mergedDay.fuelStops = patchDay.fuelStops;
        if (patchDay.aiTips) mergedDay.aiTips = patchDay.aiTips;

        if (patchDay.restaurants) mergedDay.restaurants = patchDay.restaurants;
        if (patchDay.hotels) mergedDay.hotels = patchDay.hotels;
        if (patchDay.places) mergedDay.places = patchDay.places;

        daysMap.set(patchDay.day, mergedDay);
      } else {
        daysMap.set(patchDay.day, patchDay);
      }
    });

    merged.days = Array.from(daysMap.values()).sort((a: any, b: any) => a.day - b.day);
  }

  // 5. Deep merge expenseCalculator
  if (patch.expenseCalculator) {
    merged.expenseCalculator = { ...merged.expenseCalculator, ...patch.expenseCalculator };
  }

  // 6. Overwrite array fields
  if (patch.packingChecklist) merged.packingChecklist = patch.packingChecklist;
  if (patch.localFoods) merged.localFoods = patch.localFoods;
  if (patch.shoppingPlaces) merged.shoppingPlaces = patch.shoppingPlaces;

  // 7. Deep merge emergencyContacts
  if (patch.emergencyContacts) {
    merged.emergencyContacts = { ...merged.emergencyContacts, ...patch.emergencyContacts };
  }

  // 8. Overwrite/merge faqs
  if (patch.faqs) {
    merged.faqs = patch.faqs;
  }

  // Handle duration changes: if duration is explicitly reduced, truncate the days array
  if (merged.hero?.tripDuration) {
    const durationMatch = merged.hero.tripDuration.match(/(\d+)\s*Day/i);
    if (durationMatch) {
      const daysCount = parseInt(durationMatch[1], 10);
      if (merged.days.length > daysCount) {
        merged.days = merged.days.slice(0, daysCount);
      }
    }
  }

  return merged;
}
