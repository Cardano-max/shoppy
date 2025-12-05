'use client'

import { Search, Plus, Wallet, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('')

  const customers = [
    {
      id: 1,
      name: 'Dharmendra Rawal',
      phone: '9352995252',
      type: 'Consumer',
      walletPoints: 0,
      advance: '--',
      due: '--',
      utmId: '--',
    },
    {
      id: 2,
      name: 'Sujeeth Kamble',
      phone: '8639621037',
      type: 'Consumer',
      walletPoints: 0,
      advance: '--',
      due: '--',
      utmId: '--',
    },
    {
      id: 3,
      name: 'Satya Niranjan Sahu',
      phone: '9124485505',
      type: 'Retailer',
      walletPoints: 0,
      advance: '--',
      due: '--',
      utmId: '--',
    },
    {
      id: 4,
      name: 'Sai Decoration Party',
      phone: '9369169993',
      type: 'Consumer',
      walletPoints: 0,
      advance: '--',
      due: '--',
      utmId: '--',
    },
    {
      id: 5,
      name: 'Rakesh',
      phone: '9867385517',
      type: 'Consumer',
      walletPoints: 0,
      advance: '--',
      due: '--',
      utmId: '--',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
            <Wallet className="w-4 h-4" />
            Wallet Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or phone number or affiliate id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All</option>
            <option>Consumer</option>
            <option>Retailer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wallet Points</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Advance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">UTM Id</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{customer.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{customer.walletPoints}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.advance}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.due}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.utmId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Given ?</span>
                      <button className="text-green-600 hover:text-green-700">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
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



