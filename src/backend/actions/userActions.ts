"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

async function getUserId() {
  const session = await auth();
  return session?.user?.id || "guest-user-id";
}

async function findDestinationBySlugOrId(slugOrId: string) {
  return db.destination.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
  });
}

export async function toggleBookmark(destinationId: string) {
  try {
    const userId = await getUserId();
    const existing = await db.bookmark.findUnique({
      where: {
        userId_destinationId: {
          userId,
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
        userId,
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
    const userId = await getUserId();
    const bookmarks = await db.bookmark.findMany({
      where: { userId },
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
    const userId = await getUserId();
    const items = await db.savedItinerary.findMany({
      where: { userId },
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
    const userId = await getUserId();
    const item = await db.savedItinerary.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
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
    const userId = await getUserId();
    const trips = await db.trip.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: trips };
  } catch (error) {
    console.error("Fetch trips failed:", error);
    return { success: false, error: "Failed to load trips." };
  }
}

export async function getSharedPassportAction(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdAt: true,
        savedItineraries: {
          orderBy: { createdAt: "desc" }
        },
        bookmarks: {
          include: {
            destination: true
          }
        }
      }
    });

    if (!user) {
      return { success: false, error: "Explorer Passport not found" };
    }

    return { success: true, data: user };
  } catch (err: any) {
    console.error("Failed to fetch shared passport:", err);
    return { success: false, error: "Your journey details could not be loaded right now. Please try again shortly." };
  }
}
