import { auth } from "./src/backend/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return Response.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
    }
    if (role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (
    (nextUrl.pathname.startsWith("/profile") ||
      nextUrl.pathname.startsWith("/trips")) &&
    !isAuthenticated
  ) {
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
    );
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
