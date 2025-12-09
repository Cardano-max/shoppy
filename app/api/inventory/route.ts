import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          storeId: context.storeId,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          salePrice: true,
          status: true,
          variants: {
            select: {
              id: true,
              title: true,
              sku: true,
              stock: true,
              price: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ products })
    } catch (error: any) {
      console.error('Error fetching inventory:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inventory', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
