import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
}

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'shoopy-demo-secret'

export async function getSession() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session
}

export async function requireStoreSession() {
  const session = await getSession()
  if (!session.user.defaultStoreId) {
    redirect('/login')
  }
  return session
}

export async function middlewareAuth(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token')?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

