import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateCouponSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const coupon = await prisma.coupon.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!coupon) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }

      return NextResponse.json(coupon)
    } catch (error: any) {
      console.error('Error fetching coupon:', error)
      return NextResponse.json(
        { error: 'Failed to fetch coupon', details: error?.message },
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
      const validatedData = updateCouponSchema.parse(body)

      // Check if coupon exists and belongs to the store
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCoupon) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }

      const coupon = await prisma.coupon.update({
        where: { id: params.id },
        data: validatedData,
      })

      return NextResponse.json(coupon)
    } catch (error: any) {
      console.error('Error updating coupon:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update coupon', details: error?.message },
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
      // Check if coupon exists and belongs to the store
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCoupon) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }

      await prisma.coupon.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Coupon deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting coupon:', error)
      return NextResponse.json(
        { error: 'Failed to delete coupon', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
