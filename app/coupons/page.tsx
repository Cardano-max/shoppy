'use client'

import { Search, Plus, Share2, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Coupons() {
  const [searchQuery, setSearchQuery] = useState('')

  const coupons = [
    {
      id: 1,
      code: 'DISCOUNT 10%',
      value: '10%',
      maxDiscount: '-',
      orderAmount: '₹25000',
      perCustomer: 0,
      source: '-',
      autoApply: true,
      expiry: 'No Expiry',
      active: true,
    },
    {
      id: 2,
      code: 'DISCOUNT 8%',
      value: '8%',
      maxDiscount: '-',
      orderAmount: '₹20000',
      perCustomer: 0,
      source: '-',
      autoApply: true,
      expiry: 'No Expiry',
      active: true,
    },
    {
      id: 3,
      code: 'DISCOUNT 6%',
      value: '6%',
      maxDiscount: '-',
      orderAmount: '₹15000',
      perCustomer: 0,
      source: '-',
      autoApply: true,
      expiry: 'No Expiry',
      active: true,
    },
    {
      id: 4,
      code: 'DISCOUNT 3%',
      value: '3%',
      maxDiscount: '-',
      orderAmount: '₹10000',
      perCustomer: 0,
      source: '-',
      autoApply: true,
      expiry: 'No Expiry',
      active: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Coupons</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coupon by code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Max Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Per Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Auto Apply</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Active</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Share</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{coupon.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{coupon.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coupon.maxDiscount}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{coupon.orderAmount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coupon.perCustomer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coupon.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coupon.autoApply ? 'YES' : 'NO'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coupon.expiry}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={coupon.active} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>8 rows</option>
            <option>16 rows</option>
            <option>32 rows</option>
          </select>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Showing page 1 of 1 - 4 Items</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                Prev
              </button>
              <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



