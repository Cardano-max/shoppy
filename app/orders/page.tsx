'use client'

import { Search, Plus, Calendar, Truck } from 'lucide-react'
import { useState } from 'react'

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('All')

  const orders = [
    {
      id: 'ORD-0051',
      amount: 5600.00,
      orderDate: '11-Nov-2025',
      customerName: 'Desh Deepak Misra',
      deliverBy: '--',
      state: 'Confirmed',
      rtoRisk: 'Low',
      type: 'Delivery',
    },
    {
      id: 'ORD-0050',
      amount: 5430.00,
      orderDate: '06-Nov-2025',
      customerName: 'Raksha Director',
      deliverBy: '--',
      state: 'Confirmed',
      rtoRisk: '--',
      type: 'Delivery',
    },
    {
      id: 'ORD-0049',
      amount: 51713.00,
      orderDate: '02-Nov-2025',
      customerName: 'Pankaj',
      deliverBy: '--',
      state: 'Confirmed',
      rtoRisk: '--',
      type: 'Delivery',
    },
    {
      id: 'ORD-0048',
      amount: 8273.00,
      orderDate: '31-Oct-2025',
      customerName: 'Anand Das',
      deliverBy: '--',
      state: 'Confirmed',
      rtoRisk: '--',
      type: 'Delivery',
    },
  ]

  const tabs = ['All (49)', 'New', 'Confirmed', 'Shipment Ready', 'In Transit', 'Completed', 'Canceled', 'Return']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Order
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Order Number, Customer Name, Mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All</option>
          </select>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="dd/mm/yyyy - dd/mm/yyyy"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deliver By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">RTO Risk</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{order.id}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Delivery</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.orderDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.deliverBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span className="text-sm text-gray-800">{order.state}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.rtoRisk !== '--' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{order.rtoRisk}</span>
                    ) : (
                      <span className="text-sm text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      <Truck className="w-4 h-4" />
                      Dispatch
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



