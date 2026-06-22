import { auth } from "../../../backend/lib/auth";
import { db } from "../../../backend/lib/db";

const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY;

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Not authenticated." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let user = await db.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // TESTING_MODE: auto-promote any signed-in user to ADMIN for easy testing
    if (process.env.TESTING_MODE === "true" && user.role !== "ADMIN") {
      user = await db.user.update({
        where: { id: session.user.id },
        data: { role: "ADMIN" },
      });
    }

    return new Response(JSON.stringify({ 
      isAdmin: user.role === "ADMIN",
      email: user.email,
      role: user.role
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return new Response(JSON.stringify({ error: "Failed to check admin status." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, setupKey } = body;

    if (!ADMIN_SETUP_KEY) {
      return new Response(JSON.stringify({ error: "Admin setup key not configured on server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (setupKey !== ADMIN_SETUP_KEY) {
      return new Response(JSON.stringify({ error: "Invalid setup key." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upsert: creates the user if they don't exist, or promotes existing user
    const user = await db.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: {
        email,
        name: email.split('@')[0],
        role: "ADMIN",
      },
    });

    return new Response(JSON.stringify({ message: "Admin access granted!", email, role: user.role }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to set up admin access." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
