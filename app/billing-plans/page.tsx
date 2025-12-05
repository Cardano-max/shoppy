'use client'

import { Crown, Check } from 'lucide-react'

export default function BillingPlans() {
  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: '₹999',
      period: '/month',
      features: ['Up to 100 products', 'Basic support', '1 store'],
    },
    {
      id: 2,
      name: 'Professional',
      price: '₹2999',
      period: '/month',
      features: ['Unlimited products', 'Priority support', 'Multiple stores', 'Advanced analytics'],
      popular: true,
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Everything in Professional', 'Dedicated support', 'Custom integrations', 'White-label'],
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Billing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg border-2 p-6 relative ${
              plan.popular ? 'border-blue-600' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Popular</span>
              </div>
            )}
            <div className="text-center mb-6">
              {plan.id === 3 && <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full px-6 py-3 rounded-lg font-semibold ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {plan.id === 3 ? 'Contact Sales' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}



