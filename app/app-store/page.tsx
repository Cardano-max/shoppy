'use client'

export default function AppStore() {
  const apps = [
    { id: 1, name: 'Payment Gateway', icon: '💳', description: 'Integrate payment gateways' },
    { id: 2, name: 'Shipping', icon: '🚚', description: 'Manage shipping options' },
    { id: 3, name: 'Analytics', icon: '📊', description: 'Track store performance' },
    { id: 4, name: 'Email Marketing', icon: '📧', description: 'Send marketing emails' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">App Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-5xl mb-4">{app.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{app.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{app.description}</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Install
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}



