import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { updateCategorySchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/categories/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const category = await prisma.category.findFirst({
      where: { id: params.id, storeId },
      include: { _count: { select: { products: true } } },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch category', details: error?.message }, { status: 500 })
  }
}

// PATCH /api/categories/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const existingCategory = await prisma.category.findFirst({
      where: { id: params.id, storeId },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check for duplicate slug
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const duplicateSlug = await prisma.category.findFirst({
        where: { storeId, slug: validatedData.slug, id: { not: params.id } },
      })
      if (duplicateSlug) {
        return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { ...validatedData, updatedAt: new Date() },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update category', details: error?.message }, { status: 500 })
  }
}

// DELETE /api/categories/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const category = await prisma.category.findFirst({
      where: { id: params.id, storeId },
      include: { _count: { select: { products: true } } },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products', suggestion: 'Disable it instead' },
        { status: 409 }
      )
    }

    await prisma.category.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete category', details: error?.message }, { status: 500 })
  }
}
