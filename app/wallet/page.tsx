'use client'

import { Wallet, Plus } from 'lucide-react'
import { useState } from 'react'

export default function WalletPage() {
  const [filter, setFilter] = useState('All Transactions')
  const [typeFilter, setTypeFilter] = useState('All')

  const transactions = [
    {
      id: '#8421269',
      date: '25 Nov 25, 10:12 AM',
      description: '{"Body":"<#> 9238 Is The OTP For Your KIWI PARTY App. Use This One Time Password To Validate Your Login Details. - Happy Shopping","Mobile":"9352995252"}',
      type: 'Debit',
      amount: -0.3,
      credits: -1,
      balance: 9685,
    },
    {
      id: '#8415335',
      date: '25 Nov 25, 04:07 AM',
      description: '{"Body":"<#> 2082 Is The OTP For Your KIWI PARTY App. Use This One Time Password To Validate Your',
      type: 'Debit',
      amount: -0.3,
      credits: -1,
      balance: 9686,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Shoopy Wallet</h1>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Credit Balance</p>
              <p className="text-2xl font-bold text-gray-800">9685 Credits</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Buy Credits
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-600">
            Note: ₹1 = 3 Credits. Min recharge amount ₹50
          </p>
          <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
            <span>ℹ️</span>
            <span className="hover:underline cursor-pointer">Know more about credits</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>

        <div className="flex items-center gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Transactions</option>
            <option>Credits</option>
            <option>Debits</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>OTP</option>
            <option>Recharge</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount (₹)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{transaction.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">{transaction.description}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.type === 'Debit' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{transaction.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{transaction.credits}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span className="text-sm text-gray-800">{transaction.balance}</span>
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



