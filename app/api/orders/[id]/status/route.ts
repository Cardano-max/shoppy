import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateOrderStatusSchema } from '@/lib/validations'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const body = await req.json()

      // Validate request body
      const validatedData = updateOrderStatusSchema.parse(body)

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

      // Update order status and create history record
      const order = await prisma.order.update({
        where: { id: params.id },
        data: {
          status: validatedData.status,
          statusHistory: {
            create: {
              oldStatus: existingOrder.status,
              newStatus: validatedData.status,
              note: validatedData.note,
              userId: context.userId,
            },
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      })

      return NextResponse.json(order)
    } catch (error: any) {
      console.error('Error updating order status:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update order status', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
