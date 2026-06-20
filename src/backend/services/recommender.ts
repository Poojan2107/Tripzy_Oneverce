import { db } from "../lib/db";

export interface RecommendationPreferences {
  budget?: string;        // 'Small' | 'Medium' | 'Luxury'
  duration?: number;      // Preferred number of days
  travelStyle?: string;   // 'Adventure' | 'Culture' | 'Luxury' | 'Food' | 'Family'
  interests?: string;     // Trip energy keywords (slow, adventure, photography, food, luxury, cultural)
  preferredRegion?: string;
  experience?: string;
  month?: string;         // Travel month, e.g., 'June'
  companion?: string;     // 'solo' | 'couple' | 'family' | 'friends'
  guests?: number;
}

export interface RecommendationResult {
  destination: any;
  score: number;
  matchedFactors: {
    budget: boolean;
    style: boolean;
    energy: boolean;
    season: boolean;
    companion: boolean;
  };
  reasoning: string;
}

export async function rankDestinations(
  prefs: RecommendationPreferences
): Promise<RecommendationResult[]> {
  try {
    // 1. Fetch all destinations with their experiences
    const destinations = await db.destination.findMany({
      include: {
        experiences: true
      }
    });

    const results: RecommendationResult[] = destinations.map((d: any) => {
      let score = 0;
      const matchedFactors = {
        budget: false,
        style: false,
        energy: false,
        season: false,
        companion: false,
      };
      const matchingReasons: string[] = [];

      // Safe JSON parsing helpers
      const destMonths = Array.isArray(d.bestMonths) ? d.bestMonths : JSON.parse(d.bestMonths as string || "[]");
      const destTags = Array.isArray(d.tags) ? d.tags : JSON.parse(d.tags as string || "[]");
      const destActivities = Array.isArray(d.activities) ? d.activities : JSON.parse(d.activities as string || "[]");

      // --- 1. Travel Style (40% weight) ---
      let styleScore = 0;
      const requestedStyle = (prefs.travelStyle || "Culture").toLowerCase();
      let dbCoefficient = 5;
      if (requestedStyle === "adventure") {
        dbCoefficient = d.adventureScore;
      } else if (requestedStyle === "culture" || requestedStyle === "heritage") {
        dbCoefficient = d.culturalScore;
      } else if (requestedStyle === "luxury") {
        dbCoefficient = d.luxuryScore;
      } else if (requestedStyle === "food" || requestedStyle === "culinary") {
        dbCoefficient = d.foodScore;
      } else if (requestedStyle === "nature") {
        dbCoefficient = d.hiddenGemScore;
      } else if (requestedStyle === "spiritual") {
        dbCoefficient = d.culturalScore;
      }
      styleScore = dbCoefficient * 4;
      score += styleScore;
      if (dbCoefficient >= 8) {
        matchedFactors.style = true;
        matchingReasons.push(`style rating of ${dbCoefficient}/10 for ${prefs.travelStyle}`);
      }

      // --- 2. Budget Match (25% weight) ---
      const price = d.price || 1500;
      let budgetScore = 0;
      if (prefs.budget === "Luxury") {
        if (price >= 2000) { budgetScore = 25; matchedFactors.budget = true; }
        else if (price >= 1200) { budgetScore = 15; }
        else { budgetScore = 5; }
      } else if (prefs.budget === "Medium") {
        if (price >= 1000 && price < 2000) { budgetScore = 25; matchedFactors.budget = true; }
        else if (price < 1000 || price < 2500) { budgetScore = 12; }
        else { budgetScore = 3; }
      } else {
        if (price < 1000) { budgetScore = 25; matchedFactors.budget = true; }
        else if (price < 1500) { budgetScore = 15; }
        else { budgetScore = 2; }
      }
      score += budgetScore;
      if (matchedFactors.budget) {
        matchingReasons.push(`daily cost (₹${(price * 84).toLocaleString('en-IN')}) fits ${prefs.budget} tier`);
      }

      // --- 3. Trip Energy / Interests (15% weight) ---
      let energyScore = 0;
      if (prefs.interests) {
        const words = prefs.interests.toLowerCase().split(/[ ,]+/);
        let matchCount = 0;
        words.forEach((word: string) => {
          if (word.length < 3) return;
          const matches = destTags.some((t: string) => t.toLowerCase().includes(word)) ||
                          destActivities.some((a: string) => a.toLowerCase().includes(word)) ||
                          (d.description || '').toLowerCase().includes(word);
          if (matches) matchCount++;
        });
        energyScore = Math.min(15, matchCount * 3);
        if (energyScore >= 10) matchedFactors.energy = true;
      } else {
        energyScore = 8;
      }
      score += energyScore;
      if (matchedFactors.energy) {
        matchingReasons.push(`trip energy aligns with available activities`);
      }

      // --- 4. Season Suitability (10% weight) ---
      let seasonScore = 0;
      if (prefs.month) {
        const isBestMonth = destMonths.some(
          (m: string) => m.toLowerCase() === prefs.month?.toLowerCase()
        );
        if (isBestMonth) { seasonScore = 10; matchedFactors.season = true; }
        else { seasonScore = 2; }
      } else {
        seasonScore = 6;
      }
      score += seasonScore;
      if (matchedFactors.season && prefs.month) {
        matchingReasons.push(`${prefs.month} is within the prime travel window`);
      }

      // --- 5. Companion Suitability (10% weight) ---
      let companionScore = 0;
      const guestCount = prefs.guests || 1;
      if (prefs.companion === 'solo' || guestCount === 1) {
        if (d.adventureScore >= 6 || d.hiddenGemScore >= 6) {
          companionScore = 10;
          matchedFactors.companion = true;
        } else { companionScore = 5; }
      } else if (prefs.companion === 'couple' || guestCount === 2) {
        if (d.luxuryScore >= 5 || d.culturalScore >= 6) {
          companionScore = 10;
          matchedFactors.companion = true;
        } else { companionScore = 5; }
      } else if (prefs.companion === 'family' || guestCount >= 4) {
        if (d.familyScore >= 6) {
          companionScore = 10;
          matchedFactors.companion = true;
        } else { companionScore = 4; }
      } else {
        if (d.adventureScore >= 5 || d.familyScore >= 5) {
          companionScore = 10;
          matchedFactors.companion = true;
        } else { companionScore = 5; }
      }
      score += companionScore;
      if (matchedFactors.companion) {
        matchingReasons.push(`well-suited for ${prefs.companion || 'group'} travel`);
      }

      const reasoning = matchingReasons.length > 0
        ? `${d.city} is recommended because it ${matchingReasons.join(", and ")}.`
        : `${d.city} aligns with general criteria and offers premium travel potential.`;

      return {
        destination: d,
        score: Math.round(score),
        matchedFactors,
        reasoning
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    return results;
  } catch (err) {
    console.error("Failed to rank destinations in recommendation engine:", err);
    return [];
  }
}
