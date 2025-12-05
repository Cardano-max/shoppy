import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createCategorySchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/categories
export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const categories = await prisma.category.findMany({
      where: { storeId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories', details: error?.message }, { status: 500 })
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    // Check for duplicate slug
    const existingCategory = await prisma.category.findFirst({
      where: { storeId, slug: validatedData.slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
    }

    const category = await prisma.category.create({
      data: { ...validatedData, storeId },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create category', details: error?.message }, { status: 500 })
  }
}
