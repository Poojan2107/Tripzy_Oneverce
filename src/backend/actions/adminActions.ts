"use server";

import { db } from "../lib/db";
import { auth } from "../lib/auth";

async function verifyAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied: Admin authorization required.");
  }
}

export async function logAudit(action: string, entity: string, entityId?: string, metadata?: any) {
  try {
    const session = await auth();
    await db.auditLog.create({
      data: { action, entity, entityId, userId: session?.user?.id, metadata },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

export async function getAuditLogs(page = 1, pageSize = 50) {
  try {
    await verifyAdmin();
    const skip = (page - 1) * pageSize;
    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.auditLog.count(),
    ]);
    return { success: true, data: logs, total, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return { success: false, error: "Failed to load audit logs." };
  }
}

export async function getAdminUsers() {
  try {
    await verifyAdmin();
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

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  try {
    await verifyAdmin();
    await db.user.update({ where: { id: userId }, data: { role } });
    logAudit("UPDATE_USER_ROLE", "User", userId, { role });
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update role." };
  }
}

export async function bulkUpdateReviewStatus(ids: string[], status: "APPROVED" | "REJECTED" | "PENDING") {
  try {
    await verifyAdmin();
    await db.review.updateMany({ where: { id: { in: ids } }, data: { status } });
    logAudit("BULK_UPDATE_REVIEW_STATUS", "Review", undefined, { ids, status });
    return { success: true };
  } catch (error) {
    console.error("Bulk update review status failed:", error);
    return { success: false, error: "Failed to update reviews." };
  }
}

export async function bulkDeleteReviews(ids: string[]) {
  try {
    await verifyAdmin();
    await db.review.deleteMany({ where: { id: { in: ids } } });
    logAudit("BULK_DELETE_REVIEWS", "Review", undefined, { ids });
    return { success: true };
  } catch (error) {
    console.error("Bulk delete reviews failed:", error);
    return { success: false, error: "Failed to delete reviews." };
  }
}

export async function getMediaLibrary() {
  try {
    await verifyAdmin();
    const images = await db.destination.findMany({
      select: { id: true, name: true, images: true, slug: true },
    });
    const experienceImages = await db.experience.findMany({
      select: { id: true, name: true, featuredImage: true, slug: true },
    });
    const allImages: { id: string; name: string; url: string; source: string }[] = [];
    for (const d of images) {
      for (const img of d.images) {
        allImages.push({ id: d.id, name: d.name, url: img, source: "destination" });
      }
    }
    for (const e of experienceImages) {
      if (e.featuredImage) {
        allImages.push({ id: e.id, name: e.name, url: e.featuredImage, source: "experience" });
      }
    }
    return { success: true, data: allImages };
  } catch (error) {
    console.error("Failed to fetch media library:", error);
    return { success: false, error: "Failed to load media." };
  }
}
