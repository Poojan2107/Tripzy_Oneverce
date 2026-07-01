"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

async function verifyAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied: Admin authorization required.");
  }
}

export async function getDashboardMetrics() {
  try {
    await verifyAdmin();
    // 1. Total counts
    const totalSearches = await db.searchEvent.count();
    const totalViews = await db.viewEvent.count();
    const totalPlannerRuns = await db.plannerEvent.count();
    const totalRecommendations = await db.recommendationEvent.count();
    const totalUsers = await db.user.count();
    const totalDestinations = await db.destination.count();
    const totalExperiences = await db.experience.count();
    const totalSavedItineraries = await db.savedItinerary.count();
    const totalAdmins = await db.user.count({ where: { role: "ADMIN" } });

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

    const destIds = rawViews.map((v) => v.destinationId);
    const dests = destIds.length > 0
      ? await db.destination.findMany({
          where: { id: { in: destIds } },
          select: { id: true, name: true, city: true, country: true },
        })
      : [];
    const destMap = new Map(dests.map((d) => [d.id, d]));
    const destinationPopularity = rawViews.map((v) => {
      const dest = destMap.get(v.destinationId);
      return {
        name: dest ? `${dest.city}, ${dest.country}` : "Unknown Spot",
        count: v._count.id,
      };
    });

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

    // 7. Daily trends (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const rawDailyViews = await db.viewEvent.findMany({
      where: { timestamp: { gte: sevenDaysAgo } },
      select: { timestamp: true },
    });
    const rawDailySearches = await db.searchEvent.findMany({
      where: { timestamp: { gte: sevenDaysAgo } },
      select: { timestamp: true },
    });
    const dayLabels: string[] = [];
    const viewCounts: number[] = [];
    const searchCounts: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toISOString().slice(0, 10);
      dayLabels.push(dayStr);
      viewCounts.push(rawDailyViews.filter(v => v.timestamp.toISOString().slice(0, 10) === dayStr).length);
      searchCounts.push(rawDailySearches.filter(s => s.timestamp.toISOString().slice(0, 10) === dayStr).length);
    }

    return {
      success: true,
      data: {
        totals: {
          searches: totalSearches,
          views: totalViews,
          planners: totalPlannerRuns,
          recommendations: totalRecommendations,
          users: totalUsers,
          destinations: totalDestinations,
          experiences: totalExperiences,
          savedItineraries: totalSavedItineraries,
          admins: totalAdmins,
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
        },
        dailyTrends: {
          labels: dayLabels,
          views: viewCounts,
          searches: searchCounts,
        }
      },
    };
  } catch (error) {
    console.error("Failed to load dashboard metrics:", error);
    return { success: false, error: "Failed to load metrics." };
  }
}
