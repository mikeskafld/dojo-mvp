"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail, Phone, ExternalLink } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

export default function HelpSupportPage() {
  const router = useRouter()

  const handleBackToSettings = () => {
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center">
          <button onClick={handleBackToSettings} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Help & Support</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Help */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-4 h-4" />
            <h2 className="text-base font-semibold">Quick Help</h2>
          </div>

          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <Book className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Getting Started Guide</div>
                <div className="text-xs text-slate-400">Learn the basics of using Dojo</div>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <MessageCircle className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Community Guidelines</div>
                <div className="text-xs text-slate-400">Understand our community standards</div>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <ExternalLink className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">FAQ</div>
                <div className="text-xs text-slate-400">Find answers to common questions</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-4 h-4" />
            <h2 className="text-base font-semibold">Contact Support</h2>
          </div>

          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <Mail className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Email Support</div>
                <div className="text-xs text-slate-400">support@dojo.com</div>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <MessageCircle className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Live Chat</div>
                <div className="text-xs text-slate-400">Chat with our support team</div>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <Phone className="w-4 h-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Phone Support</div>
                <div className="text-xs text-slate-400">1-800-DOJO-HELP</div>
              </div>
            </Button>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-base font-semibold mb-4">App Information</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Build</span>
              <span>2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform</span>
              <span>Web</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-base font-semibold mb-4">Feedback</h2>

          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <MessageCircle className="w-4 h-4 mr-3" />
              Send Feedback
            </Button>

            <Button variant="ghost" className="w-full justify-start text-left h-12">
              <ExternalLink className="w-4 h-4 mr-3" />
              Rate the App
            </Button>
          </div>
        </div>

        {/* Back to Settings */}
        <Button
          onClick={handleBackToSettings}
          variant="outline"
          className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 h-10"
        >
          Back to Settings
        </Button>
      </div>

      <BottomNavigation />
    </div>
  )
}
