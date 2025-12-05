'use client'

import { Bell, User, ExternalLink, Store } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Store className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-800">Happy Poppers</span>
        <ExternalLink className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  )
}



