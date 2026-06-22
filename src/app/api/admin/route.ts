import { auth } from "../../../backend/lib/auth";
import { db } from "../../../backend/lib/db";

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
