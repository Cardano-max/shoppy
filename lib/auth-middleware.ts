import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

// MOCK MODE: Database tables not yet created
// This uses session data directly without database queries
// Replace with real database queries after running migrations

export function withAuth(
  handler: (req: Request, context: AuthContext) => Promise<Response>
): (req: Request, params?: any) => Promise<Response> {
  return async (req: Request, params?: any) => {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // MOCK: Use session data directly without database query
    const storeId = (session.user as any).defaultStoreId || `store-${session.user.id}`
    const role = (session.user as any).role || 'OWNER'

    const context: AuthContext = {
      userId: session.user.id,
      storeId: storeId,
      role: role,
      store: {
        id: storeId,
        name: 'Mock Store',
        email: session.user.email || '',
      },
      params,
    }

    return handler(req, context)
  }
}

export interface AuthContext {
  userId: string
  storeId: string
  role: string
  store: any
  params?: any
}
