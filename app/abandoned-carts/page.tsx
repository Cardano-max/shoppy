'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

export default function AbandonedCarts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All')

  const carts = [
    {
      id: 'CRT-13516190',
      createDate: '25-Nov-2025, 22:16',
      amount: 1700.00,
      customerName: '',
      customerMobile: '',
      approxCity: 'Navsari',
      approxPincode: '396445',
    },
    {
      id: 'CRT-13514653',
      createDate: '25-Nov-2025, 20:07',
      amount: 1900.00,
      customerName: '',
      customerMobile: '',
      approxCity: 'Delhi',
      approxPincode: '110001',
    },
    {
      id: 'CRT-13514468',
      createDate: '25-Nov-2025, 19:48',
      amount: 6000.00,
      customerName: '',
      customerMobile: '',
      approxCity: 'Panjim',
      approxPincode: '403110',
    },
    {
      id: 'CRT-13507302',
      createDate: '25-Nov-2025, 05:56',
      amount: 0.00,
      customerName: '',
      customerMobile: '',
      approxCity: 'Surat',
      approxPincode: '394210',
    },
    {
      id: 'CRT-13505785',
      createDate: '25-Nov-2025, 04:08',
      amount: 145810.00,
      customerName: 'AMIT MOHAN',
      customerMobile: '7507601271',
      approxCity: '',
      approxPincode: '',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Abandoned Carts</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Customer Name, Mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            {['Custom', 'All', 'Today', 'Yesterday', 'Last Week', 'Last Month'].map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  dateFilter === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cart #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Create Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Approx City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Approx Pincode</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{cart.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cart.createDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{cart.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cart.customerName || '--'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cart.customerMobile || '--'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cart.approxCity || '--'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cart.approxPincode || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



