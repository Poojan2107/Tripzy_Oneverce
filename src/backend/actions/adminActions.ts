"use server";

import { db } from "../lib/db";

export async function getAdminUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookmarks: true,
            savedItineraries: true,
            trips: true,
            reviews: true,
            conversations: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        lastActive: null as string | null,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return { success: false, error: "Failed to load users." };
  }
}
