"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"

interface Following {
  id: string
  username: string
  name: string
  avatar: string
  verified?: boolean
}

const mockFollowing: Following[] = [
  {
    id: "1",
    username: "blenderfoundation",
    name: "Blender Foundation",
    avatar: "/placeholder.svg?height=40&width=40&text=BF",
    verified: true,
  },
  {
    id: "2",
    username: "google",
    name: "Google",
    avatar: "/placeholder.svg?height=40&width=40&text=G",
    verified: true,
  },
]

export default function FollowingPage() {
  const router = useRouter()
  const [following, setFollowing] = useState(mockFollowing)
  const [searchQuery, setSearchQuery] = useState("")

  const handleUnfollow = (userId: string) => {
    setFollowing((prev) => prev.filter((user) => user.id !== userId))
  }

  const filteredFollowing = following.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center mb-3">
          <button onClick={() => router.back()} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Following ({following.length})</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search following..."
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-400 h-10 text-sm"
          />
        </div>
      </div>

      {/* Following List */}
      <div className="p-4">
        <div className="space-y-3">
          {filteredFollowing.map((user) => (
            <div key={user.id} className="bg-slate-900 hover:bg-slate-800 rounded-lg p-3 transition-colors">
              <div className="flex items-center justify-between">
                <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 flex-1">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{user.name}</span>
                      {user.verified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-slate-400 text-xs">@{user.username}</div>
                  </div>
                </Link>
                <Button
                  onClick={() => handleUnfollow(user.id)}
                  size="sm"
                  variant="outline"
                  className="bg-slate-700 text-white border-slate-600 hover:bg-red-600 hover:border-red-600 text-xs h-8 px-3"
                >
                  Unfollow
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredFollowing.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No following found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
