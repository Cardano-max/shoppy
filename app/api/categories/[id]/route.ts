import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateCategorySchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const category = await prisma.category.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      })

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }

      return NextResponse.json(category)
    } catch (error: any) {
      console.error('Error fetching category:', error)
      return NextResponse.json(
        { error: 'Failed to fetch category', details: error?.message },
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
      const validatedData = updateCategorySchema.parse(body)

      // Check if category exists and belongs to the store
      const existingCategory = await prisma.category.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCategory) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }

      const category = await prisma.category.update({
        where: { id: params.id },
        data: validatedData,
      })

      return NextResponse.json(category)
    } catch (error: any) {
      console.error('Error updating category:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update category', details: error?.message },
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
      // Check if category exists and belongs to the store
      const existingCategory = await prisma.category.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCategory) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }

      await prisma.category.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Category deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting category:', error)
      return NextResponse.json(
        { error: 'Failed to delete category', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
