"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, AlertTriangle } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

export default function SignOutPage() {
  const router = useRouter()

  const handleBackToSettings = () => {
    router.push("/settings")
  }

  const handleSignOut = () => {
    // Here you would typically handle the sign out logic
    // For now, we'll just redirect to a sign-in page or home
    console.log("Signing out...")
    // router.push("/signin")
    alert("Sign out functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center">
          <button onClick={handleBackToSettings} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Sign Out</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* Warning Card */}
          <div className="bg-slate-900 rounded-lg p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Sign Out?</h2>
              <p className="text-slate-400 text-sm">
                Are you sure you want to sign out of your account? You'll need to sign back in to access your profile
                and videos.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 text-white h-10">
                <LogOut className="w-4 h-4 mr-2" />
                Yes, Sign Out
              </Button>

              <Button
                onClick={handleBackToSettings}
                variant="outline"
                className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 h-10"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">Your data will remain safe and you can sign back in anytime.</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
