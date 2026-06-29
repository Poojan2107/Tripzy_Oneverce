import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

if (!process.env.AUTH_SECRET) {
  console.error("[tripzy/auth] Missing AUTH_SECRET environment variable — auth will fail");
}
if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.includes('\\r\\n')) {
  console.error("[tripzy/auth] AUTH_SECRET contains \\r\\n — likely corrupted from Vercel CLI encoding");
}

if (!process.env.NEXTAUTH_URL) {
  console.error("[tripzy/auth] Missing NEXTAUTH_URL — OAuth callback will fail");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("[tripzy/auth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET — Google OAuth unavailable");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "USER";
      }
      return session;
    },
  },
});
