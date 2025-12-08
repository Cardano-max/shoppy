import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateCustomerSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const customer = await prisma.customer.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
          },
          addresses: true,
          _count: {
            select: { orders: true, invoices: true },
          },
        },
      })

      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      return NextResponse.json(customer)
    } catch (error: any) {
      console.error('Error fetching customer:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customer', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const body = await req.json()

      // Validate request body
      const validatedData = updateCustomerSchema.parse(body)

      // Check if customer exists and belongs to the store
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCustomer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      const customer = await prisma.customer.update({
        where: { id: params.id },
        data: validatedData,
      })

      return NextResponse.json(customer)
    } catch (error: any) {
      console.error('Error updating customer:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update customer', details: error?.message },
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
      // Check if customer exists and belongs to the store
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCustomer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      await prisma.customer.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Customer deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      return NextResponse.json(
        { error: 'Failed to delete customer', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
