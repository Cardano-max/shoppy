'use client'

import { Plus, Settings, MoreVertical } from 'lucide-react'

export default function Banners() {
  const banners = [
    {
      id: 1,
      position: 1,
      enabled: false,
      image: '🎨',
    },
    {
      id: 2,
      position: 2,
      enabled: true,
      image: '🎉',
      title: 'Kiwi Darku decoration',
      subtitle: 'Starting From 100/',
    },
    {
      id: 3,
      position: 3,
      enabled: true,
      image: '🎊',
      title: 'DECORATION NET',
      subtitle: 'PREMIUM CARD PACK',
      price: 'RS 40 ONLY',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Banners</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">{banner.position}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-6xl">
              {banner.image}
            </div>
            {banner.title && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                {banner.subtitle && <p className="text-sm text-gray-600">{banner.subtitle}</p>}
                {banner.price && <p className="text-sm font-semibold text-yellow-600">{banner.price}</p>}
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={banner.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm text-gray-700">
                  {banner.enabled ? 'Enabled' : 'Disabled'}
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



