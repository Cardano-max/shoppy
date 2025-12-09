import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true,
                },
              },
              variant: true,
            },
          },
          shippingAddress: {
            select: {
              line1: true,
              line2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
          billingAddress: {
            select: {
              line1: true,
              line2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
          statusHistory: {
            include: {
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
          },
          payments: true,
          shipments: true,
        },
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json({ order })
    } catch (error: any) {
      console.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Failed to fetch order', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      // Check if order exists and belongs to the store
      const existingOrder = await prisma.order.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      await prisma.order.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Order deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting order:', error)
      return NextResponse.json(
        { error: 'Failed to delete order', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
