import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createCouponSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const coupons = await prisma.coupon.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ coupons })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch coupons', details: error?.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()
    const validatedData = createCouponSchema.parse(body)

    const existingCoupon = await prisma.coupon.findFirst({
      where: { storeId, code: validatedData.code },
    })

    if (existingCoupon) {
      return NextResponse.json({ error: 'Coupon with this code already exists' }, { status: 409 })
    }

    const coupon = await prisma.coupon.create({
      data: { ...validatedData, storeId },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create coupon', details: error?.message }, { status: 500 })
  }
}
