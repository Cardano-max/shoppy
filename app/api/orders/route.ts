import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createOrderSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')
      const customerId = searchParams.get('customerId')
      const search = searchParams.get('search')

      const where: any = {
        storeId: context.storeId,
      }

      if (status) {
        where.status = status
      }

      if (customerId) {
        where.customerId = customerId
      }

      if (search) {
        where.orderNumber = { contains: search }
      }

      const orders = await prisma.order.findMany({
        where,
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
            orderBy: {
              createdAt: 'desc',
            },
          },
          payments: true,
          shipments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ orders })
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const body = await req.json()

      // Validate request body
      const validatedData = createOrderSchema.parse(body)

      const { items, ...orderData } = validatedData

      // Create order with items
      const order = await prisma.order.create({
        data: {
          ...orderData,
          storeId: context.storeId,
          items: {
            create: items,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      })

      return NextResponse.json(order, { status: 201 })
    } catch (error: any) {
      console.error('Error creating order:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create order', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
