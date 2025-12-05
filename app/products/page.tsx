'use client'

import { Search, Plus, Settings, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    {
      id: 1,
      name: 'Premium Happy Birthday Decoration Combo Set - Black & Silver Luxury Theme (38 PCS Set)',
      sku: 'SKU-1431',
      category: 'Birthday Decorations Kit',
      salePrice: 110.00,
      mrp: 120.00,
      quantity: 1000,
      image: '📦',
    },
    {
      id: 2,
      name: 'Frozen Theme Happy Birthday Decoration Combo Set - Blue & Silver (41 PCS Set)',
      sku: 'SKU-1430',
      category: 'Birthday Decorations Kit',
      salePrice: 110.00,
      mrp: 120.00,
      quantity: 1000,
      image: '📦',
    },
    {
      id: 3,
      name: 'Happy Birthday Decoration Combo Set - Blush Pink & Rose Gold Theme (42 PCS Set)',
      sku: 'SKU-1429',
      category: 'Birthday Decorations Kit',
      salePrice: 110.00,
      mrp: 120.00,
      quantity: 1000,
      image: '📦',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Bulk Actions
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Product Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Category</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Status</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Stock</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Payment Mode</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Clear</button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sort By</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sale Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">MRP</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">₹{product.salePrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">₹{product.mrp.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{product.quantity}</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



