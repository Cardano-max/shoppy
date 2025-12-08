import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createInvoiceSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')
      const customerId = searchParams.get('customerId')

      const where: any = {
        storeId: context.storeId,
      }

      if (status) {
        where.status = status
      }

      if (customerId) {
        where.customerId = customerId
      }

      const invoices = await prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          order: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(invoices)
    } catch (error: any) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json(
        { error: 'Failed to fetch invoices', details: error?.message },
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
      const validatedData = createInvoiceSchema.parse(body)

      const invoice = await prisma.invoice.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
        include: {
          customer: true,
          order: true,
        },
      })

      return NextResponse.json(invoice, { status: 201 })
    } catch (error: any) {
      console.error('Error creating invoice:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create invoice', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
