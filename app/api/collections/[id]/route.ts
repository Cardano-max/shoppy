import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateCollectionSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const collection = await prisma.collection.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!collection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
      }

      return NextResponse.json(collection)
    } catch (error: any) {
      console.error('Error fetching collection:', error)
      return NextResponse.json(
        { error: 'Failed to fetch collection', details: error?.message },
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
      const validatedData = updateCollectionSchema.parse(body)

      // Check if collection exists and belongs to the store
      const existingCollection = await prisma.collection.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCollection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
      }

      const collection = await prisma.collection.update({
        where: { id: params.id },
        data: validatedData,
      })

      return NextResponse.json(collection)
    } catch (error: any) {
      console.error('Error updating collection:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update collection', details: error?.message },
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
      // Check if collection exists and belongs to the store
      const existingCollection = await prisma.collection.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingCollection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
      }

      await prisma.collection.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Collection deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting collection:', error)
      return NextResponse.json(
        { error: 'Failed to delete collection', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
