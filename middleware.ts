import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings", "/employers/post-job"]

// Paths that require specific roles
const ROLE_PROTECTED_PATHS = {
  "/dashboard/employer": ["employer"],
  "/dashboard/jobseeker": ["jobseeker"],
  "/admin": ["admin"],
  "/employers/post-job": ["employer"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for authentication if accessing protected paths
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const sessionCookie = request.cookies.get("job_board_session")

    if (!sessionCookie?.value) {
      // Redirect to login page if not authenticated
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    try {
      const session = JSON.parse(sessionCookie.value)

      // Check for role-specific paths
      for (const [path, roles] of Object.entries(ROLE_PROTECTED_PATHS)) {
        if (pathname.startsWith(path) && !roles.includes(session.role)) {
          // Redirect to appropriate dashboard based on role
          let redirectPath = "/"
          if (session.role === "employer") redirectPath = "/dashboard/employer"
          else if (session.role === "jobseeker") redirectPath = "/dashboard/jobseeker"
          else if (session.role === "admin") redirectPath = "/admin"

          return NextResponse.redirect(new URL(redirectPath, request.url))
        }
      }
    } catch (error) {
      // Invalid session, redirect to login
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/employers/post-job", "/settings/:path*"],
}
