import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

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
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: validatedData.name,
          phone: validatedData.phone,
          password: hashedPassword,
          status: 'ACTIVE',
        },
      })

      // Create store
      const store = await tx.store.create({
        data: {
          name: validatedData.storeName,
          email: validatedData.email.toLowerCase(),
          phone: validatedData.phone,
          wallet: 0,
          planStatus: 'TRIAL',
        },
      })

      // Create store membership
      await tx.storeMembership.create({
        data: {
          userId: user.id,
          storeId: store.id,
          role: 'OWNER',
          status: 'ACTIVE',
        },
      })

      // Create default category
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
      message: 'Account created successfully! Please sign in.',
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

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account', details: error?.message },
      { status: 500 }
    )
  }
}
