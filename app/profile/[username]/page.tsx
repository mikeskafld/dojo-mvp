"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Play,
  MoreHorizontal,
  ChevronRight,
  Filter,
  Calendar,
  TrendingUp,
  Hash,
  Lock,
  Star,
} from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"
import SubscriptionModal from "@/components/SubscriptionModal"
import UnfollowWarningModal from "@/components/UnfollowWarningModal" // Import the new modal

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

const mockProfiles: Record<
  string,
  {
    name: string
    username: string
    bio: string
    followers: number
    following: number
    videos: Video[]
    isFollowing: boolean
    isSubscribed: boolean // Added isSubscribed to mock data
    subscription?: {
      enabled: boolean
      price: number
      currency: string
    }
  }
> = {
  chefmaria: {
    name: "Chef Maria",
    username: "@chefmaria",
    bio: "Professional chef sharing authentic recipes and cooking techniques from around the world 👩‍🍳",
    followers: 2100000,
    following: 127,
    isFollowing: true,
    isSubscribed: true,
    subscription: {
      enabled: true,
      price: 12.99,
      currency: "USD",
    },
    videos: [
      {
        id: "pasta-masterclass",
        title: "Perfect Pasta Masterclass",
        description:
          "Learn to make restaurant-quality pasta from scratch! From mixing the dough to creating the perfect sauce.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Pasta+Masterclass",
        duration: "12:30",
        views: "2.1M",
        likes: "156K",
        category: "Cooking",
        createdAt: "2024-01-01",
        popularity: 156000,
      },
      {
        id: "italian-risotto",
        title: "Authentic Italian Risotto",
        description: "Step-by-step guide to making creamy, authentic Italian risotto with the perfect texture.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Italian+Risotto",
        duration: "18:45",
        views: "1.8M",
        likes: "142K",
        category: "Cooking",
        createdAt: "2023-12-15",
        popularity: 142000,
      },
      {
        id: "knife-skills",
        title: "Essential Knife Skills",
        description:
          "Master the fundamental knife techniques every home cook should know for safer and faster cooking.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Knife+Skills",
        duration: "15:20",
        views: "3.2M",
        likes: "287K",
        category: "Tutorial",
        createdAt: "2023-11-20",
        popularity: 287000,
      },
    ],
  },
  fitnessjake: {
    name: "Fitness Pro Jake",
    username: "@fitnessjake",
    bio: "Certified personal trainer helping you achieve your fitness goals with effective workouts 💪",
    followers: 1800000,
    following: 89,
    isFollowing: true,
    isSubscribed: false,
    videos: [
      {
        id: "hiit-cardio-blast",
        title: "30-Minute HIIT Cardio Blast",
        description: "High-intensity interval training that will get your heart pumping! Perfect for burning calories.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=HIIT+Cardio",
        duration: "30:15",
        views: "890K",
        likes: "67K",
        category: "Fitness",
        createdAt: "2024-01-05",
        popularity: 67000,
      },
      {
        id: "strength-training",
        title: "Full Body Strength Training",
        description:
          "Complete full-body strength workout! Build muscle and increase power with proper form demonstrations.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Strength+Training",
        duration: "35:00",
        views: "756K",
        likes: "54K",
        category: "Fitness",
        createdAt: "2023-12-20",
        popularity: 54000,
      },
    ],
  },
  musicsam: {
    name: "Music Teacher Sam",
    username: "@musicsam",
    bio: "Music educator sharing guitar and music theory lessons for all skill levels 🎸",
    followers: 1500000,
    following: 156,
    isFollowing: true,
    isSubscribed: false,
    videos: [
      {
        id: "guitar-basics",
        title: "Guitar Basics for Beginners",
        description: "Your first guitar lesson! Learn proper posture, basic chords, and play your first song.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Guitar+Basics",
        duration: "18:45",
        views: "1.5M",
        likes: "98K",
        category: "Music",
        createdAt: "2024-01-10",
        popularity: 98000,
      },
      {
        id: "chord-progressions",
        title: "Essential Chord Progressions",
        description: "Learn the most common chord progressions used in popular music and how to play them.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Chord+Progressions",
        duration: "22:30",
        views: "1.2M",
        likes: "89K",
        category: "Music",
        createdAt: "2023-12-25",
        popularity: 89000,
      },
    ],
  },
  bakeremma: {
    name: "Baker Emma",
    username: "@bakeremma",
    bio: "Artisan baker sharing bread recipes, techniques, and the joy of baking from scratch 🍞",
    followers: 1200000,
    following: 78,
    isFollowing: true,
    isSubscribed: false,
    videos: [
      {
        id: "sourdough-bread",
        title: "Artisan Sourdough Bread",
        description: "Master the art of sourdough! From starter maintenance to the perfect loaf.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Sourdough+Bread",
        duration: "25:20",
        views: "3.2M",
        likes: "245K",
        category: "Cooking",
        createdAt: "2024-01-08",
        popularity: 245000,
      },
      {
        id: "croissant-technique",
        title: "Perfect Croissant Technique",
        description: "Learn the lamination technique to create flaky, buttery croissants at home.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Croissant+Technique",
        duration: "32:15",
        views: "2.8M",
        likes: "198K",
        category: "Cooking",
        createdAt: "2023-12-10",
        popularity: 198000,
      },
    ],
  },
  yogalisa: {
    name: "Yoga Instructor Lisa",
    username: "@yogalisa",
    bio: "Certified yoga instructor sharing flows for flexibility, strength, and mindfulness 🧘‍♀️",
    followers: 980000,
    following: 234,
    isFollowing: true,
    isSubscribed: false,
    videos: [
      {
        id: "yoga-flow",
        title: "Morning Yoga Flow",
        description: "Start your day with this energizing yoga flow! Perfect for all levels.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Yoga+Flow",
        duration: "22:30",
        views: "1.8M",
        likes: "134K",
        category: "Fitness",
        createdAt: "2024-01-12",
        popularity: 134000,
      },
      {
        id: "flexibility-routine",
        title: "Deep Flexibility Routine",
        description: "Improve your flexibility with this comprehensive stretching routine for all muscle groups.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Flexibility+Routine",
        duration: "28:45",
        views: "1.4M",
        likes: "112K",
        category: "Fitness",
        createdAt: "2023-12-18",
        popularity: 112000,
      },
    ],
  },
  chefniran: {
    name: "Chef Niran",
    username: "@chefniran",
    bio: "Thai cuisine specialist bringing authentic flavors and traditional cooking methods to your kitchen 🌶️",
    followers: 850000,
    following: 67,
    isFollowing: false,
    isSubscribed: false,
    videos: [
      {
        id: "thai-curry",
        title: "Authentic Thai Green Curry",
        description: "Authentic Thai green curry recipe! Learn to make curry paste from scratch.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Thai+Curry",
        duration: "14:45",
        views: "1.1M",
        likes: "89K",
        category: "Cooking",
        createdAt: "2024-01-03",
        popularity: 89000,
      },
      {
        id: "pad-thai",
        title: "Traditional Pad Thai",
        description: "Learn to make authentic Pad Thai with the perfect balance of sweet, sour, and savory flavors.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Pad+Thai",
        duration: "16:30",
        views: "950K",
        likes: "76K",
        category: "Cooking",
        createdAt: "2023-12-22",
        popularity: 76000,
      },
    ],
  },
  trainermike: {
    name: "Trainer Mike",
    username: "@trainermike",
    bio: "Strength and conditioning coach focused on functional fitness and athletic performance 🏋️‍♂️",
    followers: 720000,
    following: 145,
    isFollowing: true,
    isSubscribed: false,
    videos: [
      {
        id: "strength-training-advanced",
        title: "Advanced Strength Training",
        description: "Take your strength training to the next level with these advanced techniques and progressions.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Advanced+Strength",
        duration: "42:15",
        views: "680K",
        likes: "52K",
        category: "Fitness",
        createdAt: "2024-01-07",
        popularity: 52000,
      },
      {
        id: "functional-movement",
        title: "Functional Movement Patterns",
        description: "Master the fundamental movement patterns that form the foundation of all athletic performance.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Functional+Movement",
        duration: "38:20",
        views: "590K",
        likes: "45K",
        category: "Fitness",
        createdAt: "2023-12-28",
        popularity: 45000,
      },
    ],
  },
  pianoalex: {
    name: "Piano Teacher Alex",
    username: "@pianoalex",
    bio: "Piano instructor making music theory and technique accessible for students of all ages 🎹",
    followers: 650000,
    following: 98,
    isFollowing: false,
    isSubscribed: false,
    videos: [
      {
        id: "piano-fundamentals",
        title: "Piano Fundamentals",
        description: "Learn piano basics! Hand position, scales, and your first melody.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Piano+Fundamentals",
        duration: "16:15",
        views: "2.4M",
        likes: "187K",
        category: "Music",
        createdAt: "2024-01-14",
        popularity: 187000,
      },
      {
        id: "music-theory-basics",
        title: "Music Theory Made Simple",
        description: "Understand the fundamentals of music theory in an easy-to-follow format for beginners.",
        thumbnail: "/placeholder.svg?height=600&width=400&text=Music+Theory",
        duration: "24:30",
        views: "1.9M",
        likes: "156K",
        category: "Music",
        createdAt: "2023-12-05",
        popularity: 156000,
      },
    ],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showUnfollowWarning, setShowUnfollowWarning] = useState(false)

  const profile = mockProfiles[username]

  // Initialize isFollowing and isSubscribed from mock data
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing || false)
  const [isSubscribed, setIsSubscribed] = useState(profile?.isSubscribed || false)

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pb-16">
        <div className="text-center p-4">
          <h1 className="text-xl font-bold mb-2">Profile not found</h1>
          <p className="text-slate-400 mb-4 text-sm">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} size="sm">
            Go Back
          </Button>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  const handleFollow = () => {
    if (profile.subscription?.enabled && !isSubscribed) {
      setShowSubscriptionModal(true)
    } else {
      setIsFollowing(true)
    }
  }

  const handleUnfollow = () => {
    if (profile.subscription?.enabled && isSubscribed) {
      setShowUnfollowWarning(true)
    } else {
      setIsFollowing(false)
    }
  }

  const confirmUnfollow = () => {
    setIsFollowing(false)
    setIsSubscribed(false) // If unfollowing a premium user, also unsubscribe
    setShowUnfollowWarning(false)
  }

  const handleSubscribe = () => {
    setIsSubscribed(true)
    setIsFollowing(true) // Automatically follow after subscribing
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(profile.videos.map((video) => video.category))]
    return categories.sort()
  }

  const sortedVideos = [...profile.videos]
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

  const showContent = !profile.subscription?.enabled || isSubscribed

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Back Button */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">{profile.name.charAt(0)}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-lg font-bold">{profile.username}</h2>
              {profile.subscription?.enabled && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">Premium</span>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{profile.bio}</p>

            <div className="flex items-center space-x-4 mt-3 text-sm">
              <Link
                href={`/profile/${username}/followers`}
                className="hover:bg-slate-800 rounded-lg p-2 transition-colors group"
              >
                <div className="flex items-center space-x-1">
                  <div className="text-center">
                    <div className="font-bold group-hover:text-white text-sm">{formatNumber(profile.followers)}</div>
                    <div className="text-slate-400 group-hover:text-slate-300 text-xs">Followers</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                </div>
              </Link>
              <Link
                href={`/profile/${username}/following`}
                className="hover:bg-slate-800 rounded-lg p-2 transition-colors group"
              >
                <div className="flex items-center space-x-1">
                  <div className="text-center">
                    <div className="font-bold group-hover:text-white text-sm">{profile.following}</div>
                    <div className="text-slate-400 group-hover:text-slate-300 text-xs">Following</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                </div>
              </Link>
              <div className="p-2">
                <div className="text-center">
                  <div className="font-bold text-sm">{profile.videos.length}</div>
                  <div className="text-slate-400 text-xs">Videos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info & Follow Button */}
        <div className="mt-4 space-y-3">
          {profile.subscription?.enabled && !isSubscribed && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium text-sm">Premium Content</span>
                  </div>
                  <p className="text-xs text-slate-300">Subscribe to access exclusive videos and content</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${profile.subscription.price}</div>
                  <div className="text-xs text-slate-400">per month</div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`w-full h-10 ${
              profile.subscription?.enabled && !isSubscribed
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                : isFollowing
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {profile.subscription?.enabled && !isSubscribed
              ? `Subscribe for $${profile.subscription.price}/month`
              : isFollowing
                ? "Following"
                : "Follow"}
          </Button>
        </div>
      </div>

      {showContent ? (
        <>
          {/* Sort Controls */}
          {profile.videos.length > 0 && (
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
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-slate-800 rounded-b-lg"
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
                    ({sortedVideos.length} of {profile.videos.length})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Videos */}
          <div className="p-4">
            <div className="space-y-8">
              {sortedVideos.map((video) => (
                <Link key={video.id} href={`/feed?video=${video.id}&user=${username}`}>
                  <div className="bg-slate-900 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors">
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
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
          </div>
        </>
      ) : (
        /* Subscription Gate */
        <div className="p-4">
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Premium Content</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                This creator's content is available to subscribers only. Subscribe to access exclusive videos and
                content.
              </p>
            </div>
            <Button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8"
            >
              Subscribe for ${profile.subscription?.price}/month
            </Button>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        username={username}
        price={profile.subscription?.price || 0}
        onSubscribe={handleSubscribe}
      />

      {/* Unfollow Warning Modal */}
      <UnfollowWarningModal
        isOpen={showUnfollowWarning}
        onClose={() => setShowUnfollowWarning(false)}
        username={username}
        onConfirm={confirmUnfollow}
      />

      <BottomNavigation />
    </div>
  )
}
