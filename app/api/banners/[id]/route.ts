import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { updateBannerSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const banner = await prisma.banner.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }

      return NextResponse.json(banner)
    } catch (error: any) {
      console.error('Error fetching banner:', error)
      return NextResponse.json(
        { error: 'Failed to fetch banner', details: error?.message },
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
      const validatedData = updateBannerSchema.parse(body)

      // Check if banner exists and belongs to the store
      const existingBanner = await prisma.banner.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingBanner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }

      const banner = await prisma.banner.update({
        where: { id: params.id },
        data: validatedData,
      })

      return NextResponse.json(banner)
    } catch (error: any) {
      console.error('Error updating banner:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update banner', details: error?.message },
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
      // Check if banner exists and belongs to the store
      const existingBanner = await prisma.banner.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
      })

      if (!existingBanner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }

      await prisma.banner.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Banner deleted successfully' })
    } catch (error: any) {
      console.error('Error deleting banner:', error)
      return NextResponse.json(
        { error: 'Failed to delete banner', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
