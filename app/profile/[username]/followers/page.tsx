"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"

interface Follower {
  id: string
  username: string
  name: string
  avatar: string
  isFollowing: boolean
  verified?: boolean
}

// Mock followers data for different users
const mockFollowersData: Record<string, Follower[]> = {
  blenderfoundation: [
    {
      id: "1",
      username: "johndoe",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
      isFollowing: false,
    },
    {
      id: "2",
      username: "google",
      name: "Google",
      avatar: "/placeholder.svg?height=40&width=40&text=G",
      isFollowing: true,
      verified: true,
    },
    {
      id: "3",
      username: "animationfan",
      name: "Animation Fan",
      avatar: "/placeholder.svg?height=40&width=40&text=AF",
      isFollowing: true,
    },
    {
      id: "4",
      username: "3dartist",
      name: "3D Artist Pro",
      avatar: "/placeholder.svg?height=40&width=40&text=3D",
      isFollowing: false,
    },
    {
      id: "5",
      username: "motiondesigner",
      name: "Motion Designer",
      avatar: "/placeholder.svg?height=40&width=40&text=MD",
      isFollowing: true,
    },
  ],
  google: [
    {
      id: "1",
      username: "johndoe",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
      isFollowing: false,
    },
    {
      id: "2",
      username: "blenderfoundation",
      name: "Blender Foundation",
      avatar: "/placeholder.svg?height=40&width=40&text=BF",
      isFollowing: true,
      verified: true,
    },
    {
      id: "3",
      username: "techreview",
      name: "Tech Review",
      avatar: "/placeholder.svg?height=40&width=40&text=TR",
      isFollowing: false,
    },
    {
      id: "4",
      username: "developer",
      name: "Developer",
      avatar: "/placeholder.svg?height=40&width=40&text=DV",
      isFollowing: true,
    },
  ],
}

export default function UserFollowersPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const [searchQuery, setSearchQuery] = useState("")

  const followersData = mockFollowersData[username] || []
  const [followers, setFollowers] = useState(followersData)

  const handleFollow = (userId: string) => {
    setFollowers((prev) =>
      prev.map((follower) => (follower.id === userId ? { ...follower, isFollowing: !follower.isFollowing } : follower)),
    )
  }

  const filteredFollowers = followers.filter(
    (follower) =>
      follower.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follower.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (followersData.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pb-16">
        <div className="text-center p-4">
          <h1 className="text-xl font-bold mb-2">User not found</h1>
          <p className="text-slate-400 mb-4 text-sm">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} size="sm">
            Go Back
          </Button>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center mb-3">
          <button onClick={() => router.back()} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">
            @{username}'s Followers ({followers.length})
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search followers..."
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-400 h-10 text-sm"
          />
        </div>
      </div>

      {/* Followers List */}
      <div className="p-4">
        <div className="space-y-3">
          {filteredFollowers.map((follower) => (
            <div key={follower.id} className="bg-slate-900 hover:bg-slate-800 rounded-lg p-3 transition-colors">
              <div className="flex items-center justify-between">
                <Link href={`/profile/${follower.username}`} className="flex items-center space-x-3 flex-1">
                  <img
                    src={follower.avatar || "/placeholder.svg"}
                    alt={follower.name}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{follower.name}</span>
                      {follower.verified && (
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
                    <div className="text-slate-400 text-xs">@{follower.username}</div>
                  </div>
                </Link>
                <Button
                  onClick={() => handleFollow(follower.id)}
                  size="sm"
                  variant="outline"
                  className={`text-xs h-8 px-3 ${
                    follower.isFollowing
                      ? "bg-slate-700 text-white border-slate-600"
                      : "bg-transparent border-slate-600 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {follower.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredFollowers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No followers found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
