import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateInvoiceSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const invoice = await prisma.invoice.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          customer: true,
          order: {
            include: {
              items: {
                include: {
                  product: true,
                  variant: true,
                },
              },
            },
          },
        },
      })

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }

      return NextResponse.json(invoice)
    } catch (error: any) {
      console.error('Error fetching invoice:', error)
      return NextResponse.json(
        { error: 'Failed to fetch invoice', details: error?.message },
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
      const validatedData = updateInvoiceSchema.parse(body)

      // Check if invoice exists and belongs to the store
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingInvoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }

      const invoice = await prisma.invoice.update({
        where: { id: params.id },
        data: validatedData,
        include: {
          customer: true,
          order: true,
        },
      })

      return NextResponse.json(invoice)
    } catch (error: any) {
      console.error('Error updating invoice:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update invoice', details: error?.message },
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
      // Check if invoice exists and belongs to the store
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingInvoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }

      await prisma.invoice.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Invoice deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting invoice:', error)
      return NextResponse.json(
        { error: 'Failed to delete invoice', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
