import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, searchParams } = req.nextUrl;

  const protectedRoutes =
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/notes") ||
    pathname.startsWith("/admin");

  if (protectedRoutes && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow admins to access dashboard if they have the 'view' parameter
  // This lets them click "User View" from admin panel
  const allowUserView = searchParams.get("view") === "user";

  // Redirect admins from /dashboard to /admin (unless explicitly viewing as user)
  if (pathname === "/dashboard" && token?.role === "admin" && !allowUserView) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Prevent non-admins from accessing admin routes
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*", "/admin/:path*"],
};
