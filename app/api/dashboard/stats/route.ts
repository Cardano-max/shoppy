import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiStoreAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authResult = await requireApiStoreAuth()
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { storeId } = authResult
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today' // today, week, month, year

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Fetch all stats in parallel
    const [
      totalOrders,
      totalSales,
      lowStockProducts,
      abandonedCarts,
      recentOrders,
      topProducts,
      totalCustomers,
      totalProducts,
    ] = await Promise.all([
      // Total orders in period
      prisma.order.count({
        where: {
          storeId,
          createdAt: { gte: startDate },
          status: { notIn: ['CANCELLED'] },
        },
      }),

      // Total sales in period
      prisma.order.aggregate({
        where: {
          storeId,
          createdAt: { gte: startDate },
          status: { in: ['CONFIRMED', 'SHIPMENT_READY', 'IN_TRANSIT', 'DELIVERED'] },
        },
        _sum: { total: true },
      }),

      // Low stock products (quantity < 10)
      prisma.product.count({
        where: {
          storeId,
          trackQuantity: true,
          quantity: { lt: 10 },
          status: 'ACTIVE',
        },
      }),

      // Abandoned carts
      prisma.abandonedCart.count({
        where: {
          storeId,
          createdAt: { gte: startDate },
        },
      }),

      // Recent orders
      prisma.order.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            storeId,
            createdAt: { gte: startDate },
            status: { notIn: ['CANCELLED'] },
          },
        },
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),

      // Total customers
      prisma.customer.count({
        where: { storeId },
      }),

      // Total products
      prisma.product.count({
        where: { storeId, status: 'ACTIVE' },
      }),
    ])

    // Fetch product details for top products
    const topProductIds = topProducts.map((p) => p.productId).filter((id): id is string => id !== null)
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, price: true },
    })

    const topProductsWithDetails = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId)
      return {
        productId: item.productId,
        name: product?.name || 'Unknown',
        price: product?.price || 0,
        quantitySold: item._sum.quantity || 0,
        orderCount: item._count.productId,
      }
    })

    // Calculate sales trend (last 7 days)
    const salesTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      const daySales = await prisma.order.aggregate({
        where: {
          storeId,
          createdAt: { gte: date, lt: nextDate },
          status: { in: ['CONFIRMED', 'SHIPMENT_READY', 'IN_TRANSIT', 'DELIVERED'] },
        },
        _sum: { total: true },
      })

      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: daySales._sum.total || 0,
      })
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        totalSales: totalSales._sum.total || 0,
        lowStockProducts,
        abandonedCarts,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      salesTrend,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', details: error?.message }, { status: 500 })
  }
}
