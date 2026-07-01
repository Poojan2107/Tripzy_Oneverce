"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";
import { destinationSchema } from "../validation/destination";
import { experienceSchema } from "../validation/experience";
import type { Tour } from "../../frontend/types";
import { logAudit } from "./adminActions";

async function verifyAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied: Admin authorization required.");
  }
}

export async function getAllDestinations() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const destinations = await db.destination.findMany({
      where: isAdmin ? undefined : { status: "PUBLISHED" },
      include: {
        categories: true,
        experiences: true,
        reviews: true,
      },
    });
    return { success: true, data: destinations };
  } catch (error) {
    console.error("Failed to fetch all destinations:", error);
    return { success: false, error: "Failed to load destinations." };
  }
}

export async function getAllExperiences() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const experiences = await db.experience.findMany({
      where: isAdmin ? undefined : { status: "PUBLISHED" },
      include: {
        destination: true
      }
    });
    return { success: true, data: experiences };
  } catch (error) {
    console.error("Failed to fetch all experiences:", error);
    return { success: false, error: "Failed to load experiences." };
  }
}

export async function createDestination(data: any) {
  try {
    await verifyAdmin();
    const parsed = destinationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
    }
    const v = parsed.data;
    const destination = await db.destination.create({
      data: {
        name: v.name,
        slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        country: v.country,
        city: v.city,
        region: v.region || null,
        description: v.description,
        images: (v.images as any) || [],
        metadata: v.metadata || null,
        price: v.price || 0,
        duration: v.duration || null,
        difficulty: v.difficulty || null,
        groupSize: v.groupSize || null,
        featured: !!v.featured,
        trending: !!v.trending,
        latitude: v.latitude || null,
        longitude: v.longitude || null,
        adventureScore: v.adventureScore || 0,
        culturalScore: v.culturalScore || 0,
        luxuryScore: v.luxuryScore || 0,
        familyScore: v.familyScore || 0,
        foodScore: v.foodScore || 0,
        hiddenGemScore: v.hiddenGemScore || 0,
        bestMonths: (v.bestMonths as any) || [],
        travelStyles: (v.travelStyles as any) || [],
        activities: (v.activities as any) || [],
        tags: (v.tags as any) || [],
        status: v.status || "DRAFT",
        metaTitle: v.metaTitle || null,
        metaDescription: v.metaDescription || null,
        ogImage: v.ogImage || null,
      }
    });
    logAudit("CREATE_DESTINATION", "Destination", destination.id, { name: destination.name });
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("Failed to create destination:", error);
    return { success: false, error: "Failed to create destination" };
  }
}

export async function updateDestination(id: string, data: any) {
  try {
    await verifyAdmin();
    const parsed = destinationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
    }
    const v = parsed.data;
    const destination = await db.destination.update({
      where: { id },
      data: {
        name: v.name,
        slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        country: v.country,
        city: v.city,
        region: v.region || null,
        description: v.description,
        images: (v.images as any) || [],
        metadata: v.metadata || null,
        price: v.price || 0,
        duration: v.duration || null,
        difficulty: v.difficulty || null,
        groupSize: v.groupSize || null,
        featured: !!v.featured,
        trending: !!v.trending,
        latitude: v.latitude || null,
        longitude: v.longitude || null,
        adventureScore: v.adventureScore || 0,
        culturalScore: v.culturalScore || 0,
        luxuryScore: v.luxuryScore || 0,
        familyScore: v.familyScore || 0,
        foodScore: v.foodScore || 0,
        hiddenGemScore: v.hiddenGemScore || 0,
        bestMonths: (v.bestMonths as any) || [],
        travelStyles: (v.travelStyles as any) || [],
        activities: (v.activities as any) || [],
        tags: (v.tags as any) || [],
        status: v.status || "DRAFT",
        metaTitle: v.metaTitle || null,
        metaDescription: v.metaDescription || null,
        ogImage: v.ogImage || null,
      }
    });
    logAudit("UPDATE_DESTINATION", "Destination", destination.id, { name: destination.name });
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("Failed to update destination:", error);
    return { success: false, error: "Failed to update destination" };
  }
}

export async function deleteDestination(id: string) {
  try {
    await verifyAdmin();
    await db.destination.delete({
      where: { id }
    });
    logAudit("DELETE_DESTINATION", "Destination", id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete destination:", error);
    return { success: false, error: "Failed to delete destination" };
  }
}

export async function createExperience(data: any) {
  try {
    await verifyAdmin();
    const parsed = experienceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
    }
    const v = parsed.data;
    const experience = await db.experience.create({
      data: {
        name: v.name,
        slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: v.description || null,
        featuredImage: v.featuredImage || null,
        icon: v.icon || null,
        travelStyles: (v.travelStyles as any) || [],
        estimatedBudget: v.estimatedBudget || null,
        durationRange: v.durationRange || null,
        difficultyLevel: v.difficultyLevel || null,
        tags: (v.tags as any) || [],
        featured: !!v.featured,
        status: v.status || "DRAFT",
      }
    });
    logAudit("CREATE_EXPERIENCE", "Experience", experience.id, { name: experience.name });
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to create experience:", error);
    return { success: false, error: "Failed to create experience" };
  }
}

