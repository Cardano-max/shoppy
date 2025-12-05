'use client'

import { Plus, MoreVertical, Settings } from 'lucide-react'

export default function Collections() {
  const collections = [
    {
      id: 1,
      name: 'banner1',
      icon: '📄',
      products: 0,
      enabled: true,
    },
    {
      id: 2,
      name: 'Balloons',
      icon: '🎈',
      products: 14,
      enabled: true,
    },
    {
      id: 3,
      name: 'Stripe',
      icon: '📄',
      products: 0,
      enabled: true,
    },
    {
      id: 4,
      name: 'Our Best Seller',
      icon: '📊',
      products: 6,
      cols: '2 Cols, 5 Cols',
      enabled: true,
    },
    {
      id: 5,
      name: 'Products',
      icon: '🛍️',
      products: 0,
      enabled: true,
    },
    {
      id: 6,
      name: 'Contact Us',
      icon: '🛍️',
      products: 0,
      enabled: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Collections</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-lg border border-gray-200 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">{collection.id}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-4xl">
              {collection.icon}
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">{collection.name}</h3>
              <p className="text-sm text-gray-600">
                {collection.cols && <span>{collection.cols}, </span>}
                {collection.products} Products
              </p>
            </div>
            <div className="flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={collection.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm text-gray-700">
                  {collection.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



