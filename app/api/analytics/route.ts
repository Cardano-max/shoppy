import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const { searchParams } = new URL(req.url)
      const range = searchParams.get('range') || '30d'

      // Calculate date ranges
      const now = new Date()
      let daysBack = 30
      if (range === '7d') daysBack = 7
      else if (range === '90d') daysBack = 90
      else if (range === '1y') daysBack = 365

      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      const previousStartDate = new Date(
        startDate.getTime() - daysBack * 24 * 60 * 60 * 1000
      )

      // Fetch orders for current period
      const orders = await prisma.order.findMany({
        where: {
          storeId: context.storeId,
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Fetch orders for previous period (for comparison)
      const previousOrders = await prisma.order.findMany({
        where: {
          storeId: context.storeId,
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      })

      // Calculate overview metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)
      const totalOrders = orders.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      const previousRevenue = previousOrders.reduce(
        (sum, order) => sum + order.amount,
        0
      )
      const previousOrderCount = previousOrders.length
      const previousAOV =
        previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0

      const revenueChange =
        previousRevenue > 0
          ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
          : 0
      const ordersChange =
        previousOrderCount > 0
          ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100
          : 0
      const aovChange =
        previousAOV > 0 ? ((averageOrderValue - previousAOV) / previousAOV) * 100 : 0

      // Get unique customers
      const uniqueCustomerIds = new Set(
        orders.filter((o) => o.customerId).map((o) => o.customerId)
      )
      const totalCustomers = uniqueCustomerIds.size

      const previousUniqueCustomerIds = new Set(
        previousOrders.filter((o) => o.customerId).map((o) => o.customerId)
      )
      const previousCustomerCount = previousUniqueCustomerIds.size

      const customersChange =
        previousCustomerCount > 0
          ? ((totalCustomers - previousCustomerCount) / previousCustomerCount) * 100
          : 0

      // Sales by day
      const salesByDay: { [key: string]: { revenue: number; orders: number } } = {}

      // Initialize all days with 0
      for (let i = 0; i < daysBack; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dateStr = date.toISOString().split('T')[0]
        salesByDay[dateStr] = { revenue: 0, orders: 0 }
      }

      // Populate with actual data
      orders.forEach((order) => {
        const dateStr = order.createdAt.toISOString().split('T')[0]
        if (salesByDay[dateStr]) {
          salesByDay[dateStr].revenue += order.amount
          salesByDay[dateStr].orders += 1
        }
      })

      const salesByDayArray = Object.entries(salesByDay)
        .map(([date, data]) => ({
          date,
          revenue: data.revenue,
          orders: data.orders,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-Math.min(daysBack, 30)) // Show last 30 days max for chart

      // Top products
      const productStats: {
        [key: string]: {
          id: string
          name: string
          sku: string
          revenue: number
          quantity: number
          orders: number
        }
      } = {}

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const key = item.productId
          if (!productStats[key]) {
            productStats[key] = {
              id: item.product.id,
              name: item.product.name,
              sku: item.product.sku,
              revenue: 0,
              quantity: 0,
              orders: 0,
            }
          }
          productStats[key].revenue += item.price * item.quantity
          productStats[key].quantity += item.quantity
          productStats[key].orders += 1
        })
      })

      const topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Orders by status
      const statusCounts: { [key: string]: number } = {}
      orders.forEach((order) => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      })

      const totalOrdersForPercentage = Math.max(orders.length, 1)
      const ordersByStatus = Object.entries(statusCounts)
        .map(([status, count]) => ({
          status,
          count,
          percentage: (count / totalOrdersForPercentage) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)

      // Recent orders
      const recentOrders = orders.slice(0, 5).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name || 'Guest',
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }))

      return NextResponse.json({
        overview: {
          totalRevenue,
          revenueChange,
          totalOrders,
          ordersChange,
          averageOrderValue,
          aovChange,
          totalCustomers,
          customersChange,
        },
        salesByDay: salesByDayArray,
        topProducts,
        ordersByStatus,
        recentOrders,
      })
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}
