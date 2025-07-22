"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, UserIcon, Hash, TrendingUp, Play } from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"
import { useRouter } from "next/navigation"

interface Tag {
  id: string
  name: string
  count: string
  trending?: boolean
}

interface Creator {
  id: string
  username: string
  name: string
  followers: string
  avatar: string
  verified?: boolean
  isFollowing: boolean
}

interface Video {
  id: string
  title: string
  creator: string
  username: string
  thumbnail: string
  duration: string
  views: string
  category: string
}

const mockTags: Tag[] = [
  { id: "1", name: "cooking", count: "4.2M", trending: true },
  { id: "2", name: "fitness", count: "3.8M", trending: true },
  { id: "3", name: "music", count: "2.9M" },
  { id: "4", name: "tutorial", count: "1.8M" },
  { id: "5", name: "beginner", count: "1.2M" },
  { id: "6", name: "workout", count: "950K" },
  { id: "7", name: "recipe", count: "780K" },
  { id: "8", name: "guitar", count: "650K" },
  { id: "9", name: "piano", count: "540K" },
  { id: "10", name: "yoga", count: "420K" },
]

const mockUsers: Creator[] = [
  {
    id: "1",
    username: "chefmaria",
    name: "Chef Maria",
    followers: "2.1M",
    avatar: "/placeholder.svg?height=40&width=40&text=CM",
    verified: true,
    isFollowing: false,
  },
  {
    id: "2",
    username: "fitnessjake",
    name: "Fitness Pro Jake",
    followers: "1.8M",
    avatar: "/placeholder.svg?height=40&width=40&text=FJ",
    verified: true,
    isFollowing: false,
  },
  {
    id: "3",
    username: "musicsam",
    name: "Music Teacher Sam",
    followers: "1.5M",
    avatar: "/placeholder.svg?height=40&width=40&text=MS",
    verified: false,
    isFollowing: true,
  },
  {
    id: "4",
    username: "bakeremma",
    name: "Baker Emma",
    followers: "1.2M",
    avatar: "/placeholder.svg?height=40&width=40&text=BE",
    verified: true,
    isFollowing: true,
  },
  {
    id: "5",
    username: "yogalisa",
    name: "Yoga Instructor Lisa",
    followers: "980K",
    avatar: "/placeholder.svg?height=40&width=40&text=YL",
    verified: false,
    isFollowing: true,
  },
  {
    id: "6",
    username: "chefniran",
    name: "Chef Niran",
    followers: "850K",
    avatar: "/placeholder.svg?height=40&width=40&text=CN",
    verified: false,
    isFollowing: false,
  },
  {
    id: "7",
    username: "trainermike",
    name: "Trainer Mike",
    followers: "720K",
    avatar: "/placeholder.svg?height=40&width=40&text=TM",
    verified: false,
    isFollowing: true,
  },
  {
    id: "8",
    username: "pianoalex",
    name: "Piano Teacher Alex",
    followers: "650K",
    avatar: "/placeholder.svg?height=40&width=40&text=PA",
    verified: false,
    isFollowing: false,
  },
]

