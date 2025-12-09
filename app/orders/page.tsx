'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Calendar,
  Truck,
  X,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  ChevronDown,
} from 'lucide-react'

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'

type Order = {
  id: string
  orderNumber: string
  amount: number
  status: OrderStatus
  orderDate: string
  deliverBy: string | null
  customer: {
    name: string
    email: string
    phone: string | null
  } | null
  items: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
      sku: string
    }
  }[]
  shippingAddress: {
    line1: string
    line2: string | null
    city: string
    state: string
    postalCode: string
    country: string
  } | null
  statusHistory: {
    id: string
    oldStatus: string | null
    newStatus: string
    note: string | null
    createdAt: string
  }[]
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    icon: RefreshCw,
  },
  READY_TO_SHIP: {
    label: 'Ready to Ship',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: Package,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    icon: Truck,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    icon: MapPin,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  RETURNED: {
    label: 'Returned',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: RefreshCw,
  },
  REFUNDED: {
    label: 'Refunded',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: RefreshCw,
  },
}

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, router])

  // Fetch orders
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchOrders()
    }
  }, [sessionStatus, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const res = await fetch(`/api/orders?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch orders')

      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(true)
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      // Refresh orders and selected order
      await fetchOrders()
      if (selectedOrder) {
        const updatedOrderRes = await fetch(`/api/orders/${orderId}`)
        const updatedOrder = await updatedOrderRes.json()
        setSelectedOrder(updatedOrder.order)
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const workflow: Record<OrderStatus, OrderStatus | null> = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PROCESSING',
      PROCESSING: 'READY_TO_SHIP',
      READY_TO_SHIP: 'SHIPPED',
      SHIPPED: 'OUT_FOR_DELIVERY',
      OUT_FOR_DELIVERY: 'DELIVERED',
      DELIVERED: null,
      CANCELLED: null,
      RETURNED: 'REFUNDED',
      REFUNDED: null,
    }
    return workflow[currentStatus]
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = { ALL: orders.length }
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })
    return counts
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const statusCounts = getStatusCounts()
  const filteredOrders =
    statusFilter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all your orders</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon
          const count = statusCounts[status] || 0
          return (
            <div
              key={status}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setStatusFilter(status as OrderStatus)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <div className="text-sm text-gray-600">{config.label}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Orders ({statusCounts.ALL || 0})</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label} ({statusCounts[status] || 0})
              </option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first order to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon
                  const nextStatus = getNextStatus(order.status)

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderModal(true)
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.customer?.name || 'Guest'}
                          </div>
                          <div className="text-gray-600">{order.customer?.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          ₹{order.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusConfig[order.status].bgColor
                          } ${statusConfig[order.status].color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3">
                        {nextStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusUpdate(order.id, nextStatus)
                            }}
                            disabled={updatingStatus}
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            {statusConfig[nextStatus].label}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOrderModal(false)
                  setSelectedOrder(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Timeline
                </h3>
                <div className="space-y-4">
                  {selectedOrder.statusHistory
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((history, index) => {
                      const StatusIcon =
                        statusConfig[history.newStatus as OrderStatus]?.icon || Clock
                      const config =
                        statusConfig[history.newStatus as OrderStatus] || {}

                      return (
                        <div key={history.id} className="flex items-start gap-3">
                          <div
                            className={`mt-1 p-2 rounded-full ${config.bgColor || 'bg-gray-100'}`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 ${config.color || 'text-gray-600'}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">
                                {config.label || history.newStatus}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(history.createdAt).toLocaleString()}
                              </div>
                            </div>
                            {history.note && (
                              <div className="text-sm text-gray-600 mt-1">
                                {history.note}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Customer Details */}
              {selectedOrder.customer && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">
                        {selectedOrder.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">
                        {selectedOrder.customer.email}
                      </span>
                    </div>
                    {selectedOrder.customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">
                          {selectedOrder.customer.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                      <div className="text-gray-900">
                        <div>{selectedOrder.shippingAddress.line1}</div>
                        {selectedOrder.shippingAddress.line2 && (
                          <div>{selectedOrder.shippingAddress.line2}</div>
                        )}
                        <div>
                          {selectedOrder.shippingAddress.city},{' '}
                          {selectedOrder.shippingAddress.state} -{' '}
                          {selectedOrder.shippingAddress.postalCode}
                        </div>
                        <div>{selectedOrder.shippingAddress.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              SKU: {item.product.sku}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-gray-300 bg-gray-50">
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-right font-semibold text-gray-900"
                        >
                          Total
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 text-lg">
                          ₹{selectedOrder.amount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Update Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Order Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const Icon = config.icon
                    const isCurrentStatus = selectedOrder.status === status

                    return (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusUpdate(selectedOrder.id, status as OrderStatus)
                        }
                        disabled={isCurrentStatus || updatingStatus}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                          isCurrentStatus
                            ? `${config.bgColor} ${config.color} border-current`
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{config.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Order creation form will be implemented in the next phase.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For now, orders can be created via the API or by customers through the
                storefront.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
