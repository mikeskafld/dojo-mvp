"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut, DollarSign } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: "John Doe",
    username: "johndoe",
    bio: "3D Artist & Animator | Creating amazing content daily ✨",
    email: "john@example.com",
  })
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    uploads: false,
  })
  const [subscription, setSubscription] = useState({
    enabled: false,
    price: 9.99,
    currency: "USD",
  })

  const handleBackToProfile = () => {
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center">
          <button onClick={handleBackToProfile} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Settings */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-4 h-4" />
            <h2 className="text-base font-semibold">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-sm h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="bg-slate-800 border-slate-700 text-sm h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="bg-slate-800 border-slate-700 text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-sm h-10"
                type="email"
              />
            </div>
          </div>
        </div>

        {/* Subscription Settings */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-4 h-4" />
            <h2 className="text-base font-semibold">Subscription</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Require subscription to follow</span>
                <p className="text-xs text-slate-400">Users must pay to see your content</p>
              </div>
              <Switch
                checked={subscription.enabled}
                onCheckedChange={(checked) => setSubscription({ ...subscription, enabled: checked })}
              />
            </div>

            {subscription.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Price</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.99"
                      max="999.99"
                      value={subscription.price}
                      onChange={(e) =>
                        setSubscription({ ...subscription, price: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="bg-slate-800 border-slate-700 text-sm h-10"
                    />
                    <span className="text-slate-400">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Minimum $0.99, maximum $999.99</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-300">
                    <strong>Note:</strong> When enabled, only subscribers can see your videos and profile content. Users
                    will be prompted to subscribe when they try to follow you.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-4 h-4" />
            <h2 className="text-base font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Likes on your videos</span>
              <Switch
                checked={notifications.likes}
                onCheckedChange={(checked) => setNotifications({ ...notifications, likes: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Comments on your videos</span>
              <Switch
                checked={notifications.comments}
                onCheckedChange={(checked) => setNotifications({ ...notifications, comments: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">New followers</span>
              <Switch
                checked={notifications.follows}
                onCheckedChange={(checked) => setNotifications({ ...notifications, follows: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Upload reminders</span>
              <Switch
                checked={notifications.uploads}
                onCheckedChange={(checked) => setNotifications({ ...notifications, uploads: checked })}
              />
            </div>
          </div>
        </div>

        {/* Other Options */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-left h-12" asChild>
            <a href="/privacy-safety">
              <Shield className="w-4 h-4 mr-3" />
              Privacy & Safety
            </a>
          </Button>

          <Button variant="ghost" className="w-full justify-start text-left h-12" asChild>
            <a href="/help-support">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </a>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left text-red-400 hover:text-red-300 h-12"
            asChild
          >
            <a href="/sign-out">
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </a>
          </Button>
        </div>

        {/* Save Button */}
        <Button className="w-full bg-white text-black hover:bg-white/90 h-10">Save Changes</Button>
      </div>

      <BottomNavigation />
    </div>
  )
}
