'use client'

import { Search, Plus, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const estimates = [
    {
      id: 'EST-0001',
      amount: 150.00,
      balance: 150.00,
      createDate: '25-Nov-2024',
      customerName: 'Partg',
      status: 'Completed',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Estimates</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Estimate
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Estimate Number, Customer Name, Mobile"
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estimate #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Create Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{estimate.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{estimate.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{estimate.balance.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{estimate.createDate}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{estimate.customerName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm text-gray-800">{estimate.status}</span>
                    </div>
                  </td>
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

        <div className="flex items-center justify-between mt-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>8 rows</option>
            <option>16 rows</option>
            <option>32 rows</option>
          </select>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Showing page 1 of 1 - 1 Item</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                &lt; Prev
              </button>
              <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



