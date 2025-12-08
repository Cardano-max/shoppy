import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createEstimateSchema } from '@/lib/validations'

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

      const estimates = await prisma.estimate.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(estimates)
    } catch (error: any) {
      console.error('Error fetching estimates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch estimates', details: error?.message },
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
      const validatedData = createEstimateSchema.parse(body)

      const estimate = await prisma.estimate.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
        include: {
          customer: true,
        },
      })

      return NextResponse.json(estimate, { status: 201 })
    } catch (error: any) {
      console.error('Error creating estimate:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create estimate', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
