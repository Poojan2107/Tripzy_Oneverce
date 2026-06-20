"use server";

import { db } from "../lib/db";

async function findDestinationBySlugOrId(slugOrId: string) {
  return db.destination.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
  });
}

export async function toggleBookmark(destinationId: string) {
  try {
    const guestId = "guest-user-id";
    const existing = await db.bookmark.findUnique({
      where: {
        userId_destinationId: {
          userId: guestId,
          destinationId,
        },
      },
    });

    if (existing) {
      await db.bookmark.delete({
        where: { id: existing.id },
      });
      return { success: true, bookmarked: false };
    }

    await db.bookmark.create({
      data: {
        userId: guestId,
        destinationId,
      },
    });
    return { success: true, bookmarked: true };
  } catch (error) {
    console.error("Toggle bookmark failed:", error);
    return { success: false, error: "Operation failed." };
  }
}

export async function toggleBookmarkBySlug(slugOrId: string) {
  try {
    const destination = await findDestinationBySlugOrId(slugOrId);
    if (!destination) {
      return { success: false, error: "Destination not found" };
    }
    return toggleBookmark(destination.id);
  } catch (error) {
    console.error("Toggle bookmark by slug failed:", error);
    return { success: false, error: "Operation failed." };
  }
}

export async function getUserBookmarks() {
  try {
    const bookmarks = await db.bookmark.findMany({
      where: { userId: "guest-user-id" },
      include: {
        destination: {
          select: { slug: true, id: true },
        },
      },
    });
    const slugs = bookmarks.map((bookmark) => bookmark.destination.slug);
    return { success: true, data: slugs };
  } catch (error) {
    console.error("Fetch bookmarks failed:", error);
    return { success: false, error: "Failed to load bookmarks." };
  }
}

export async function getUserSavedItineraries() {
  try {
    const items = await db.savedItinerary.findMany({
      where: { userId: "guest-user-id" },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: items.map((item) => ({
        id: item.id,
        title: item.title,
        destination: item.destination,
        budget: item.budget,
        duration: item.duration,
        itinerary: item.itinerary,
      })),
    };
  } catch (error) {
    console.error("Fetch saved itineraries failed:", error);
    return { success: false, error: "Failed to load itineraries." };
  }
}

export async function deleteSavedItinerary(id: string) {
  try {
    const item = await db.savedItinerary.findUnique({ where: { id } });
    if (!item || item.userId !== "guest-user-id") {
      return { success: false, error: "Not found" };
    }
    await db.savedItinerary.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete saved itinerary failed:", error);
    return { success: false, error: "Failed to delete itinerary." };
  }
}

export async function getUserTrips() {
  try {
    const trips = await db.trip.findMany({
      where: { userId: "guest-user-id" },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: trips };
  } catch (error) {
    console.error("Fetch trips failed:", error);
    return { success: false, error: "Failed to load trips." };
  }
}
