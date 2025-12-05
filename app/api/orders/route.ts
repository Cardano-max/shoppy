import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createOrderSchema, orderFilterSchema } from '@/lib/validations'
import { z } from 'zod'

// Helper function to generate order number
async function generateOrderNumber(storeId: string): Promise<string> {
  const latestOrder = await prisma.order.findFirst({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
    select: { orderNumber: true },
  })

  if (!latestOrder || !latestOrder.orderNumber) {
    return 'ORD-0001'
  }

  const match = latestOrder.orderNumber.match(/ORD-(\d+)/)
  if (match) {
    const nextNumber = parseInt(match[1]) + 1
    return `ORD-${nextNumber.toString().padStart(4, '0')}`
  }

  return 'ORD-0001'
}

// GET /api/orders - List orders with filtering and pagination
export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const filters = orderFilterSchema.parse({
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
      customerId: searchParams.get('customerId') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    })

    // Build where clause
    const where: any = { storeId }

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
        { customer: { phone: { contains: filters.search, mode: 'insensitive' } } },
      ]
    }

    if (filters.customerId) where.customerId = filters.customerId
    if (filters.status) where.status = filters.status

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate)
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate)
    }

    // Execute query with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          shippingAddress: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder,
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch orders', details: error?.message }, { status: 500 })
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()

    // Validate request body
    const validatedData = createOrderSchema.parse(body)

    // Verify customer exists and belongs to store
    const customer = await prisma.customer.findFirst({
      where: { id: validatedData.customerId, storeId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Verify shipping address if provided
    if (validatedData.shippingAddressId) {
      const address = await prisma.address.findFirst({
        where: {
          id: validatedData.shippingAddressId,
          customerId: validatedData.customerId,
        },
      })

      if (!address) {
        return NextResponse.json({ error: 'Shipping address not found' }, { status: 404 })
      }
    }

    // Calculate totals
    let subtotal = 0
    const itemsToCreate = []

    for (const item of validatedData.items) {
      // Verify product/variant exists
      if (item.productId) {
        const product = await prisma.product.findFirst({
          where: { id: item.productId, storeId },
        })
        if (!product) {
          return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 })
        }

        // Check inventory
        if (product.trackQuantity && product.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` },
            { status: 400 }
          )
        }
      }

      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        })
        if (!variant) {
          return NextResponse.json({ error: `Variant ${item.name} not found` }, { status: 404 })
        }

        // Check variant inventory
        if (variant.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${variant.name}. Available: ${variant.quantity}` },
            { status: 400 }
          )
        }
      }

      const itemTotal = item.quantity * item.price - item.discount
      subtotal += itemTotal

      itemsToCreate.push({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: itemTotal,
      })
    }

    const total = subtotal - validatedData.discount + validatedData.tax + validatedData.shippingCost

    // Generate order number
    const orderNumber = await generateOrderNumber(storeId)

    // Create order with items
    const order = await prisma.order.create({
      data: {
        storeId,
        orderNumber,
        customerId: validatedData.customerId,
        status: 'NEW',
        subtotal,
        discount: validatedData.discount,
        tax: validatedData.tax,
        shippingCost: validatedData.shippingCost,
        total,
        notes: validatedData.notes,
        deliveryMethod: validatedData.deliveryMethod,
        shippingAddressId: validatedData.shippingAddressId,
        expectedDeliveryDate: validatedData.expectedDeliveryDate
          ? new Date(validatedData.expectedDeliveryDate)
          : null,
        items: {
          create: itemsToCreate,
        },
        statusHistory: {
          create: {
            status: 'NEW',
            notes: 'Order created',
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
      },
    })

    // Update inventory for products
    for (const item of validatedData.items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })

        if (product && product.trackQuantity) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          })

          // Create inventory adjustment record
          await prisma.inventoryAdjustment.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              storeId,
              type: 'SALE',
              quantity: -item.quantity,
              reason: `Order ${orderNumber}`,
            },
          })
        }
      }

      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { quantity: { decrement: item.quantity } },
        })
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create order', details: error?.message }, { status: 500 })
  }
}



