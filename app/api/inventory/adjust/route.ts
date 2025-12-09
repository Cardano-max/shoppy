import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'
import { z } from 'zod'

const adjustInventorySchema = z.object({
  variantId: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.number().int(),
  reason: z.enum([
    'MANUAL',
    'RECEIVED',
    'DAMAGED',
    'RETURNED',
    'SOLD',
    'RECOUNT',
  ]),
  note: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const body = await req.json()
      const validatedData = adjustInventorySchema.parse(body)

      const { variantId, productId, quantity, reason, note } = validatedData

      // Determine what to update - variant or product
      let targetVariantId = variantId
      let targetProductId = productId

      // If productId is provided but no variantId, we need to update the product directly
      // But InventoryAdjustment only works with variants
      // So we'll either need to create a default variant or work with products directly

      // For now, let's handle the simple case where we have a variantId
      if (!targetVariantId && !targetProductId) {
        return NextResponse.json(
          { error: 'Either variantId or productId must be provided' },
          { status: 400 }
        )
      }

      if (targetVariantId) {
        // Update variant stock and create adjustment record
        const result = await prisma.$transaction(async (tx) => {
          // Get current variant
          const variant = await tx.productVariant.findFirst({
            where: {
              id: targetVariantId,
              storeId: context.storeId,
            },
            include: {
              product: true,
            },
          })

          if (!variant) {
            throw new Error('Variant not found')
          }

          // Update variant stock
          const updatedVariant = await tx.productVariant.update({
            where: { id: targetVariantId },
            data: {
              stock: {
                increment: quantity,
              },
            },
          })

          // Also update parent product quantity (sum of all variants)
          const allVariants = await tx.productVariant.findMany({
            where: { productId: variant.productId },
          })

          const totalStock = allVariants.reduce(
            (sum, v) => sum + (v.id === targetVariantId ? updatedVariant.stock : v.stock),
            0
          )

          await tx.product.update({
            where: { id: variant.productId },
            data: { quantity: totalStock },
          })

          // Create adjustment record
          const adjustment = await tx.inventoryAdjustment.create({
            data: {
              variantId: targetVariantId,
              storeId: context.storeId,
              userId: context.userId,
              quantity,
              reason,
              note: note || null,
            },
          })

          return { variant: updatedVariant, adjustment }
        })

        return NextResponse.json(result)
      } else if (targetProductId) {
        // For products without variants, we'll update directly
        // But we need a variant to track adjustments
        // Let's create or get the default variant
        const result = await prisma.$transaction(async (tx) => {
          const product = await tx.product.findFirst({
            where: {
              id: targetProductId,
              storeId: context.storeId,
            },
            include: {
              variants: true,
            },
          })

          if (!product) {
            throw new Error('Product not found')
          }

          // Get or create default variant
          let variant = product.variants[0]
          if (!variant) {
            variant = await tx.productVariant.create({
              data: {
                title: 'Default',
                sku: `${product.sku}-DEFAULT`,
                price: product.salePrice,
                stock: product.quantity,
                productId: product.id,
                storeId: context.storeId,
              },
            })
          }

          // Update variant stock
          const updatedVariant = await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              stock: {
                increment: quantity,
              },
            },
          })

          // Update product quantity
          await tx.product.update({
            where: { id: targetProductId },
            data: {
              quantity: {
                increment: quantity,
              },
            },
          })

          // Create adjustment record
          const adjustment = await tx.inventoryAdjustment.create({
            data: {
              variantId: variant.id,
              storeId: context.storeId,
              userId: context.userId,
              quantity,
              reason,
              note: note || null,
            },
          })

          return { variant: updatedVariant, adjustment }
        })

        return NextResponse.json(result)
      }

      // This should never be reached due to validation, but TypeScript needs it
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    } catch (error: any) {
      console.error('Error adjusting inventory:', error)
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to adjust inventory', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
