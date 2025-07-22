"use client"

import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

interface UnfollowWarningModalProps {
  isOpen: boolean
  onClose: () => void
  username: string
  onConfirm: () => void
}

export default function UnfollowWarningModal({ isOpen, onClose, username, onConfirm }: UnfollowWarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-white text-xl font-bold">Unfollow @{username}?</h3>
          <p className="text-slate-400 text-sm">
            This creator requires a subscription to view their content. If you unfollow, you will lose access to their
            premium videos and will need to re-subscribe to view them again.
          </p>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10">
            Yes, Unfollow
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 h-10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
