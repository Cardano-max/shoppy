import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'
import { createCustomerSchema, customerFilterSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/customers - List customers with filtering and pagination
export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const filters = customerFilterSchema.parse({
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
    })

    // Build where clause
    const where: any = { storeId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.type) where.type = filters.type

    // Execute query with pagination
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          addresses: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder,
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      customers,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch customers', details: error?.message }, { status: 500 })
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const body = await request.json()

    // Validate request body
    const validatedData = createCustomerSchema.parse(body)

    // Check if customer with same email/phone exists (if provided)
    if (validatedData.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          storeId,
          email: validatedData.email,
        },
      })
      if (existingCustomer) {
        return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 409 })
      }
    }

    if (validatedData.phone) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          storeId,
          phone: validatedData.phone,
        },
      })
      if (existingCustomer) {
        return NextResponse.json({ error: 'Customer with this phone already exists' }, { status: 409 })
      }
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        storeId,
      },
      include: {
        addresses: true,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error: any) {
    console.error('Error creating customer:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create customer', details: error?.message }, { status: 500 })
  }
}



