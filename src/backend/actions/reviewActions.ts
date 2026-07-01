"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";
import { createReviewSchema } from "../validation/review";

export async function createReview(data: { destinationId: string; rating: number; comment?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to leave a review." };
    }

    const parsed = createReviewSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid review data." };
    }

    const existing = await db.review.findFirst({
      where: { userId: session.user.id, destinationId: data.destinationId },
    });
    if (existing) {
      return { success: false, error: "You have already reviewed this destination." };
    }

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        destinationId: data.destinationId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      },
    });

    return { success: true, data: review };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "Failed to submit review." };
  }
}

export async function getDestinationReviews(destinationId: string, page = 1, pageSize = 10) {
  try {
    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where: { destinationId, status: "APPROVED" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      db.review.count({ where: { destinationId, status: "APPROVED" } }),
    ]);

    const ratings = reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    return {
      success: true,
      data: reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { success: false, error: "Failed to load reviews." };
  }
}

export async function getDestinationRating(destinationId: string) {
  try {
    const result = await db.review.aggregate({
      where: { destinationId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    });

    return {
      success: true,
      averageRating: Math.round((result._avg.rating || 0) * 10) / 10,
      totalReviews: result._count,
    };
  } catch (error) {
    console.error("Failed to fetch rating:", error);
    return { success: true, averageRating: 0, totalReviews: 0 };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized." };
    }

    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return { success: false, error: "Review not found." };
    }

    if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "You can only delete your own reviews." };
    }

    await db.review.delete({ where: { id: reviewId } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "Failed to delete review." };
  }
}

export async function updateReviewStatus(reviewId: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Admin access required." };
    }

    await db.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update review status:", error);
    return { success: false, error: "Failed to update review status." };
  }
}

export async function getAllReviews(page = 1, pageSize = 20) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Admin access required." };
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          destination: { select: { id: true, name: true, slug: true } },
        },
      }),
      db.review.count(),
    ]);

    return {
      success: true,
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch all reviews:", error);
    return { success: false, error: "Failed to load reviews." };
  }
}
