import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { updateCustomerSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/customers/[id] - Get a single customer
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
    const customer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        storeId,
      },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error: any) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer', details: error?.message }, { status: 500 })
  }
}

// PATCH /api/customers/[id] - Update a customer
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
    const validatedData = updateCustomerSchema.parse(body)

    // Check if customer exists and belongs to the store
    const existingCustomer = await prisma.customer.findFirst({
      where: { id: params.id, storeId },
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // If email is being updated, check for duplicates
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const duplicateEmail = await prisma.customer.findFirst({
        where: {
          storeId,
          email: validatedData.email,
          id: { not: params.id },
        },
      })

      if (duplicateEmail) {
        return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 409 })
      }
    }

    // If phone is being updated, check for duplicates
    if (validatedData.phone && validatedData.phone !== existingCustomer.phone) {
      const duplicatePhone = await prisma.customer.findFirst({
        where: {
          storeId,
          phone: validatedData.phone,
          id: { not: params.id },
        },
      })

      if (duplicatePhone) {
        return NextResponse.json({ error: 'Customer with this phone already exists' }, { status: 409 })
      }
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        addresses: true,
      },
    })

    return NextResponse.json(customer)
  } catch (error: any) {
    console.error('Error updating customer:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update customer', details: error?.message }, { status: 500 })
  }
}

// DELETE /api/customers/[id] - Delete a customer
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

    // Check if customer exists and belongs to the store
    const customer = await prisma.customer.findFirst({
      where: { id: params.id, storeId },
      include: {
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check if customer has orders
    if (customer._count.orders > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete customer with order history',
          suggestion: 'Consider archiving the customer instead'
        },
        { status: 409 }
      )
    }

    // Delete addresses first
    if (customer._count.addresses > 0) {
      await prisma.address.deleteMany({
        where: { customerId: params.id },
      })
    }

    // Delete the customer
    await prisma.customer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Failed to delete customer', details: error?.message }, { status: 500 })
  }
}
