import { NextResponse } from "next/server";
import { db } from "../../../backend/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json({ error: "Missing type or payload" }, { status: 400 });
    }

    let result = null;

    switch (type) {
      case "search":
        result = await db.searchEvent.create({
          data: {
            query: payload.query || "",
            experience: payload.experience || null,
            userId: payload.userId || null,
          },
        });
        break;

      case "view":
      case "page_view": {
        const destId = payload.destinationId || payload.page || null;
        if (destId) {
          const dest = await db.destination.findUnique({ where: { id: destId } });
          if (dest) {
            result = await db.viewEvent.create({
              data: { destinationId: destId, userId: payload.userId || null },
            });
          }
        }
        break;
      }

      case "planner":
      case "planner_completion":
        result = await db.plannerEvent.create({
          data: {
            destination: payload.destination || "",
            budget: payload.budget || payload.budgetTier || "Medium",
            duration: parseInt(payload.duration) || 3,
            travelStyle: payload.travelStyle || "Relaxed",
            interests: payload.interests || null,
            userId: payload.userId || null,
          },
        });
        break;

      case "recommendation":
        result = await db.recommendationEvent.create({
          data: {
            destination: payload.destination || "",
            experience: payload.experience || null,
            travelStyle: payload.travelStyle || null,
            userId: payload.userId || null,
          },
        });
        break;

      case "interaction":
      case "destination_click":
      case "affiliate_click":
      case "wishlist_save":
        result = await db.recommendationInteraction.create({
          data: {
            destinationId: payload.destinationId || payload.tourId || null,
            action: payload.action || type,
            userId: payload.userId || null,
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    console.error("Analytics Tracking API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
