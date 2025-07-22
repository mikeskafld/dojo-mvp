"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Plus, User } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/feed" && (pathname === "/" || pathname === "/feed")) return true
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-slate-800">
      <div className="flex items-center justify-around py-1">
        <Link href="/feed" className="flex flex-col items-center py-1 px-3">
          <Home className={`w-5 h-5 ${isActive("/feed") ? "text-white" : "text-slate-400"}`} />
          <span className={`text-xs mt-0.5 ${isActive("/feed") ? "text-white" : "text-slate-400"}`}>Feed</span>
        </Link>

        <Link href="/browse" className="flex flex-col items-center py-1 px-3">
          <Search className={`w-5 h-5 ${isActive("/browse") ? "text-white" : "text-slate-400"}`} />
          <span className={`text-xs mt-0.5 ${isActive("/browse") ? "text-white" : "text-slate-400"}`}>Browse</span>
        </Link>

        <Link href="/upload" className="flex flex-col items-center py-1 px-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isActive("/upload") ? "bg-white" : "bg-slate-700"
            }`}
          >
            <Plus className={`w-4 h-4 ${isActive("/upload") ? "text-black" : "text-white"}`} />
          </div>
          <span className={`text-xs mt-0.5 ${isActive("/upload") ? "text-white" : "text-slate-400"}`}>Post</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center py-1 px-3">
          <User className={`w-5 h-5 ${isActive("/profile") ? "text-white" : "text-slate-400"}`} />
          <span className={`text-xs mt-0.5 ${isActive("/profile") ? "text-white" : "text-slate-400"}`}>Profile</span>
        </Link>
      </div>
    </div>
  )
}
