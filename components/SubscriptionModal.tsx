"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Star, Check, CreditCard, Lock } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  username: string
  price: number
  onSubscribe: () => void
}

export default function SubscriptionModal({ isOpen, onClose, username, price, onSubscribe }: SubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onSubscribe()
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">Subscribe to @{username}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Subscription Benefits */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Premium Content Access</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Access to all videos and content</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Early access to new uploads</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Exclusive behind-the-scenes content</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Direct interaction with creator</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">${price.toFixed(2)}</div>
            <div className="text-slate-400 text-sm">per month</div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12 mb-4"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Subscribe Now</span>
            </div>
          )}
        </Button>

        {/* Security Note */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <Lock className="w-3 h-3" />
          <span>Secure payment powered by Stripe</span>
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center mt-4">
          By subscribing, you agree to our Terms of Service. Cancel anytime in your account settings.
        </p>
      </div>
    </div>
  )
}
