import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { prisma } from './prisma'

export function withAuth(
  handler: (req: Request, context: AuthContext) => Promise<Response>
): (req: Request, params?: any) => Promise<Response> {
  return async (req: Request, params?: any) => {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's active store membership
    const membership = await prisma.storeMembership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        store: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active store membership found' },
        { status: 403 }
      )
    }

    const context: AuthContext = {
      userId: session.user.id,
      storeId: membership.storeId,
      role: membership.role,
      store: membership.store,
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
