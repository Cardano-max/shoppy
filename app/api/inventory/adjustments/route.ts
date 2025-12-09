import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const adjustments = await prisma.inventoryAdjustment.findMany({
        where: {
          storeId: context.storeId,
        },
        include: {
          variant: {
            select: {
              id: true,
              title: true,
              sku: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100, // Limit to last 100 adjustments
      })

      return NextResponse.json({ adjustments })
    } catch (error: any) {
      console.error('Error fetching adjustment history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch adjustment history', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
