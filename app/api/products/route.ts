import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createProductSchema, productFilterSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/products - List products with filtering and pagination
export async function GET(request: Request) {
  try {
    // Check authentication and get store context
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const filters = productFilterSchema.parse({
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      collectionId: searchParams.get('collectionId') || undefined,
      status: searchParams.get('status') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    })

    // Build where clause
    const where: any = { storeId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.categoryId) where.categoryId = filters.categoryId
    if (filters.collectionId) where.collectionId = filters.collectionId
    if (filters.status) where.status = filters.status

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {}
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
    }

    // Execute query with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          collection: true,
          variants: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder,
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    // Check authentication and get store context
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()

    // Validate request body
    const validatedData = createProductSchema.parse(body)

    // Check if SKU already exists in the store
    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId,
        sku: validatedData.sku,
      },
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 409 })
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

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        storeId,
      },
      include: {
        category: true,
        collection: true,
        variants: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create product', details: error?.message }, { status: 500 })
  }
}



