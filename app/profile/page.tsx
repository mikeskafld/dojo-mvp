"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Heart, Bookmark, Plus, Play, ChevronRight, Filter, Calendar, TrendingUp, Hash } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  likes: string
  category: string
  createdAt: string
  popularity: number
}

const initialUserVideos: Video[] = [
  {
    id: "my-pasta-recipe",
    title: "My Secret Pasta Recipe",
    description:
      "Finally sharing my grandmother's secret pasta recipe! This has been in our family for generations. #pasta #cooking #family @johndoe",
    thumbnail: "/placeholder.svg?height=600&width=400&text=Secret+Pasta",
    duration: "15:30",
    views: "45.2K",
    likes: "3.8K",
    category: "Cooking",
    createdAt: "2024-01-20",
    popularity: 3800,
  },
  {
    id: "morning-workout-routine",
    title: "My Daily Morning Workout",
    description:
      "Here's the exact workout routine I do every morning to stay fit and energized! Perfect for beginners. #fitness #morning #workout #routine",
    thumbnail: "/placeholder.svg?height=600&width=400&text=Morning+Workout",
    duration: "22:15",
    views: "28.7K",
    likes: "2.1K",
    category: "Fitness",
    createdAt: "2024-01-15",
    popularity: 2100,
  },
  {
    id: "guitar-cover-song",
    title: "Acoustic Guitar Cover",
    description:
      "Playing one of my favorite songs on acoustic guitar. Hope you enjoy this cover! #guitar #music #acoustic #cover",
    thumbnail: "/placeholder.svg?height=600&width=400&text=Guitar+Cover",
    duration: "4:45",
    views: "67.1K",
    likes: "5.2K",
    category: "Music",
    createdAt: "2024-01-10",
    popularity: 5200,
  },
]

// Mock data for followers/following
const mockFollowers = [
  { id: "1", username: "chefmaria" },
  { id: "2", username: "fitnessjake" },
  { id: "3", username: "musicsam" },
  { id: "4", username: "bakeremma" },
  { id: "5", username: "yogalisa" },
  { id: "6", username: "trainermike" },
]

const mockFollowing = [
  { id: "1", username: "chefmaria" },
  { id: "2", username: "fitnessjake" },
  { id: "3", username: "musicsam" },
]

