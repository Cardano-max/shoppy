'use client'

import { Info } from 'lucide-react'
import { useState } from 'react'

export default function Reports() {
  const [reportType, setReportType] = useState('Order Report')
  const [columns, setColumns] = useState('All Columns')
  const [duration, setDuration] = useState('Today [26/11/2025]')
  const [format, setFormat] = useState('Comma-separated values (.csv)')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Report</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Order Report</option>
              <option>Sales Report</option>
              <option>Customer Report</option>
              <option>Product Report</option>
            </select>
            <div className="flex items-start gap-2 mt-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-600">
                This report provides Order Details e.g. Order Info, Customer Info, Charges, Delivery Address, UTM Tags and Checkout Information etc.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
            <select
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Columns</option>
              <option>Selected Columns</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Today [26/11/2025]</option>
              <option>Yesterday</option>
              <option>Last Week</option>
              <option>Last Month</option>
              <option>Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Comma-separated values (.csv)</option>
              <option>Excel (.xlsx)</option>
              <option>PDF (.pdf)</option>
            </select>
          </div>

          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}



