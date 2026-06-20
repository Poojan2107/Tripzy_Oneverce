"use server";

import { db } from "../lib/db";

export async function getDashboardMetrics() {
  try {
    // 1. Total counts
    const totalSearches = await db.searchEvent.count();
    const totalViews = await db.viewEvent.count();
    const totalPlannerRuns = await db.plannerEvent.count();
    const totalRecommendations = await db.recommendationEvent.count();

    // 2. Search trends
    const rawSearchTrends = await db.searchEvent.groupBy({
      by: ["query"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });
    const searchTrends = rawSearchTrends.map((s) => ({
      query: s.query,
      count: s._count.id,
    }));

    // 3. Destination popularity (Views)
    const rawViews = await db.viewEvent.groupBy({
      by: ["destinationId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const destinationPopularity = await Promise.all(
      rawViews.map(async (v) => {
        const dest = await db.destination.findUnique({
          where: { id: v.destinationId },
          select: { name: true, city: true, country: true },
        });
        return {
          name: dest ? `${dest.city}, ${dest.country}` : "Unknown Spot",
          count: v._count.id,
        };
      })
    );

    // 4. Planner Insights (Budgets, Durations, Styles)
    const totalItineraries = await db.plannerEvent.count();
    
    // Budget distribution
    const rawBudgets = await db.plannerEvent.groupBy({
      by: ["budget"],
      _count: { id: true },
    });
    const budgets = rawBudgets.map((b) => ({
      tier: b.budget,
      count: b._count.id,
    }));

    // Average duration
    const durationAvgResult = await db.plannerEvent.aggregate({
      _avg: { duration: true },
    });
    const averageDuration = durationAvgResult._avg.duration || 0;

    // Popular travel styles
    const rawStyles = await db.plannerEvent.groupBy({
      by: ["travelStyle"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 4,
    });
    const travelStyles = rawStyles.map((ts) => ({
      style: ts.travelStyle,
      count: ts._count.id,
    }));

    // 5. Popular recommended destinations
    const rawRecommendations = await db.recommendationEvent.groupBy({
      by: ["destination"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });
    const recommendationPopularity = rawRecommendations.map((r) => ({
      name: r.destination,
      count: r._count.id,
    }));

    // 6. Recommendation Interactions (Feedback Loop)
    const helpfulCount = await db.recommendationInteraction.count({ where: { action: "LIKE" } });
    const notRelevantCount = await db.recommendationInteraction.count({ where: { action: "DISLIKE" } });
    const savedCount = await db.recommendationInteraction.count({ where: { action: "SAVE" } });
    const planGeneratedCount = await db.recommendationInteraction.count({ where: { action: "PLAN" } });
    const ctr = totalRecommendations > 0 
      ? Math.round(((helpfulCount + savedCount + planGeneratedCount) / totalRecommendations) * 100)
      : 0;

    return {
      success: true,
      data: {
        totals: {
          searches: totalSearches,
          views: totalViews,
          planners: totalPlannerRuns,
          recommendations: totalRecommendations,
        },
        searchTrends,
        destinationPopularity,
        recommendationPopularity,
        planning: {
          totalItineraries,
          budgets,
          averageDuration: Math.round(averageDuration * 10) / 10,
          travelStyles,
        },
        feedback: {
          helpful: helpfulCount,
          notRelevant: notRelevantCount,
          saved: savedCount,
          plans: planGeneratedCount,
          ctr: ctr
        }
      },
    };
  } catch (error) {
    console.error("Failed to load dashboard metrics:", error);
    return { success: false, error: "Failed to load metrics." };
  }
}
