import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { storeData, businessData, paymentData, completed } = body

    // Get the user's active store membership
    const membership = await prisma.storeMembership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        store: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active store found' },
        { status: 404 }
      )
    }

    // Update the store with onboarding data
    const updatedStore = await prisma.store.update({
      where: {
        id: membership.storeId,
      },
      data: {
        description: storeData.description || null,
        address: businessData.address || null,
        city: businessData.city || null,
        state: businessData.state || null,
        pincode: businessData.pincode || null,
        gstNumber: businessData.gstNumber || null,
        panNumber: businessData.panNumber || null,
        // Store additional onboarding data in metadata (if you have a JSON field)
        // For now, we'll just mark onboarding as complete
      },
    })

    // You could also create default settings, payment configurations, etc. here
    // For example, create default shipping zones, payment methods, etc.

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      store: updatedStore,
    })
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's store with onboarding data
    const membership = await prisma.storeMembership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        store: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active store found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      store: membership.store,
      onboardingComplete: !!(
        membership.store.address &&
        membership.store.city &&
        membership.store.pincode
      ),
    })
  } catch (error: any) {
    console.error('Get onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get onboarding status' },
      { status: 500 }
    )
  }
}
