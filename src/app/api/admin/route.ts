import { auth } from "../../../backend/lib/auth";
import { db } from "../../../backend/lib/db";

const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY;

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Not authenticated. Sign in with Google first." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found in database." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.role === "ADMIN") {
      return new Response(JSON.stringify({ message: "You are already an admin.", email: user.email }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { role: "ADMIN" },
    });

    return new Response(JSON.stringify({ 
      message: "Admin access granted!", 
      email: user.email,
      role: "ADMIN"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return new Response(JSON.stringify({ error: "Failed to set up admin access." }), {
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

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found. Sign in with Google first to create the account." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    return new Response(JSON.stringify({ message: "Admin access granted!", email, role: "ADMIN" }), {
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