export async function updateExperience(id: string, data: any) {
  try {
    await verifyAdmin();
    const parsed = experienceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
    }
    const v = parsed.data;
    const experience = await db.experience.update({
      where: { id },
      data: {
        name: v.name,
        slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: v.description || null,
        featuredImage: v.featuredImage || null,
        icon: v.icon || null,
        travelStyles: (v.travelStyles as any) || [],
        estimatedBudget: v.estimatedBudget || null,
        durationRange: v.durationRange || null,
        difficultyLevel: v.difficultyLevel || null,
        tags: (v.tags as any) || [],
        featured: !!v.featured,
        status: v.status || "DRAFT",
      }
    });
    logAudit("UPDATE_EXPERIENCE", "Experience", experience.id, { name: experience.name });
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to update experience:", error);
    return { success: false, error: "Failed to update experience" };
  }
}

export async function deleteExperience(id: string) {
  try {
    await verifyAdmin();
    await db.experience.delete({
      where: { id }
    });
    logAudit("DELETE_EXPERIENCE", "Experience", id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete experience:", error);
    return { success: false, error: "Failed to delete experience" };
  }
}

export async function updateDestinationStatus(id: string, status: "DRAFT" | "REVIEW" | "PUBLISHED") {
  try {
    await verifyAdmin();
    const destination = await db.destination.update({
      where: { id },
      data: { status },
    });
    logAudit("UPDATE_DESTINATION_STATUS", "Destination", id, { status });
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("Failed to update destination status:", error);
    return { success: false, error: "Failed to update destination status" };
  }
}

export async function updateExperienceStatus(id: string, status: "DRAFT" | "REVIEW" | "PUBLISHED") {
  try {
    await verifyAdmin();
    const experience = await db.experience.update({
      where: { id },
      data: { status },
    });
    logAudit("UPDATE_EXPERIENCE_STATUS", "Experience", id, { status });
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to update experience status:", error);
    return { success: false, error: "Failed to update experience status" };
  }
}

export async function getDestinationBySlug(slug: string) {
  try {
    const dest = await db.destination.findFirst({
      where: { slug },
      include: { reviews: true, experiences: true },
    });
    if (!dest) {
      const { TOURS_DATA } = await import("../../frontend/data");
      const fallback = TOURS_DATA.find((t) => t.id === slug);
      return fallback ? { success: true, data: fallback } : { success: false, error: "Not found" };
    }
    const { TOURS_DATA } = await import("../../frontend/data");
    const tour: any = {
      id: dest.slug || dest.id,
      dbId: dest.id,
      title: dest.name,
      subtitle: (dest.metadata as any)?.subtitle || dest.description.slice(0, 85) + "...",
      description: dest.description,
      category: dest.trending ? "trending" : dest.featured ? "popular" : "international",
      duration: dest.duration || "5 Days",
      rating: dest.price ? 4.8 + (dest.price % 3) * 0.05 : 4.9,
      reviewsCount: dest.reviews?.length || 0,
      price: dest.price || 1500,
      location: `${dest.city}, ${dest.country}`,
      groupSize: dest.groupSize || "Max 6 travelers",
      difficulty: dest.difficulty || "Easy",
      bannerImage: (dest.images as string[])?.[0] || "/images/tours/varanasi-banner.jpg",
      images: (dest.images as string[]) || [],
      itinerary: (dest.metadata as any)?.itinerary || [],
      includedServices: (dest.metadata as any)?.includedServices || [],
      reviews: dest.reviews || [],
      tags: dest.tags || [],
      moods: (dest as any).moods || [],
      activities: dest.activities || [],
      bestSeason: dest.bestSeason || undefined,
      latitude: dest.latitude,
      longitude: dest.longitude,
      chapterName: (dest.metadata as any)?.chapterName,
      chapterTitle: (dest.metadata as any)?.chapterTitle,
      storyHeadline: (dest.metadata as any)?.storyHeadline,
      storyNarrative: (dest.metadata as any)?.storyNarrative,
      localSecret: (dest.metadata as any)?.localSecret,
      photographySpot: (dest.metadata as any)?.photographySpot,
      signatureExperience: (dest.metadata as any)?.signatureExperience,
      budgetRange: (dest.metadata as any)?.budgetRange,
      accents: (dest.metadata as any)?.accents || TOURS_DATA.find((t) => t.id === (dest.slug || dest.id))?.accents,
      metaTitle: (dest as any).metaTitle || undefined,
      metaDescription: (dest as any).metaDescription || undefined,
      ogImage: (dest as any).ogImage || undefined,
      status: dest.status || "PUBLISHED",
    };
    return { success: true, data: tour as unknown as Tour };
  } catch (error) {
    console.error("Failed to get destination by slug:", error);
    return { success: false, error: "Failed to load destination." };
  }
}
