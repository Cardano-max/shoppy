import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
}

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'shoopy-demo-secret'

// Get session for pages (redirects to login if not authenticated)
export async function getSession() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session
}

// Get session with store requirement (redirects if no store access)
export async function requireStoreSession() {
  const session = await getSession()
  if (!session.user.defaultStoreId) {
    redirect('/login')
  }
  return session
}

// Get session for API routes (returns null if not authenticated, no redirect)
export async function getApiSession() {
  const session = await getServerSession()
  return session
}

// Require authentication for API routes (returns 401 if not authenticated)
export async function requireApiAuth() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return {
      error: 'Unauthorized',
      status: 401,
      session: null
    }
  }
  return {
    error: null,
    status: 200,
    session
  }
}

// Require store access for API routes
export async function requireApiStoreAuth() {
  const authResult = await requireApiAuth()
  if (authResult.error) {
    return authResult
  }

  const session = authResult.session
  if (!session?.user?.defaultStoreId) {
    return {
      error: 'Store access required',
      status: 403,
      session: null
    }
  }

  return {
    error: null,
    status: 200,
    session,
    storeId: session.user.defaultStoreId
  }
}

// Check if user has specific role
export async function requireRole(allowedRoles: string[]) {
  const authResult = await requireApiStoreAuth()
  if (authResult.error) {
    return authResult
  }

  const session = authResult.session
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return {
      error: 'Insufficient permissions',
      status: 403,
      session: null,
      storeId: null
    }
  }

  return {
    error: null,
    status: 200,
    session,
    storeId: authResult.storeId
  }
}

// Middleware auth (used by Next.js middleware)
export async function middlewareAuth(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token')?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

