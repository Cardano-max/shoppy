'use client'

import { Store, Globe, Package, ShoppingCart, Truck, CreditCard, FileText, RotateCcw, Tag, Search, Bell, LogIn, ExternalLink, FileCode } from 'lucide-react'
import { useState } from 'react'

export default function StoreSettings() {
  const [activeSection, setActiveSection] = useState('Store Details')
  const [storeName, setStoreName] = useState('KIWI PARTY')
  const [category, setCategory] = useState('Gift Shop')
  const [phone, setPhone] = useState('9714823492')
  const [email, setEmail] = useState('kiwipartydecorations@gmail.com')

  const settingsSections = [
    { id: 'Store Details', icon: Store },
    { id: 'Store Domain', icon: Globe },
    { id: 'Products Settings', icon: Package },
    { id: 'Checkout Settings', icon: ShoppingCart },
    { id: 'Delivery Settings', icon: Truck },
    { id: 'Payment Settings', icon: CreditCard },
    { id: 'Order Settings', icon: FileText },
    { id: 'Return Order Settings', icon: RotateCcw },
    { id: 'Label Settings', icon: Tag },
    { id: 'SEO Settings', icon: Search },
    { id: 'Notifications Settings', icon: Bell },
    { id: 'Login Settings', icon: LogIn },
    { id: 'URL Redirects', icon: ExternalLink },
    { id: 'Robots TXT', icon: FileCode },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Store Settings</h1>

      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{section.id}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
          {activeSection === 'Store Details' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Store Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">KP</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">JPG/PNG Image (Minimum Height: 256 px)</p>
                  <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">KP</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">PNG Image Only (512x512 px)</p>
                  <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Gift Shop</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home & Living</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will not be displayed on the website</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will not be displayed on the website</p>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'Store Details' && (
            <div className="text-center py-12">
              <p className="text-gray-600">{activeSection} settings coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



