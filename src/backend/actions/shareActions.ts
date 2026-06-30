"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

export async function saveItineraryAction(data: {
  title: string;
  destination: string;
  budget: number;
  duration: number;
  itinerary: any;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user-id";

    // Ensure guest user exists in the database
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: session?.user?.name || "Guest Traveler",
        email: session?.user?.email || "guest@tripzy.ai",
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
    return {
      success: false,
      error: "Your journey could not be saved right now. Your explorer journal remains safe locally. Please try again shortly."
    };
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
    return { success: false, error: "Failed to fetch shared itinerary" };
  }
}
