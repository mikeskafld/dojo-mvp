"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Shield, Eye, Lock, UserX, AlertTriangle } from "lucide-react"
import { useState } from "react"
import BottomNavigation from "@/components/BottomNavigation"

export default function PrivacySafetyPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    privateAccount: false,
    allowComments: true,
    allowDuets: true,
    allowDownloads: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    filterComments: true,
    blockOffensiveWords: true,
  })

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
          <h1 className="text-lg font-bold">Privacy & Safety</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Privacy */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-4 h-4" />
            <h2 className="text-base font-semibold">Account Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Private Account</span>
                <p className="text-xs text-slate-400">Only approved followers can see your videos</p>
              </div>
              <Switch
                checked={settings.privateAccount}
                onCheckedChange={(checked) => setSettings({ ...settings, privateAccount: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Show Online Status</span>
                <p className="text-xs text-slate-400">Let others see when you're active</p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => setSettings({ ...settings, showOnlineStatus: checked })}
              />
            </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-4 h-4" />
            <h2 className="text-base font-semibold">Interactions</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Allow Comments</span>
                <p className="text-xs text-slate-400">Let others comment on your videos</p>
              </div>
              <Switch
                checked={settings.allowComments}
                onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Allow Duets</span>
                <p className="text-xs text-slate-400">Let others create duets with your videos</p>
              </div>
              <Switch
                checked={settings.allowDuets}
                onCheckedChange={(checked) => setSettings({ ...settings, allowDuets: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Allow Downloads</span>
                <p className="text-xs text-slate-400">Let others download your videos</p>
              </div>
              <Switch
                checked={settings.allowDownloads}
                onCheckedChange={(checked) => setSettings({ ...settings, allowDownloads: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Allow Direct Messages</span>
                <p className="text-xs text-slate-400">Let others send you direct messages</p>
              </div>
              <Switch
                checked={settings.allowDirectMessages}
                onCheckedChange={(checked) => setSettings({ ...settings, allowDirectMessages: checked })}
              />
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-4 h-4" />
            <h2 className="text-base font-semibold">Safety</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Filter Comments</span>
                <p className="text-xs text-slate-400">Hide potentially offensive comments</p>
              </div>
              <Switch
                checked={settings.filterComments}
                onCheckedChange={(checked) => setSettings({ ...settings, filterComments: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Block Offensive Words</span>
                <p className="text-xs text-slate-400">Automatically block comments with offensive language</p>
              </div>
              <Switch
                checked={settings.blockOffensiveWords}
                onCheckedChange={(checked) => setSettings({ ...settings, blockOffensiveWords: checked })}
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-left h-12">
            <UserX className="w-4 h-4 mr-3" />
            Blocked Accounts
          </Button>

          <Button variant="ghost" className="w-full justify-start text-left h-12">
            <AlertTriangle className="w-4 h-4 mr-3" />
            Report a Problem
          </Button>
        </div>

        {/* Save Button */}
        <Button className="w-full bg-white text-black hover:bg-white/90 h-10">Save Changes</Button>

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
