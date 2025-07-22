"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, Lock, Star, Check } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

// Mock subscription data
const mockSubscriptions: Record<string, { price: number; currency: string }> = {
  blenderfoundation: { price: 12.99, currency: "USD" },
  google: { price: 19.99, currency: "USD" },
}

export default function SubscribePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  })

  const subscription = mockSubscriptions[username]

  if (!subscription) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pb-16">
        <div className="text-center p-4">
          <h1 className="text-xl font-bold mb-2">Subscription not found</h1>
          <p className="text-slate-400 mb-4 text-sm">This user doesn't have subscriptions enabled.</p>
          <Button onClick={() => router.back()} size="sm">
            Go Back
          </Button>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  const handlePayment = async () => {
    setStep("processing")
    // Simulate payment processing
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        router.push(`/profile/${username}`)
      }, 2000)
    }, 3000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Subscribe to @{username}</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto">
          {step === "details" && (
            <div className="space-y-6">
              {/* Subscription Details */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-bold text-lg">Premium Access</span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">${subscription.price}</div>
                  <div className="text-slate-300">per month</div>
                </div>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Access to all videos and exclusive content</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Early access to new uploads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Behind-the-scenes content</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Direct messaging with creator</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>

              {/* Continue Button */}
              <Button
                onClick={() => setStep("payment")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12"
              >
                Continue to Payment
              </Button>

              {/* Terms */}
              <p className="text-xs text-slate-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription at
                any time.
              </p>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              {/* Payment Form */}
              <div className="bg-slate-900 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <Input
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-800 border-slate-700 text-white h-12"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <Input
                        value={paymentData.expiryDate}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })
                        }
                        placeholder="MM/YY"
                        className="bg-slate-800 border-slate-700 text-white h-12"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "") })}
                        placeholder="123"
                        className="bg-slate-800 border-slate-700 text-white h-12"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <Input
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-900 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Monthly Subscription</span>
                  <span>${subscription.price}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg border-t border-slate-700 pt-2">
                  <span>Total</span>
                  <span>${subscription.price}/month</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${subscription.price}/month
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6 py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
                <p className="text-slate-400">Please wait while we process your subscription...</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-12">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to the Community!</h2>
                <p className="text-slate-400 mb-4">
                  Your subscription to @{username} is now active. You now have access to all premium content.
                </p>
                <p className="text-sm text-slate-500">Redirecting to profile...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
