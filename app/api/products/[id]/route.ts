import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { updateProductSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/products/[id] - Get a single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        storeId,
      },
      include: {
        category: true,
        collection: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product', details: error?.message }, { status: 500 })
  }
}

// PATCH /api/products/[id] - Update a product
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()

    // Validate request body
    const validatedData = updateProductSchema.parse(body)

    // Check if product exists and belongs to the store
    const existingProduct = await prisma.product.findFirst({
      where: { id: params.id, storeId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // If SKU is being updated, check for duplicates
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findFirst({
        where: {
          storeId,
          sku: validatedData.sku,
          id: { not: params.id },
        },
      })

      if (duplicateSku) {
        return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 409 })
      }
    }

    // Validate category if provided
    if (validatedData.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: validatedData.categoryId, storeId },
      })
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
    }

    // Validate collection if provided
    if (validatedData.collectionId) {
      const collection = await prisma.collection.findFirst({
        where: { id: validatedData.collectionId, storeId },
      })
      if (!collection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        collection: true,
        variants: true,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update product', details: error?.message }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult

    // Check if product exists and belongs to the store
    const product = await prisma.product.findFirst({
      where: { id: params.id, storeId },
      include: {
        _count: {
          select: {
            orderItems: true,
            variants: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if product is used in orders
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete product that has been ordered',
          suggestion: 'Consider archiving the product instead'
        },
        { status: 409 }
      )
    }

    // Delete variants first
    if (product._count.variants > 0) {
      await prisma.productVariant.deleteMany({
        where: { productId: params.id },
      })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 })
  }
}
