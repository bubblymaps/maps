import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication or onboarding
  const publicPaths = ["/", "/signin", "/home", "/waypoints", "/waypoint", "/terms", "/privacy", "/support", "/api"]
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If user is authenticated
  if (token) {
    // If user doesn't have a handle/username and is not already on onboarding page
    if (!token.handle && pathname !== "/onboarding") {
      // Only redirect if they're trying to access a protected page
      if (!isPublicPath || pathname === "/settings" || pathname.startsWith("/profile/")) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    }

    // If user has a handle and is trying to access onboarding, redirect to home
    if (token.handle && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/home", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
}
