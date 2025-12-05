import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createBannerSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const banners = await prisma.banner.findMany({
      where: { storeId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ banners })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch banners', details: error?.message }, { status: 500 })
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
    const validatedData = createBannerSchema.parse(body)

    const banner = await prisma.banner.create({
      data: { ...validatedData, storeId },
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create banner', details: error?.message }, { status: 500 })
  }
}
