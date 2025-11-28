import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  if (token) {

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
