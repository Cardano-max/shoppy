import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createProductSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const search = searchParams.get('search')
      const categoryId = searchParams.get('categoryId')
      const status = searchParams.get('status')

      const where: any = {
        storeId: context.storeId,
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (categoryId) {
        where.categoryId = categoryId
      }

      if (status) {
        where.status = status
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(products)
    } catch (error: any) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error?.message },
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
      const validatedData = createProductSchema.parse(body)

      const product = await prisma.product.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
        include: {
          category: true,
        },
      })

      return NextResponse.json(product, { status: 201 })
    } catch (error: any) {
      console.error('Error creating product:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create product', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}



