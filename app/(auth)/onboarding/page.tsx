'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Store,
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react'

type OnboardingStep = 1 | 2 | 3 | 4 | 5

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data for each step
  const [storeData, setStoreData] = useState({
    description: '',
    category: 'fashion',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  })

  const [businessData, setBusinessData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
  })

  const [paymentData, setPaymentData] = useState({
    enableCOD: true,
    enableUPI: false,
    upiId: '',
    enableCards: false,
  })

  const [productsData, setProductsData] = useState({
    skipProducts: false,
    productCount: '0',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as OnboardingStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      const onboardingData = {
        storeData,
        businessData,
        paymentData,
        productsData,
        completed: true,
      }

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to complete onboarding')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">
              Step {currentStep} of 5
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}% Complete
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {[
            { num: 1, label: 'Welcome', icon: Store },
            { num: 2, label: 'Business Info', icon: MapPin },
            { num: 3, label: 'Payments', icon: CreditCard },
            { num: 4, label: 'Products', icon: Package },
            { num: 5, label: 'Complete', icon: CheckCircle2 },
          ].map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.num
            const isCompleted = currentStep > step.num

            return (
              <div key={step.num} className="flex flex-col items-center min-w-[80px]">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`text-xs font-medium text-center ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Shoppy!
                </h2>
                <p className="text-gray-600">
                  Let's set up your store in just a few minutes
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Tell customers what makes your store special..."
                  value={storeData.description}
                  onChange={(e) =>
                    setStoreData({ ...storeData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Category
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={storeData.category}
                  onChange={(e) =>
                    setStoreData({ ...storeData, category: e.target.value })
                  }
                >
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="electronics">Electronics</option>
                  <option value="food">Food & Beverage</option>
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="home">Home & Furniture</option>
                  <option value="sports">Sports & Fitness</option>
                  <option value="books">Books & Media</option>
                  <option value="toys">Toys & Games</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={storeData.currency}
                    onChange={(e) =>
                      setStoreData({ ...storeData, currency: e.target.value })
                    }
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={storeData.timezone}
                    onChange={(e) =>
                      setStoreData({ ...storeData, timezone: e.target.value })
                    }
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Business Information
                </h2>
                <p className="text-gray-600">
                  Add your business details for invoices and shipping
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Street address, building, floor..."
                  value={businessData.address}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, address: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mumbai"
                    value={businessData.city}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, city: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Maharashtra"
                    value={businessData.state}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, state: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="400001"
                    value={businessData.pincode}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, pincode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="22AAAAA0000A1Z5"
                    value={businessData.gstNumber}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        gstNumber: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="AAAAA0000A"
                    value={businessData.panNumber}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        panNumber: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> GST and PAN details are optional but recommended
                  for generating compliant invoices.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment Methods */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Methods
                </h2>
                <p className="text-gray-600">
                  Choose how you want to accept payments
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    checked={paymentData.enableCOD}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, enableCOD: e.target.checked })
                    }
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-600">
                      Accept cash payments when orders are delivered
                    </div>
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    checked={paymentData.enableUPI}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, enableUPI: e.target.checked })
                    }
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900">UPI Payments</div>
                    <div className="text-sm text-gray-600 mb-2">
                      Accept payments via PhonePe, Google Pay, Paytm
                    </div>
                    {paymentData.enableUPI && (
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="yourname@paytm"
                        value={paymentData.upiId}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, upiId: e.target.value })
                        }
                      />
                    )}
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    checked={paymentData.enableCards}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, enableCards: e.target.checked })
                    }
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900">
                      Credit/Debit Cards & Net Banking
                    </div>
                    <div className="text-sm text-gray-600">
                      Integrate Razorpay or Stripe (can be set up later in settings)
                    </div>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> You can always add or modify payment methods later
                  from Settings.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Products */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Add Your Products
                </h2>
                <p className="text-gray-600">
                  Start adding products to your store
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Add Products?
                </h3>
                <p className="text-gray-600 mb-4">
                  You can add products now or skip and do it later from your dashboard.
                </p>

                <div className="space-y-3">
                  <label className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      checked={productsData.skipProducts}
                      onChange={(e) =>
                        setProductsData({
                          ...productsData,
                          skipProducts: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I'll add products later from the dashboard
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">Unlimited</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">Unlimited</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Unlimited</div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  All Set!
                </h2>
                <p className="text-gray-600">
                  Your store is ready to start selling
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Add Your Products</div>
                      <div className="text-sm text-gray-600">
                        Start building your product catalog
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Customize Your Store</div>
                      <div className="text-sm text-gray-600">
                        Set up your storefront theme and branding
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Share Your Store</div>
                      <div className="text-sm text-gray-600">
                        Get your store link and start sharing with customers
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Track Orders</div>
                      <div className="text-sm text-gray-600">
                        Manage orders and fulfill them from your dashboard
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
