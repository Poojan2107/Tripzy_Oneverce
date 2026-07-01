"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";
import { destinationSchema } from "../validation/destination";
import { experienceSchema } from "../validation/experience";

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
      }
    });
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
      }
    });
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
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to update experience status:", error);
    return { success: false, error: "Failed to update experience status" };
  }
}
