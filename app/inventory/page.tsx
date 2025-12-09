'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Plus,
  Minus,
  X,
  Edit,
  History,
  Download,
  Upload,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

type Product = {
  id: string
  name: string
  sku: string
  quantity: number
  salePrice: number
  status: string
  variants: ProductVariant[]
}

type ProductVariant = {
  id: string
  title: string
  sku: string
  stock: number
  price: number
  status: string
}

type InventoryAdjustment = {
  id: string
  quantity: number
  reason: string
  note: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  } | null
  variant: {
    id: string
    title: string | null
    sku: string
    product: {
      name: string
    }
  }
}

const adjustmentReasons = [
  { value: 'MANUAL', label: 'Manual Adjustment' },
  { value: 'RECEIVED', label: 'Stock Received' },
  { value: 'DAMAGED', label: 'Damaged/Lost' },
  { value: 'RETURNED', label: 'Customer Return' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'RECOUNT', label: 'Physical Recount' },
]

export default function InventoryPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all')
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [adjusting, setAdjusting] = useState(false)

  const [adjustmentForm, setAdjustmentForm] = useState({
    quantity: 0,
    reason: 'MANUAL',
    note: '',
  })

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 10

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, router])

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchInventory()
    }
  }, [sessionStatus])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/inventory')
      if (!res.ok) throw new Error('Failed to fetch inventory')

      const data = await res.json()
      setProducts(data.products || [])
    } catch (error: any) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdjustmentHistory = async () => {
    try {
      const res = await fetch('/api/inventory/adjustments')
      if (!res.ok) throw new Error('Failed to fetch adjustment history')

      const data = await res.json()
      setAdjustments(data.adjustments || [])
    } catch (error: any) {
      console.error('Error fetching adjustment history:', error)
    }
  }

  const handleAdjustInventory = async () => {
    if (!selectedVariant && !selectedProduct) return
    if (adjustmentForm.quantity === 0) {
      alert('Please enter a quantity')
      return
    }

    try {
      setAdjusting(true)
      const variantId = selectedVariant?.id || selectedProduct?.variants[0]?.id
      const productId = !variantId ? selectedProduct?.id : undefined

      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          productId,
          quantity: adjustmentForm.quantity,
          reason: adjustmentForm.reason,
          note: adjustmentForm.note || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to adjust inventory')
      }

      // Refresh inventory
      await fetchInventory()
      setShowAdjustModal(false)
      setSelectedProduct(null)
      setSelectedVariant(null)
      setAdjustmentForm({ quantity: 0, reason: 'MANUAL', note: '' })
    } catch (error: any) {
      console.error('Error adjusting inventory:', error)
      alert(error.message || 'Failed to adjust inventory')
    } finally {
      setAdjusting(false)
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: 'Out of Stock', color: 'text-red-700', bgColor: 'bg-red-100' }
    } else if (quantity <= LOW_STOCK_THRESHOLD) {
      return { label: 'Low Stock', color: 'text-yellow-700', bgColor: 'bg-yellow-100' }
    } else {
      return { label: 'In Stock', color: 'text-green-700', bgColor: 'bg-green-100' }
    }
  }

  const getFilteredProducts = () => {
    let filtered = products

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply stock filter
    if (filterType === 'low') {
      filtered = filtered.filter(
        (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD
      )
    } else if (filterType === 'out') {
      filtered = filtered.filter((p) => p.quantity === 0)
    }

    return filtered
  }

  const getInventoryStats = () => {
    const totalProducts = products.length
    const outOfStock = products.filter((p) => p.quantity === 0).length
    const lowStock = products.filter(
      (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD
    ).length
    const totalValue = products.reduce(
      (sum, p) => sum + p.quantity * p.salePrice,
      0
    )

    return { totalProducts, outOfStock, lowStock, totalValue }
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const filteredProducts = getFilteredProducts()
  const stats = getInventoryStats()

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your stock levels</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchAdjustmentHistory()
              setShowHistoryModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Products</div>
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Out of Stock</div>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.outOfStock}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Low Stock</div>
            <TrendingDown className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">{stats.lowStock}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Value</div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{stats.totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('low')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'low'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'out'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out of Stock
            </button>
          </div>
          <button
            onClick={fetchInventory}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Add products to start managing inventory'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total Value
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantity)

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.variants.length > 0 && (
                          <div className="text-xs text-gray-600">
                            {product.variants.length} variant
                            {product.variants.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-4 py-3">
                        <div className="text-right font-semibold text-gray-900">
                          {product.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}
                        >
                          {product.quantity === 0 ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : product.quantity <= LOW_STOCK_THRESHOLD ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ₹{product.salePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{(product.quantity * product.salePrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setSelectedVariant(null)
                              setShowAdjustModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Adjust Stock"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Inventory Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Adjust Inventory</h2>
              <button
                onClick={() => {
                  setShowAdjustModal(false)
                  setSelectedProduct(null)
                  setAdjustmentForm({ quantity: 0, reason: 'MANUAL', note: '' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="font-semibold text-gray-900">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600">SKU: {selectedProduct.sku}</div>
                <div className="text-sm text-gray-600">
                  Current Stock:{' '}
                  <span className="font-semibold">{selectedProduct.quantity}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        quantity: adjustmentForm.quantity - 1,
                      })
                    }
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustmentForm.quantity}
                    onChange={(e) =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        quantity: adjustmentForm.quantity + 1,
                      })
                    }
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  New Stock:{' '}
                  <span className="font-semibold">
                    {selectedProduct.quantity + adjustmentForm.quantity}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={adjustmentForm.reason}
                  onChange={(e) =>
                    setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {adjustmentReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={adjustmentForm.note}
                  onChange={(e) =>
                    setAdjustmentForm({ ...adjustmentForm, note: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a note about this adjustment..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAdjustModal(false)
                  setSelectedProduct(null)
                  setAdjustmentForm({ quantity: 0, reason: 'MANUAL', note: '' })
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustInventory}
                disabled={adjusting || adjustmentForm.quantity === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {adjusting ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    Adjusting...
                  </>
                ) : (
                  'Adjust Stock'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Inventory Adjustment History
              </h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {adjustments.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No adjustment history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adjustments.map((adjustment) => (
                    <div
                      key={adjustment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {adjustment.variant.product.name}
                            {adjustment.variant.title &&
                              ` - ${adjustment.variant.title}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            SKU: {adjustment.variant.sku}
                          </div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            adjustment.quantity > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {adjustment.quantity > 0 ? '+' : ''}
                          {adjustment.quantity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {adjustmentReasons.find(
                              (r) => r.value === adjustment.reason
                            )?.label || adjustment.reason}
                          </span>
                          {adjustment.note && (
                            <span className="text-gray-600">{adjustment.note}</span>
                          )}
                        </div>
                        <div className="text-gray-500">
                          {new Date(adjustment.createdAt).toLocaleString()}
                          {adjustment.user && ` • ${adjustment.user.name || adjustment.user.email}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
