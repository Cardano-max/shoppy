'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Loader2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

type AnalyticsData = {
  overview: {
    totalRevenue: number
    revenueChange: number
    totalOrders: number
    ordersChange: number
    averageOrderValue: number
    aovChange: number
    totalCustomers: number
    customersChange: number
  }
  salesByDay: {
    date: string
    revenue: number
    orders: number
  }[]
  topProducts: {
    id: string
    name: string
    sku: string
    revenue: number
    quantity: number
    orders: number
  }[]
  ordersByStatus: {
    status: string
    count: number
    percentage: number
  }[]
  recentOrders: {
    id: string
    orderNumber: string
    customerName: string
    amount: number
    status: string
    createdAt: string
  }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, router])

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchAnalytics()
    }
  }, [sessionStatus, dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/analytics?range=${dateRange}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')

      const data = await res.json()
      setAnalytics(data)
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const maxRevenue = Math.max(...analytics.salesByDay.map((d) => d.revenue), 1)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your store performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(analytics.overview.totalRevenue)}
          </div>
          <div className="flex items-center text-sm">
            {analytics.overview.revenueChange >= 0 ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">
                  +{analytics.overview.revenueChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">
                  {analytics.overview.revenueChange.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-gray-600 ml-1">vs previous period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {analytics.overview.totalOrders.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            {analytics.overview.ordersChange >= 0 ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">
                  +{analytics.overview.ordersChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">
                  {analytics.overview.ordersChange.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-gray-600 ml-1">vs previous period</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Avg Order Value</div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(analytics.overview.averageOrderValue)}
          </div>
          <div className="flex items-center text-sm">
            {analytics.overview.aovChange >= 0 ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">
                  +{analytics.overview.aovChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">
                  {analytics.overview.aovChange.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-gray-600 ml-1">vs previous period</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Customers</div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {analytics.overview.totalCustomers.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            {analytics.overview.customersChange >= 0 ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">
                  +{analytics.overview.customersChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">
                  {analytics.overview.customersChange.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-gray-600 ml-1">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {analytics.salesByDay.map((day) => (
              <div key={day.date} className="flex items-center gap-3">
                <div className="text-xs text-gray-600 w-16">
                  {formatDate(day.date)}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                  >
                    {day.revenue > maxRevenue * 0.3 && (
                      <span className="text-xs font-medium text-white">
                        {formatCurrency(day.revenue)}
                      </span>
                    )}
                  </div>
                </div>
                {day.revenue <= maxRevenue * 0.3 && (
                  <div className="text-xs font-medium text-gray-700 w-24 text-right">
                    {formatCurrency(day.revenue)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Orders by Status
          </h2>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((item, index) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      index === 0
                        ? 'bg-blue-600'
                        : index === 1
                        ? 'bg-green-600'
                        : index === 2
                        ? 'bg-yellow-600'
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.topProducts.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No product data yet</p>
            ) : (
              analytics.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-600">
                        {product.quantity} sold • {product.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.recentOrders.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No recent orders</p>
            ) : (
              analytics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => router.push('/orders')}
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-600">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
