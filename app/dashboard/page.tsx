'use client'

import {
  ArrowUpRight,
  Copy,
  Phone,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ComponentType } from 'react'

const shareOptions: { label: string; icon: ComponentType<{ className?: string }>; color: string }[] = [
  { label: 'WhatsApp', icon: Phone, color: 'bg-emerald-500' },
  { label: 'Facebook', icon: Share2, color: 'bg-blue-600' },
  { label: 'X', icon: X, color: 'bg-slate-900' },
]

const healthStats = [
  { label: 'Payments', status: 'Operational', color: 'text-emerald-500', fill: '90%' },
  { label: 'Shipments', status: 'Syncing', color: 'text-amber-500', fill: '70%' },
  { label: 'Notifications', status: 'Operational', color: 'text-emerald-500', fill: '95%' },
]

const offerSuggestions = ['Print Bills', 'Launch Festival Banner', 'Push Flash Sale']

const todoList = [
  {
    title: 'Add coupon and grow sales',
    description: 'Create a new coupon and share it with your customers',
    due: 'Today',
  },
  {
    title: 'Update catalog images',
    description: 'Keep your store visuals fresh and on-brand',
    due: 'Tomorrow',
  },
  {
    title: 'Send abandoned cart reminders',
    description: 'Bring shoppers back to complete their purchase',
    due: 'This week',
  },
]

const sparklineData = [
  [32, 45, 38, 52, 48, 56, 42, 58],
  [25, 30, 28, 34, 32, 37, 31, 36],
  [40, 35, 38, 44, 42, 48, 40, 49],
]

const periodOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
]

interface DashboardStats {
  stats: {
    totalOrders: number
    totalSales: number
    lowStockProducts: number
    abandonedCarts: number
    totalCustomers: number
    totalProducts: number
  }
  recentOrders: any[]
  topProducts: any[]
  salesTrend: { date: string; sales: number }[]
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [selectedPeriod])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`)

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const insightCards = useMemo(
    () => [
      {
        label: 'Sales',
        value: loading ? '...' : `₹${dashboardData?.stats.totalSales.toLocaleString('en-IN') || 0}`,
        helper: 'vs last period',
        change: loading ? '...' : `${dashboardData?.stats.totalOrders || 0} orders`,
        icon: TrendingUp,
        gradient: 'from-sky-50 via-sky-100 to-sky-50 text-sky-600',
      },
      {
        label: 'Orders',
        value: loading ? '...' : String(dashboardData?.stats.totalOrders || 0),
        helper: 'pending fulfillment',
        change: loading ? '...' : `${dashboardData?.recentOrders?.length || 0} recent`,
        icon: ShoppingCart,
        gradient: 'from-emerald-50 via-emerald-100 to-emerald-50 text-emerald-600',
      },
      {
        label: 'Low Stock',
        value: loading ? '...' : String(dashboardData?.stats.lowStockProducts || 0),
        helper: 'items require restock',
        change: loading ? '...' : dashboardData?.stats.lowStockProducts === 0 ? 'healthy' : 'needs attention',
        icon: TrendingDown,
        gradient: 'from-amber-50 via-amber-100 to-amber-50 text-amber-600',
      },
      {
        label: 'Abandoned Carts',
        value: loading ? '...' : String(dashboardData?.stats.abandonedCarts || 0),
        helper: 'recover the lost revenue',
        change: loading ? '...' : 'this period',
        icon: X,
        gradient: 'from-rose-50 via-rose-100 to-rose-50 text-rose-600',
      },
    ],
    [dashboardData, loading]
  )

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-900">Failed to load dashboard</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => fetchDashboardStats()}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="glass-panel rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Welcome back</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="mt-2 max-w-xl text-slate-500">
                Keep track of your store performance, customer activity, and marketing workflows in a single glance.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg shadow-slate-900/20">
              <Sparkles className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {insightCards.map(({ label, value, helper, change, icon: Icon, gradient }) => (
              <div key={label} className={`rounded-2xl border border-white/60 bg-gradient-to-br ${gradient} p-4`}>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{label}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-white/80 p-3 shadow-inner">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{helper}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-700">{change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Referral</p>
                <h3 className="text-lg font-semibold text-slate-900">Refer & Earn</h3>
                <p className="text-sm text-slate-500">Refer friends and earn an extra month on your plan.</p>
              </div>
              <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-blue-500/30 hover:bg-blue-500">
                Refer Now
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Store Link</p>
                <h3 className="text-lg font-semibold text-slate-900">https://www.kiwiparty.in</h3>
                <p className="text-sm text-slate-500">Your storefront is securely connected.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Copy className="mr-2 inline h-4 w-4" />
                  Copy
                </button>
                <div className="flex flex-wrap gap-2">
                  {shareOptions.map(({ label, icon: Icon, color }) => (
                    <button key={label} className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-white ${color}`}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Store Insights</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Total Sales</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {loading ? '...' : `₹${dashboardData?.stats.totalSales.toLocaleString('en-IN') || 0}`}
              </p>
              <p className="mt-2 text-xs text-slate-500">{loading ? '...' : `From ${dashboardData?.stats.totalOrders || 0} orders`}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Customers</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '...' : dashboardData?.stats.totalCustomers || 0}</p>
              <p className="mt-2 text-xs text-slate-500">Total registered</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Products</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '...' : dashboardData?.stats.totalProducts || 0}</p>
              <p className="mt-2 text-xs text-slate-500">Active products</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">Store Health</h2>
          <p className="text-sm text-slate-500">All systems look good!</p>
          <div className="mt-6 space-y-4">
            {healthStats.map(({ label, status, color, fill }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className={`text-xs font-medium ${color}`}>{status}</p>
                </div>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${color.replace('text', 'bg')}`} style={{ width: fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">Promotional Offers</h2>
          <div className="mt-6 space-y-4">
            {offerSuggestions.map((suggestion, idx) => (
              <div key={suggestion} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/5 text-sm font-semibold text-slate-800">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{suggestion}</p>
                    <p className="text-sm text-slate-500">Recommended action</p>
                  </div>
                </div>
                <button className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">To-do List</h2>
          <div className="mt-6 space-y-4">
            {todoList.map((todo) => (
              <label key={todo.title} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                <div>
                  <p className="font-semibold text-slate-900">{todo.title}</p>
                  <p className="text-sm text-slate-500">{todo.description}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">Due: {todo.due}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
