import { describe, it, expect } from "vitest";
import { detectIntent, extractIntent } from "../intentDetector";
import { pruneItineraryForContext, mergeItineraryPatch } from "../smartContext";

describe("Tripzy AI Memory & Context System", () => {
  describe("Intent Detection", () => {
    it("classifies GENERAL_CHAT correctly", () => {
      expect(extractIntent("hello there!", false)).toBe("GENERAL_CHAT");
      expect(extractIntent("thanks for the tips", true)).toBe("GENERAL_CHAT");
    });

    it("classifies NEW_TRIP correctly", () => {
      expect(extractIntent("plan a trip to Udaipur", false)).toBe("NEW_TRIP");
      expect(extractIntent("start over and plan a new trip to Kerala", true)).toBe("NEW_TRIP");
    });

    it("classifies Day Updates", () => {
      expect(extractIntent("change day 2 afternoon plan to visit Taj Mahal", true)).toBe("UPDATE_DAY");
      expect(extractIntent("on day 3, change hotels", true)).toBe("UPDATE_DAY");
    });

    it("classifies Budget changes", () => {
      expect(extractIntent("can we make the trip cheaper?", true)).toBe("CHANGE_BUDGET");
      expect(extractIntent("increase our budget to 50k", true)).toBe("CHANGE_BUDGET");
    });

    it("classifies Hotel changes", () => {
      expect(extractIntent("recommend other luxury hotels", true)).toBe("CHANGE_HOTEL");
    });
  });

  describe("Smart Context Pruning", () => {
    const mockTrip = {
      hero: { destination: "Udaipur", tripDuration: "3 Days / 2 Nights" },
      overview: { travelStyle: "Relaxed", totalCost: "₹15,000" },
      days: [
        { day: 1, title: "Arrival", places: [{ name: "Lake Pichola" }], hotels: [{ name: "Haveli stay" }] },
        { day: 2, title: "Sightseeing", places: [{ name: "City Palace" }], hotels: [{ name: "Haveli stay" }] },
        { day: 3, title: "Departure", places: [{ name: "Monsoon Palace" }], hotels: [] }
      ]
    };

    it("prunes context to only include Day 2 when updating Day 2", () => {
      const pruned = pruneItineraryForContext(mockTrip, "UPDATE_DAY", "Add restaurant to Day 2 afternoon");
      expect(pruned.days).toHaveLength(1);
      expect(pruned.days[0].day).toBe(2);
      expect(pruned.hero.destination).toBe("Udaipur");
      expect(pruned.overview).toBeUndefined();
    });

    it("prunes context for CHANGE_HOTEL by stripping out places and details", () => {
      const pruned = pruneItineraryForContext(mockTrip, "CHANGE_HOTEL", "Suggest other stays");
      expect(pruned.days).toHaveLength(3);
      expect(pruned.days[0].hotels).toBeDefined();
      expect(pruned.days[0].places).toBeUndefined();
    });
  });

  describe("Local Itinerary Patch Merging", () => {
    const originalTrip = {
      hero: { destination: "Goa", tripDuration: "3 Days / 2 Nights", estimatedBudget: "₹15,000" },
      overview: { totalCost: "₹15,000" },
      days: [
        { day: 1, title: "Day 1 Arrival", hotels: [{ name: "Hotel A", budgetType: "Mid" }], places: [{ name: "Baga Beach" }] },
        { day: 2, title: "Day 2 Beaches", hotels: [{ name: "Hotel A", budgetType: "Mid" }], places: [{ name: "Anjuna Beach" }] }
      ],
      expenseCalculator: { hotel: "₹6,000", estimatedTotal: "₹15,000" }
    };

    it("merges hotel updates in patch successfully", () => {
      const patch = {
        days: [
          {
            day: 1,
            hotels: [{ name: "Luxury Villa", budgetType: "Luxury" }]
          }
        ]
      };

      const merged = mergeItineraryPatch(originalTrip, patch);
      expect(merged.days[0].hotels[0].name).toBe("Luxury Villa");
      expect(merged.days[0].places[0].name).toBe("Baga Beach"); // Unchanged should remain
      expect(merged.days[1].hotels[0].name).toBe("Hotel A"); // Other days remain unchanged
    });

    it("updates budget fields correctly", () => {
      const patch = {
        hero: { estimatedBudget: "₹25,000" },
        expenseCalculator: { hotel: "₹12,000", estimatedTotal: "₹25,000" }
      };

      const merged = mergeItineraryPatch(originalTrip, patch);
      expect(merged.hero.estimatedBudget).toBe("₹25,000");
      expect(merged.expenseCalculator.hotel).toBe("₹12,000");
      expect(merged.expenseCalculator.estimatedTotal).toBe("₹25,000");
    });
  });
});
