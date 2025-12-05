'use client'

export default function ReferEarn() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Refer & Earn</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🎁</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refer & Earn Program</h2>
          <p className="text-gray-600 mb-6">
            Refer your friends and earn 1 month extension on your current plan for each successful referral!
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}