const getVideosForTag = (tagName: string): Video[] => {
  const allVideos: Video[] = [
    {
      id: "pasta-masterclass",
      title: "Perfect Pasta Masterclass",
      creator: "Chef Maria",
      username: "chefmaria",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Pasta+Masterclass",
      duration: "12:30",
      views: "2.1M",
      category: "Cooking",
    },
    {
      id: "sourdough-bread",
      title: "Artisan Sourdough Bread",
      creator: "Baker Emma",
      username: "bakeremma",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Sourdough+Bread",
      duration: "25:20",
      views: "3.2M",
      category: "Cooking",
    },
    {
      id: "thai-curry",
      title: "Authentic Thai Green Curry",
      creator: "Chef Niran",
      username: "chefniran",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Thai+Curry",
      duration: "14:45",
      views: "1.1M",
      category: "Cooking",
    },
    {
      id: "hiit-cardio-blast",
      title: "30-Minute HIIT Cardio Blast",
      creator: "Fitness Pro Jake",
      username: "fitnessjake",
      thumbnail: "/placeholder.svg?height=200&width=300&text=HIIT+Cardio",
      duration: "30:15",
      views: "890K",
      category: "Fitness",
    },
    {
      id: "yoga-flow",
      title: "Morning Yoga Flow",
      creator: "Yoga Instructor Lisa",
      username: "yogalisa",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Yoga+Flow",
      duration: "22:30",
      views: "1.8M",
      category: "Fitness",
    },
    {
      id: "strength-training",
      title: "Full Body Strength Training",
      creator: "Trainer Mike",
      username: "trainermike",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Strength+Training",
      duration: "35:00",
      views: "756K",
      category: "Fitness",
    },
    {
      id: "guitar-basics",
      title: "Guitar Basics for Beginners",
      creator: "Music Teacher Sam",
      username: "musicsam",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Guitar+Basics",
      duration: "18:45",
      views: "1.5M",
      category: "Music",
    },
    {
      id: "piano-fundamentals",
      title: "Piano Fundamentals",
      creator: "Piano Teacher Alex",
      username: "pianoalex",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Piano+Fundamentals",
      duration: "16:15",
      views: "2.4M",
      category: "Music",
    },
  ]

  return allVideos.filter((video) => video.category.toLowerCase() === tagName.toLowerCase())
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"tags" | "users" | "videos">("tags")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [users, setUsers] = useState(mockUsers)
  const router = useRouter()

  const filteredTags = mockTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleTagClick = (tagName: string) => {
    router.push(`/feed?tag=${tagName}`)
  }

  const handleFollow = (userId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)))
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-lg font-bold mb-3">Browse</h1>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, users, or videos..."
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-400 h-10 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4">
        <button
          onClick={() => setActiveTab("tags")}
          className={`flex items-center space-x-2 py-3 px-4 text-sm ${
            activeTab === "tags" ? "border-b-2 border-white text-white" : "text-slate-400"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Tags</span>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 py-3 px-4 text-sm ${
            activeTab === "users" ? "border-b-2 border-white text-white" : "text-slate-400"
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Users</span>
        </button>
        {selectedTag && (
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center space-x-2 py-3 px-4 text-sm ${
              activeTab === "videos" ? "border-b-2 border-white text-white" : "text-slate-400"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>#{selectedTag}</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tags Tab */}
        {activeTab === "tags" && (
          <div className="space-y-4">
            {/* Trending Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <h2 className="text-base font-semibold">Trending</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredTags
                  .filter((tag) => tag.trending)
                  .map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className="bg-slate-900 hover:bg-slate-800 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-sm">{tag.name}</span>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400 text-xs">
                          Trending
                        </Badge>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">{tag.count} videos</div>
                    </button>
                  ))}
              </div>
            </div>

            {/* All Tags */}
            <div>
              <h2 className="text-base font-semibold mb-3">All Tags</h2>
              <div className="grid grid-cols-1 gap-2">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className="bg-slate-900 hover:bg-slate-800 rounded-lg p-3 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-sm">#{tag.name}</div>
                          <div className="text-slate-400 text-xs">{tag.count} videos</div>
                        </div>
                      </div>
                      {tag.trending && (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400 text-xs">
                          Trending
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            {users
              .filter(
                (user) =>
                  user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((user) => (
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
                        <div className="text-slate-400 text-xs">{user.followers} followers</div>
                      </div>
                    </Link>
                    <Button
                      onClick={(e) => handleFollow(user.id, e)}
                      size="sm"
                      variant="outline"
                      className={`text-xs h-8 px-3 ${
                        user.isFollowing
                          ? "bg-slate-700 text-white border-slate-600"
                          : "bg-transparent border-slate-600 text-white hover:bg-white hover:text-black"
                      }`}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && selectedTag && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Hash className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold">#{selectedTag}</h2>
              <Badge className="bg-primary text-primary-foreground text-xs">
                {mockTags.find((t) => t.name === selectedTag)?.count} videos
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {getVideosForTag(selectedTag).map((video) => (
                <Link key={video.id} href={`/feed?video=${video.id}&tag=${selectedTag}`}>
                  <div className="bg-slate-900 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors">
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-primary text-primary-foreground text-xs">{video.category}</Badge>
                      </div>
                      <h3 className="font-bold text-base mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>@{video.username}</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
