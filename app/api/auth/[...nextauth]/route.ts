import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const authHandler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required.')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            memberships: {
              where: { status: 'ACTIVE' },
              include: { store: true },
            },
          },
        })

        if (!user) throw new Error('Invalid credentials.')
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) throw new Error('Invalid credentials.')

        if (!user.memberships.length) {
          throw new Error('No active store access.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          defaultStoreId: user.memberships[0].storeId,
          role: user.memberships[0].role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.storeId = user.defaultStoreId
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.userId as string) || ''
        session.user.defaultStoreId = (token.storeId as string) || ''
        session.user.role = (token.role as string) || ''
      }
      return session
    },
  },
})

const GET = authHandler.handlers.GET
const POST = authHandler.handlers.POST
const OPTIONS = async () => NextResponse.json({})

export { GET, POST, OPTIONS }

