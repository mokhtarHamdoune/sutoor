import { auth } from "./lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth();

  const isLoggedIn = !!session?.user;

  const protectedRoutes = [
    "/posts/new",
    "/posts/:slug/edit",
    "/profile/:id/edit",
  ];

  // Check if the request matches a protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Replace :slug, :id, etc. with a pattern that matches slugs (including hyphens) or IDs
    const routePattern = new RegExp(
      "^" + route.replace(/:\w+/g, "[\\w-]+") + "$"
    );
    return routePattern.test(pathname);
  });

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = pathname.startsWith("/auth");
  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    // Check if there's a callbackUrl to redirect back to
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl = callbackUrl || "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

// Specify which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
};
