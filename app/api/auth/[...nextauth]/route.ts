import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// MOCK MODE: Database tables not yet created
// This accepts any email/password combination for testing
// Replace with real database authentication after running migrations

const handler = NextAuth({
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

        // MOCK: Accept any credentials for testing
        console.log('Mock login for:', credentials.email)

        // Generate mock IDs based on email for consistency
        const mockUserId = `mock-${credentials.email.replace(/[^a-z0-9]/gi, '-')}`
        const mockStoreId = `store-${credentials.email.replace(/[^a-z0-9]/gi, '-')}`

        return {
          id: mockUserId,
          email: credentials.email.toLowerCase(),
          name: credentials.email.split('@')[0], // Use email username as name
          defaultStoreId: mockStoreId,
          role: 'OWNER',
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
        session.user.id = token.userId as string
        session.user.defaultStoreId = token.storeId
        session.user.role = token.role
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

