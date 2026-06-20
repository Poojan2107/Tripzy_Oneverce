"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

async function verifyAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied: Admin authorization required.");
  }
}

export async function getTrendingDestinations() {
  try {
    const destinations = await db.destination.findMany({
      where: { trending: true },
      take: 6,
    });
    return { success: true, data: destinations };
  } catch (error) {
    console.error("Failed to fetch trending destinations:", error);
    return { success: false, error: "Failed to load destinations." };
  }
}

export async function searchDestinations(query: string) {
  try {
    const destinations = await db.destination.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { country: { contains: query } },
          { city: { contains: query } },
        ],
      },
      take: 10,
    });
    return { success: true, data: destinations };
  } catch (error) {
    console.error("Search failed:", error);
    return { success: false, error: "Search failed." };
  }
}

export async function getDestinationDetails(slug: string) {
  try {
    const destination = await db.destination.findUnique({
      where: { slug },
      include: {
        reviews: true,
      },
    });
    return { success: true, data: destination };
  } catch (error) {
    console.error("Failed to load details:", error);
    return { success: false, error: "Failed to load destination." };
  }
}

export async function getAllDestinations() {
  try {
    const destinations = await db.destination.findMany({
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
    const experiences = await db.experience.findMany({
      include: {
        destinations: true
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
    const destination = await db.destination.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        country: data.country,
        city: data.city,
        region: data.region || null,
        description: data.description,
        images: data.images || [],
        metadata: data.metadata || null,
        price: parseFloat(data.price) || 0,
        duration: data.duration || null,
        difficulty: data.difficulty || null,
        groupSize: data.groupSize || null,
        featured: !!data.featured,
        trending: !!data.trending,
        latitude: parseFloat(data.latitude) || null,
        longitude: parseFloat(data.longitude) || null,
        adventureScore: parseInt(data.adventureScore) || 0,
        culturalScore: parseInt(data.culturalScore) || 0,
        luxuryScore: parseInt(data.luxuryScore) || 0,
        familyScore: parseInt(data.familyScore) || 0,
        bestMonths: data.bestMonths || [],
        travelStyles: data.travelStyles || [],
        activities: data.activities || [],
        tags: data.tags || [],
      }
    });
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("Failed to create destination:", error);
    return { success: false, error: error?.message || "Failed to create destination" };
  }
}

export async function updateDestination(id: string, data: any) {
  try {
    await verifyAdmin();
    const destination = await db.destination.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        country: data.country,
        city: data.city,
        region: data.region,
        description: data.description,
        images: data.images,
        metadata: data.metadata,
        price: parseFloat(data.price) || null,
        duration: data.duration,
        difficulty: data.difficulty,
        groupSize: data.groupSize,
        featured: !!data.featured,
        trending: !!data.trending,
        latitude: parseFloat(data.latitude) || null,
        longitude: parseFloat(data.longitude) || null,
        adventureScore: parseInt(data.adventureScore) || 0,
        culturalScore: parseInt(data.culturalScore) || 0,
        luxuryScore: parseInt(data.luxuryScore) || 0,
        familyScore: parseInt(data.familyScore) || 0,
        bestMonths: data.bestMonths,
        travelStyles: data.travelStyles,
        activities: data.activities,
        tags: data.tags,
      }
    });
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("Failed to update destination:", error);
    return { success: false, error: error?.message || "Failed to update destination" };
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
    return { success: false, error: error?.message || "Failed to delete destination" };
  }
}

export async function createExperience(data: any) {
  try {
    await verifyAdmin();
    const experience = await db.experience.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || null,
        featuredImage: data.featuredImage || null,
        icon: data.icon || null,
        travelStyles: data.travelStyles || [],
        estimatedBudget: parseFloat(data.estimatedBudget) || null,
        durationRange: data.durationRange || null,
        difficultyLevel: data.difficultyLevel || null,
        tags: data.tags || [],
        featured: !!data.featured,
      }
    });
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to create experience:", error);
    return { success: false, error: error?.message || "Failed to create experience" };
  }
}

export async function updateExperience(id: string, data: any) {
  try {
    await verifyAdmin();
    const experience = await db.experience.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        featuredImage: data.featuredImage,
        icon: data.icon,
        travelStyles: data.travelStyles,
        estimatedBudget: parseFloat(data.estimatedBudget) || null,
        durationRange: data.durationRange,
        difficultyLevel: data.difficultyLevel,
        tags: data.tags,
        featured: !!data.featured,
      }
    });
    return { success: true, data: experience };
  } catch (error: any) {
    console.error("Failed to update experience:", error);
    return { success: false, error: error?.message || "Failed to update experience" };
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
    return { success: false, error: error?.message || "Failed to delete experience" };
  }
}
