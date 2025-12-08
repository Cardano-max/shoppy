import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name?: string | null
    defaultStoreId?: string
    role?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      defaultStoreId?: string
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    storeId?: string
    role?: string
  }
}