export default function PersonalProfilePage() {
  const [activeTab, setActiveTab] = useState<"videos" | "likes" | "saves">("videos")
  const [userVideos, setUserVideos] = useState(initialUserVideos)
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

  // Check if we're coming from a successful upload
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("newVideo") === "true") {
      // Add the new video to the list
      const newVideo: Video = {
        id: `my-video-${Date.now()}`,
        title: "Big Buck Bunny",
        description: "Just uploaded this amazing animated short film with AI-generated chapters!",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Big+Buck+Bunny",
        duration: "10:00",
        views: "0",
        likes: "0",
        category: "Animation",
        createdAt: new Date().toISOString().split("T")[0],
        popularity: 0,
      }
      setUserVideos((prev) => [newVideo, ...prev])

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const sortedVideos = [...userVideos]
    .filter((video) => selectedCategories.length === 0 || selectedCategories.includes(video.category))
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "popularity":
          return b.popularity - a.popularity
        default:
          return 0
      }
    })

  const followerCount = mockFollowers.length
  const followingCount = mockFollowing.length
  const videoCount = userVideos.length

  const getSortIcon = () => {
    switch (sortBy) {
      case "date":
        return <Calendar className="w-4 h-4" />
      case "popularity":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Filter className="w-4 h-4" />
    }
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(userVideos.map((video) => video.category))]
    return categories.sort()
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Profile Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">JD</span>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold">@johndoe</h2>
            <p className="text-slate-400 text-sm mt-1">
              Content creator sharing cooking, fitness, and music tutorials ✨
            </p>

            <div className="flex items-center space-x-4 mt-3 text-sm">
              <Link href="/followers" className="hover:bg-slate-800 rounded-lg p-2 transition-colors group">
                <div className="flex items-center space-x-1">
                  <div className="text-center">
                    <div className="font-bold group-hover:text-white text-sm">{followerCount.toLocaleString()}</div>
                    <div className="text-slate-400 group-hover:text-slate-300 text-xs">Followers</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                </div>
              </Link>
              <Link href="/following" className="hover:bg-slate-800 rounded-lg p-2 transition-colors group">
                <div className="flex items-center space-x-1">
                  <div className="text-center">
                    <div className="font-bold group-hover:text-white text-sm">{followingCount}</div>
                    <div className="text-slate-400 group-hover:text-slate-300 text-xs">Following</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                </div>
              </Link>
              <div className="p-2">
                <div className="text-center">
                  <div className="font-bold text-sm">{videoCount}</div>
                  <div className="text-slate-400 text-xs">Videos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Button */}
        <Link href="/upload">
          <Button className="w-full mt-4 bg-white text-black hover:bg-white/90 h-10">
            <Plus className="w-4 h-4 mr-2" />
            Post New Video
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === "videos" ? "border-b-2 border-white text-white" : "text-slate-400"
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === "likes" ? "border-b-2 border-white text-white" : "text-slate-400"
          }`}
        >
          <Heart className="w-4 h-4 inline mr-1" />
          Likes
        </button>
        <button
          onClick={() => setActiveTab("saves")}
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === "saves" ? "border-b-2 border-white text-white" : "text-slate-400"
          }`}
        >
          <Bookmark className="w-4 h-4 inline mr-1" />
          Saves
        </button>
      </div>

      {/* Sort and Filter Controls - Only show for videos tab */}
      {activeTab === "videos" && userVideos.length > 0 && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowSortMenu(!showSortMenu)}
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
              >
                {getSortIcon()}
                <span className="ml-2 text-sm">Sort by {sortBy === "date" ? "Date" : "Popularity"}</span>
              </Button>

              {showSortMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setSortBy("date")
                      setShowSortMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-slate-800 rounded-t-lg"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("popularity")
                      setShowSortMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-slate-800"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Popularity</span>
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
              >
                <Hash className="w-4 h-4" />
                <span className="ml-2 text-sm">
                  {selectedCategories.length === 0
                    ? "All Categories"
                    : selectedCategories.length === 1
                      ? selectedCategories[0]
                      : `${selectedCategories.length} Categories`}
                </span>
              </Button>

              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setSelectedCategories([])
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-800 rounded-t-lg ${
                      selectedCategories.length === 0 ? "bg-slate-800 text-white" : ""
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategories.length === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </button>
                  {getUniqueCategories().map((category, index) => {
                    const isSelected = selectedCategories.includes(category)
                    const isLast = index === getUniqueCategories().length - 1
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCategories(selectedCategories.filter((c) => c !== category))
                          } else {
                            setSelectedCategories([...selectedCategories, category])
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-800 ${
                          isLast ? "rounded-b-lg" : ""
                        } ${isSelected ? "bg-slate-800 text-white" : ""}`}
                      >
                        <span>{category}</span>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Categories Display */}
          {selectedCategories.length > 0 && (
            <div className="mt-3 flex items-center space-x-2">
              <Hash className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">
                Showing <span className="text-white font-medium">{selectedCategories.join(", ")}</span> videos
              </span>
              <span className="text-xs text-slate-500">
                ({sortedVideos.length} of {userVideos.length})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {activeTab === "videos" && (
          <div className="space-y-8">
            {sortedVideos.map((video, index) => (
              <Link
                key={video.id}
                href={`/feed?video=${video.id}&user=johndoe&index=${index}&total=${sortedVideos.length}`}
              >
                <div className="bg-slate-900 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover"
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
                    <p className="text-slate-300 text-sm mb-2 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>{video.views} views</span>
                      <span>{video.likes} likes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "videos" && sortedVideos.length === 0 && userVideos.length > 0 && (
          <div className="text-center py-12">
            <Hash className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p className="text-slate-400 text-sm">
              You don't have any videos in the selected {selectedCategories.length === 1 ? "category" : "categories"}{" "}
              yet
            </p>
            <Button
              onClick={() => setSelectedCategories([])}
              variant="outline"
              size="sm"
              className="mt-3 bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
            >
              Show all videos
            </Button>
          </div>
        )}

        {activeTab === "videos" && userVideos.length === 0 && (
          <div className="text-center py-12">
            <Play className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-slate-400 text-sm">Upload your first video to get started</p>
          </div>
        )}

        {activeTab === "likes" && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No liked videos yet</h3>
            <p className="text-slate-400 text-sm">Videos you like will appear here</p>
          </div>
        )}

        {activeTab === "saves" && (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved videos yet</h3>
            <p className="text-slate-400 text-sm">Videos you save will appear here</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
