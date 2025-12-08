import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateProductSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          category: true,
          variants: true,
          media: true,
        },
      })

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      return NextResponse.json(product)
    } catch (error: any) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error?.message },
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
      const validatedData = updateProductSchema.parse(body)

      // Check if product exists and belongs to the store
      const existingProduct = await prisma.product.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const product = await prisma.product.update({
        where: { id: params.id },
        data: validatedData,
        include: {
          category: true,
          variants: true,
        },
      })

      return NextResponse.json(product)
    } catch (error: any) {
      console.error('Error updating product:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update product', details: error?.message },
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
      // Check if product exists and belongs to the store
      const existingProduct = await prisma.product.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      await prisma.product.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
