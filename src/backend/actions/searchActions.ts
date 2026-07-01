"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  duration?: string;
  difficulty?: string;
  season?: string;
  travelStyle?: string;
  category?: string;
}

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  price: number;
  duration: string | null;
  difficulty: string | null;
  bestSeason: string | null;
  tags: string[];
  travelStyles: string[];
  rating: number;
  reviewsCount: number;
  latitude: number | null;
  longitude: number | null;
}

interface SearchSuccess {
  success: true;
  data: SearchResult[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

interface SearchError {
  success: false;
  error: string;
}

type SearchResultResponse = SearchSuccess | SearchError;

export async function searchDestinations(
  query: string,
  filters: SearchFilters = {},
  page = 1,
  pageSize = 12
): Promise<SearchResultResponse> {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    const where: any = isAdmin ? {} : { status: "PUBLISHED" };

    if (query?.trim()) {
      const term = query.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { city: { contains: term, mode: "insensitive" } },
        { country: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { tags: { hasSome: [term] } },
        { activities: { hasSome: [term] } },
        { travelStyles: { hasSome: [term] } },
        { bestSeason: { contains: term, mode: "insensitive" } },
      ];
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.price = {};
      if (filters.priceMin !== undefined) where.price.gte = filters.priceMin;
      if (filters.priceMax !== undefined) where.price.lte = filters.priceMax;
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters.season) {
      where.bestSeason = { contains: filters.season, mode: "insensitive" };
    }

    if (filters.travelStyle) {
      where.travelStyles = { has: filters.travelStyle };
    }

    if (filters.category && filters.category !== "all") {
      where.tags = { has: filters.category };
    }

    const skip = (page - 1) * pageSize;

    const [destinations, total] = await Promise.all([
      db.destination.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ trending: "desc" }, { featured: "desc" }, { price: "asc" }],
        include: {
          reviews: { select: { rating: true } },
          moods: { include: { mood: true } },
        },
      }),
      db.destination.count({ where }),
    ]);

    const results: SearchResult[] = destinations.map((d) => {
      const ratings = d.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

      return {
        id: d.id,
        slug: d.slug,
        name: d.name,
        city: d.city,
        country: d.country,
        description: d.description,
        images: d.images as string[],
        price: d.price,
        duration: d.duration,
        difficulty: d.difficulty,
        bestSeason: d.bestSeason,
        tags: d.tags as string[],
        travelStyles: d.travelStyles as string[],
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: d.reviews.length,
        latitude: d.latitude,
        longitude: d.longitude,
      };
    });

    return {
      success: true,
      data: results,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Search failed:", error);
    return { success: false, error: "Search failed. Please try again." };
  }
}

export async function searchSuggestions(query: string) {
  if (!query?.trim() || query.trim().length < 2) {
    return { success: true, data: [] };
  }

  try {
    const term = query.trim();
    const destinations = await db.destination.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { city: { contains: term, mode: "insensitive" } },
          { country: { contains: term, mode: "insensitive" } },
          { tags: { hasSome: [term] } },
        ],
      },
      take: 5,
      orderBy: [{ trending: "desc" }, { featured: "desc" }],
      select: {
        slug: true,
        name: true,
        city: true,
        country: true,
        images: true,
        price: true,
      },
    });

    return {
      success: true,
      data: destinations.map((d) => ({
        slug: d.slug,
        name: d.name,
        location: `${d.city}, ${d.country}`,
        image: (d.images as string[])?.[0] || null,
        price: d.price,
      })),
    };
  } catch (error) {
    console.error("Suggestions failed:", error);
    return { success: true, data: [] };
  }
}
