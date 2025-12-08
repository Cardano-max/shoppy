import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createCollectionSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const search = searchParams.get('search')

      const where: any = {
        storeId: context.storeId,
      }

      if (search) {
        where.name = { contains: search, mode: 'insensitive' }
      }

      const collections = await prisma.collection.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(collections)
    } catch (error: any) {
      console.error('Error fetching collections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch collections', details: error?.message },
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
      const validatedData = createCollectionSchema.parse(body)

      const collection = await prisma.collection.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
      })

      return NextResponse.json(collection, { status: 201 })
    } catch (error: any) {
      console.error('Error creating collection:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create collection', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
