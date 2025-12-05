import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createCollectionSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const collections = await prisma.collection.findMany({
      where: { storeId },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ collections })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch collections', details: error?.message }, { status: 500 })
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
    const validatedData = createCollectionSchema.parse(body)

    const existingCollection = await prisma.collection.findFirst({
      where: { storeId, slug: validatedData.slug },
    })

    if (existingCollection) {
      return NextResponse.json({ error: 'Collection with this slug already exists' }, { status: 409 })
    }

    const collection = await prisma.collection.create({
      data: { ...validatedData, storeId },
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create collection', details: error?.message }, { status: 500 })
  }
}
