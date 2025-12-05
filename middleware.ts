import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Protect all routes except login and API auth routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /login (login page)
     * 2. /api/auth (NextAuth routes)
     * 3. /_next (Next.js internals)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    '/((?!login|api/auth|_next|favicon.ico|robots.txt).*)',
  ],
}
