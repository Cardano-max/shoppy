'use client'

import { Megaphone, Heading, Menu, Image, Grid3x3, Box, FileText, CreditCard, File, Palette, Code } from 'lucide-react'
import { useState } from 'react'

export default function DisplaySettings() {
  const [activeSection, setActiveSection] = useState('Announcement')
  const [announcementEnabled, setAnnouncementEnabled] = useState(false)

  const sections = [
    { id: 'Announcement', icon: Megaphone },
    { id: 'Header', icon: Heading },
    { id: 'Menu', icon: Menu },
    { id: 'Banner', icon: Image },
    { id: 'Categories', icon: Grid3x3 },
    { id: 'Products', icon: Box },
    { id: 'Footer', icon: FileText },
    { id: 'Product Card', icon: CreditCard },
    { id: 'Product Page', icon: File },
    { id: 'Color & Font', icon: Palette },
    { id: 'Custom CSS', icon: Code },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Display Settings</h1>

      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-2">
            {sections.map((section) => {
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
          {activeSection === 'Announcement' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Announcement</h2>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Enable Announcement Bar</h3>
                    <p className="text-sm text-gray-600">
                      Customize your announcement bar to grab attention and share updates effortlessly.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'Announcement' && (
            <div className="text-center py-12">
              <p className="text-gray-600">{activeSection} settings coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



