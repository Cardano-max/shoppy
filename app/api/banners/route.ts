import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { createBannerSchema } from '@/lib/validations'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const banners = await prisma.banner.findMany({
        where: {
          storeId: context.storeId,
        },
        orderBy: {
          position: 'asc',
        },
      })

      return NextResponse.json(banners)
    } catch (error: any) {
      console.error('Error fetching banners:', error)
      return NextResponse.json(
        { error: 'Failed to fetch banners', details: error?.message },
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
      const validatedData = createBannerSchema.parse(body)

      const banner = await prisma.banner.create({
        data: {
          ...validatedData,
          storeId: context.storeId,
        },
      })

      return NextResponse.json(banner, { status: 201 })
    } catch (error: any) {
      console.error('Error creating banner:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create banner', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
