import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createCouponSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const search = searchParams.get('search')
      const active = searchParams.get('active')

      const where: any = {
        storeId: context.storeId,
      }

      if (search) {
        where.code = { contains: search, mode: 'insensitive' }
      }

      if (active !== null) {
        where.active = active === 'true'
      }

      const coupons = await prisma.coupon.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(coupons)
    } catch (error: any) {
      console.error('Error fetching coupons:', error)
      return NextResponse.json(
        { error: 'Failed to fetch coupons', details: error?.message },
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
      const validatedData = createCouponSchema.parse(body)

      const coupon = await prisma.coupon.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
      })

      return NextResponse.json(coupon, { status: 201 })
    } catch (error: any) {
      console.error('Error creating coupon:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create coupon', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
