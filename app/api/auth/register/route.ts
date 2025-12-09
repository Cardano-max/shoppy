import { NextResponse } from 'next/server'
import { z } from 'zod'

// MOCK MODE: Database tables not yet created
// This bypasses the database and simulates successful registration
// Replace with real database implementation after running migrations

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  storeName: z.string().min(2, 'Store name is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // MOCK: Simulate successful registration without database
    console.log('Mock registration for:', validatedData.email)

    // Generate mock IDs
    const mockUserId = `mock-user-${Date.now()}`
    const mockStoreId = `mock-store-${Date.now()}`

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now use mock login.',
      user: {
        id: mockUserId,
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
      },
      store: {
        id: mockStoreId,
        name: validatedData.storeName,
      },
      mock: true,
      note: 'Using mock authentication. Any email/password combination will work for login.',
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration validation error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to validate registration data', details: error?.message },
      { status: 500 }
    )
  }
}

/*
TO ENABLE REAL DATABASE:

1. Run migration: npx prisma db push
2. Uncomment this code and replace the mock implementation above:

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user and store in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: validatedData.name,
          phone: validatedData.phone,
          password: hashedPassword,
          status: 'ACTIVE',
        },
      })

      const store = await tx.store.create({
        data: {
          name: validatedData.storeName,
          email: validatedData.email.toLowerCase(),
          phone: validatedData.phone,
          wallet: 0,
          planStatus: 'TRIAL',
        },
      })

      await tx.storeMembership.create({
        data: {
          userId: user.id,
          storeId: store.id,
          role: 'OWNER',
          status: 'ACTIVE',
        },
      })

      await tx.category.create({
        data: {
          name: 'Uncategorized',
          storeId: store.id,
          status: 'active',
        },
      })

      return { user, store }
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      store: {
        id: result.store.id,
        name: result.store.name,
      },
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account', details: error?.message },
      { status: 500 }
    )
  }
}
*/
