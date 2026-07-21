import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // Define route classification
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  // Protected pages matching layout routes
  const isProtectedPage =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/automation") ||
    pathname.startsWith("/developer");

  // Case 1: Unauthenticated request to protected routes
  if (!token && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    // Remember landing path
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated request attempting auth login/register screens
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3: Root landing page path
  if (pathname === "/") {
    const target = token ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo, and generic asset images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
