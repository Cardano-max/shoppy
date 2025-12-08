import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createCategorySchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const search = searchParams.get('search')
      const status = searchParams.get('status')

      const where: any = {
        storeId: context.storeId,
      }

      if (search) {
        where.name = { contains: search, mode: 'insensitive' }
      }

      if (status) {
        where.status = status
      }

      const categories = await prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(categories)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error?.message },
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
      const validatedData = createCategorySchema.parse(body)

      const category = await prisma.category.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
      })

      return NextResponse.json(category, { status: 201 })
    } catch (error: any) {
      console.error('Error creating category:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create category', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
