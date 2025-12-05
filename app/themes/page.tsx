'use client'

import { Eye, Check } from 'lucide-react'

export default function Themes() {
  const themes = [
    {
      id: 1,
      name: 'Fashion',
      description: 'Beautiful and Elegant theme for Fashion and Beauty Stores.',
      active: true,
      preview: '👗',
    },
    {
      id: 2,
      name: 'Classic',
      description: 'Classic theme to build Beautiful Store for your business.',
      preview: '🎄',
    },
    {
      id: 3,
      name: 'Cosmetics - Beauty',
      description: 'Bloomix theme - a perfect fit for cosmetics stores.',
      preview: '💄',
    },
    {
      id: 4,
      name: 'Nestly - Home Decor',
      description: 'Nestly theme - a perfect fit for home décor and living stores.',
      preview: '🏠',
    },
    {
      id: 5,
      name: 'Walchao',
      description: 'Modern theme for fashion and lifestyle stores.',
      preview: '👔',
    },
    {
      id: 6,
      name: 'Organic Fresh Foods',
      description: 'Organic Fresh Foods for your health.',
      preview: '🥗',
    },
    {
      id: 7,
      name: 'Stylish Bags on Go',
      description: 'Stylish Bags on Go.',
      preview: '👜',
    },
    {
      id: 8,
      name: 'Watch Store',
      description: 'Elegant theme for watch and accessories stores.',
      preview: '⌚',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Themes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
            {theme.active && (
              <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                {theme.preview}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{theme.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



