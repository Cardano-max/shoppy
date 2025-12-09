import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint should only be accessible once to seed the database
export async function GET() {
  try {
    // Check if already seeded
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({
        message: 'Database already seeded',
        users: existingUsers,
      })
    }

    // Run the seed (simplified version)
    const bcrypt = require('bcryptjs')

    // Create plan
    const plan = await prisma.storePlan.create({
      data: {
        name: 'Premium',
        description: 'Premium plan with all features',
        priceMonthly: 999,
        priceYearly: 9999,
        features: JSON.stringify(['Unlimited products', 'Unlimited orders', 'Analytics']),
      },
    })

    // Create store
    const store = await prisma.store.create({
      data: {
        name: 'Kiwi Party',
        domain: 'kiwiparty.in',
        category: 'Party Supplies',
        phone: '+91 9876543210',
        email: 'store@kiwiparty.in',
        wallet: 1000,
        planId: plan.id,
        planStatus: 'ACTIVE',
      },
    })

    // Create user
    const hashedPassword = await bcrypt.hash('Password123!', 10)
    const user = await prisma.user.create({
      data: {
        email: 'founder@kiwiparty.in',
        name: 'Ateeb Founder',
        phone: '+91 9876543210',
        password: hashedPassword,
        status: 'ACTIVE',
      },
    })

    // Create membership
    await prisma.storeMembership.create({
      data: {
        userId: user.id,
        storeId: store.id,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    })

    // Create sample category
    const category = await prisma.category.create({
      data: {
        name: 'Birthday Decorations',
        storeId: store.id,
        status: 'active',
      },
    })

    // Create sample products
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Happy Birthday Banner - Gold',
          sku: 'BD-001',
          description: 'Premium gold birthday banner',
          salePrice: 199,
          mrp: 299,
          quantity: 100,
          storeId: store.id,
          categoryId: category.id,
          status: 'ACTIVE',
        },
        {
          name: 'Balloon Set - Multi Color (50 pcs)',
          sku: 'BD-002',
          description: 'Colorful balloon set',
          salePrice: 149,
          mrp: 199,
          quantity: 200,
          storeId: store.id,
          categoryId: category.id,
          status: 'ACTIVE',
        },
      ],
    })

    // Create sample customer
    const customer = await prisma.customer.create({
      data: {
        name: 'John Doe',
        phone: '+91 9999999999',
        email: 'john@example.com',
        type: 'Consumer',
        storeId: store.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: 1,
        stores: 1,
        products: 2,
        customers: 1,
        categories: 1,
      },
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error?.message,
      },
      { status: 500 }
    )
  }
}
