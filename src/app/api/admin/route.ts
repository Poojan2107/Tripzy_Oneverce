import { auth } from "../../../backend/lib/auth";
import { db } from "../../../backend/lib/db";
import { checkRateLimit } from "../../../backend/lib/rate-limit";

const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

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

    if (user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Forbidden." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      isAdmin: true,
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
    if (!(await checkRateLimit(request))) {
      return new Response(JSON.stringify({ error: "Too many requests." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const allowedHost = process.env.NEXTAUTH_URL || "https://tripzy-oneverce.vercel.app";
    if (origin && !origin.startsWith(allowedHost.replace(/\/$/, '')) && referer && !referer.startsWith(allowedHost.replace(/\/$/, ''))) {
      return new Response(JSON.stringify({ error: "Forbidden." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { email, setupKey } = body;

    if (!ADMIN_SETUP_KEY || ADMIN_SETUP_KEY.length < 16) {
      return new Response(JSON.stringify({ error: "Admin setup key not configured or too short (min 16 characters)." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof setupKey !== 'string' || !timingSafeEqual(setupKey, ADMIN_SETUP_KEY)) {
      return new Response(JSON.stringify({ error: "Invalid setup key." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!email || typeof email !== 'string') {
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
