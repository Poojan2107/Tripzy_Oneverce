"use server";

import { db } from "../lib/db";
import { auth } from "../auth";

export async function saveItineraryAction(data: {
  title: string;
  destination: string;
  budget: number;
  duration: number;
  itinerary: any;
}) {
  try {
    let userId = "guest-user-id";

    // Try to get authenticated user session
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
    }

    // Ensure user exists in the database to satisfy the foreign key constraint
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: userId === "guest-user-id" ? "Guest Traveler" : (session?.user?.name || "Traveler"),
        email: userId === "guest-user-id" ? "guest@tripzy.ai" : (session?.user?.email || `${userId}@tripzy.ai`),
      }
    });

    const result = await db.savedItinerary.create({
      data: {
        userId,
        title: data.title,
        destination: data.destination,
        budget: data.budget,
        duration: data.duration,
        itinerary: data.itinerary,
      }
    });

    return { success: true, id: result.id };
  } catch (err: any) {
    console.error("Failed to save itinerary in server action:", err);
    return { success: false, error: err?.message || "Failed to save itinerary" };
  }
}

export async function getSharedItineraryAction(id: string) {
  try {
    const itinerary = await db.savedItinerary.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!itinerary) {
      return { success: false, error: "Itinerary not found" };
    }

    return { success: true, data: itinerary };
  } catch (err: any) {
    console.error("Failed to fetch shared itinerary in server action:", err);
    return { success: false, error: err?.message || "Failed to fetch shared itinerary" };
  }
}
