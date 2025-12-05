'use client'

import { Plus, CreditCard, Check } from 'lucide-react'

export default function Purchases() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Purchase
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative mb-8">
          <div className="w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center relative">
            <CreditCard className="w-32 h-32 text-blue-500" />
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full opacity-50"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Start creating Purchases for your business</h2>
      </div>
    </div>
  )
}



