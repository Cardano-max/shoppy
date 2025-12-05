import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { updateOrderStatusSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        storeId,
      },
      include: {
        customer: {
          include: {
            addresses: true,
          },
        },
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        payments: true,
        shipments: true,
        invoices: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order', details: error?.message }, { status: 500 })
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()

    // Validate request body
    const validatedData = updateOrderStatusSchema.parse(body)

    // Check if order exists and belongs to the store
    const existingOrder = await prisma.order.findFirst({
      where: { id: params.id, storeId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      NEW: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPMENT_READY', 'CANCELLED'],
      SHIPMENT_READY: ['IN_TRANSIT', 'CANCELLED'],
      IN_TRANSIT: ['DELIVERED', 'RETURNED'],
      DELIVERED: ['RETURNED'],
      CANCELLED: [],
      RETURNED: [],
    }

    const allowedStatuses = validTransitions[existingOrder.status] || []
    if (!allowedStatuses.includes(validatedData.status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${existingOrder.status} to ${validatedData.status}`,
          allowedStatuses,
        },
        { status: 400 }
      )
    }

    // Handle inventory restoration for cancelled/returned orders
    if (validatedData.status === 'CANCELLED' || validatedData.status === 'RETURNED') {
      for (const item of existingOrder.items) {
        // Restore product inventory
        if (item.productId && item.product?.trackQuantity) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          })

          // Create inventory adjustment record
          await prisma.inventoryAdjustment.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              storeId,
              type: validatedData.status === 'CANCELLED' ? 'CANCELLED' : 'RETURN',
              quantity: item.quantity,
              reason: `Order ${existingOrder.orderNumber} ${validatedData.status.toLowerCase()}`,
            },
          })
        }

        // Restore variant inventory
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { increment: item.quantity } },
          })
        }
      }
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        updatedAt: new Date(),
        statusHistory: {
          create: {
            status: validatedData.status,
            notes: validatedData.notes || `Status changed to ${validatedData.status}`,
          },
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error updating order:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update order', details: error?.message }, { status: 500 })
  }
}

// DELETE /api/orders/[id] - Cancel order (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult

    // Check if order exists and belongs to the store
    const order = await prisma.order.findFirst({
      where: { id: params.id, storeId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Only allow cancellation of NEW or CONFIRMED orders
    if (!['NEW', 'CONFIRMED'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Only NEW or CONFIRMED orders can be cancelled' },
        { status: 400 }
      )
    }

    // Restore inventory
    for (const item of order.items) {
      if (item.productId && item.product?.trackQuantity) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        })

        await prisma.inventoryAdjustment.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            storeId,
            type: 'CANCELLED',
            quantity: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
          },
        })
      }

      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { quantity: { increment: item.quantity } },
        })
      }
    }

    // Update order to cancelled
    await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: {
            status: 'CANCELLED',
            notes: 'Order cancelled',
          },
        },
      },
    })

    return NextResponse.json({ message: 'Order cancelled successfully' })
  } catch (error: any) {
    console.error('Error cancelling order:', error)
    return NextResponse.json({ error: 'Failed to cancel order', details: error?.message }, { status: 500 })
  }
}
