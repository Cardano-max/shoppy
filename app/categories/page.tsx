'use client'

import { Plus, Edit, Trash2, Eye, GripVertical } from 'lucide-react'
import { useState } from 'react'

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: 'BIRTHDAY CROWN',
      icon: '👑',
      subcategories: 0,
      status: true,
    },
    {
      id: 2,
      name: 'Knife And Cake Accessories',
      icon: '🔪',
      subcategories: 0,
      status: true,
    },
    {
      id: 3,
      name: 'SFX',
      icon: '⚡',
      subcategories: 0,
      status: true,
    },
    {
      id: 4,
      name: 'Decorations Light',
      icon: '💡',
      subcategories: 0,
      status: true,
    },
    {
      id: 5,
      name: 'Latex Balloons',
      icon: '🎈',
      subcategories: 0,
      status: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Category</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <button className="text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.subcategories} Subcategories | View Products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={category.status} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



