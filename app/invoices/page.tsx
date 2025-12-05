'use client'

import { Search, Settings, Plus, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const invoices = [
    {
      id: 'ORDER FORM0046',
      amount: 5600.00,
      balance: 0.00,
      createDate: '11-Nov-2025',
      customerName: 'Desh Deepak Misra',
      status: 'Paid',
      source: 'Online',
    },
    {
      id: 'ORDER FORM0045',
      amount: 5430.00,
      balance: 0.00,
      createDate: '06-Nov-2025',
      customerName: 'Raksha Director',
      status: 'Paid',
      source: 'Online',
    },
    {
      id: 'ORDER FORM0044',
      amount: 51713.00,
      balance: 0.00,
      createDate: '02-Nov-2025',
      customerName: 'Pankaj',
      status: 'Paid',
      source: 'Online',
    },
    {
      id: 'ORDER FORM0043',
      amount: 8273.00,
      balance: 0.00,
      createDate: '31-Oct-2025',
      customerName: 'Anand Das',
      status: 'Paid',
      source: 'Online',
    },
    {
      id: 'ORDER FORM0042',
      amount: 11200.00,
      balance: 11200.00,
      createDate: '09-Oct-2025',
      customerName: 'Ayush',
      status: 'Unpaid',
      source: 'Online',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
            <Settings className="w-4 h-4" />
            Manage Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Invoice Number, Customer Name, Mobile"
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
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Create Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{invoice.id}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Online</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{invoice.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{invoice.balance.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.createDate}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{invoice.customerName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${invoice.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-gray-800">{invoice.status}</span>
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
      </div>
    </div>
  )
}



