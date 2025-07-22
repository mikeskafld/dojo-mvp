"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useCallback, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Play,
  Clock,
  User,
  Heart,
  Share,
  Bookmark,
  X,
  Pause,
  MessageCircle,
  Send,
  Copy,
  Check,
  Minimize2,
  ArrowLeft,
} from "lucide-react"
import CommentModal from "@/components/CommentModal"
import BottomNavigation from "@/components/BottomNavigation"
import { useRouter, useSearchParams } from "next/navigation"

interface Chapter {
  id: string
  title: string
  startTime: number
  endTime: number
  thumbnail: string
}

interface Video {
  id: string
  title: string
  creator: string
  username: string
  duration: string
  thumbnail: string
  videoUrl: string
  chapterCount: number
  category: string
  description: string
  views: string
  likes: string
  totalDuration: number
  chapters: Chapter[]
  isLiked: boolean
  isSaved: boolean
  isFollowing: boolean
}

const mockVideos: Video[] = [
  {
    id: "pasta-masterclass",
    title: "Perfect Pasta Masterclass",
    creator: "Chef Maria",
    username: "chefmaria",
    duration: "12:30",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Pasta+Masterclass",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    chapterCount: 6,
    category: "Cooking",
    description:
      "Learn to make restaurant-quality pasta from scratch! From mixing the dough to creating the perfect sauce. #pasta #cooking #italian @chefmaria",
    views: "2.1M",
    likes: "156K",
    totalDuration: 750,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Ingredients & Equipment",
        startTime: 0,
        endTime: 120,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Ingredients",
      },
      {
        id: "2",
        title: "Making the Dough",
        startTime: 121,
        endTime: 300,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Making+Dough",
      },
      {
        id: "3",
        title: "Rolling & Shaping",
        startTime: 301,
        endTime: 450,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Rolling+Pasta",
      },
      {
        id: "4",
        title: "Preparing the Sauce",
        startTime: 451,
        endTime: 600,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Making+Sauce",
      },
      {
        id: "5",
        title: "Cooking the Pasta",
        startTime: 601,
        endTime: 700,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Cooking+Pasta",
      },
      {
        id: "6",
        title: "Plating & Serving",
        startTime: 701,
        endTime: 750,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Plating",
      },
    ],
  },
  {
    id: "hiit-cardio-blast",
    title: "30-Minute HIIT Cardio Blast",
    creator: "Fitness Pro Jake",
    username: "fitnessjake",
    duration: "30:15",
    thumbnail: "/placeholder.svg?height=800&width=450&text=HIIT+Cardio",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    chapterCount: 5,
    category: "Fitness",
    description:
      "High-intensity interval training that will get your heart pumping! Perfect for burning calories and building endurance. #HIIT #cardio #fitness #workout",
    views: "890K",
    likes: "67K",
    totalDuration: 1815,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    chapters: [
      {
        id: "1",
        title: "Warm-Up",
        startTime: 0,
        endTime: 300,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Warm+Up",
      },
      {
        id: "2",
        title: "Round 1: Lower Body",
        startTime: 301,
        endTime: 720,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Lower+Body",
      },
      {
        id: "3",
        title: "Round 2: Upper Body",
        startTime: 721,
        endTime: 1140,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Upper+Body",
      },
      {
        id: "4",
        title: "Round 3: Full Body",
        startTime: 1141,
        endTime: 1560,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Full+Body",
      },
      {
        id: "5",
        title: "Cool Down & Stretch",
        startTime: 1561,
        endTime: 1815,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Cool+Down",
      },
    ],
  },
  {
    id: "guitar-basics",
    title: "Guitar Basics for Beginners",
    creator: "Music Teacher Sam",
    username: "musicsam",
    duration: "18:45",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Guitar+Basics",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    chapterCount: 7,
    category: "Music",
    description:
      "Your first guitar lesson! Learn proper posture, basic chords, and play your first song. Perfect for absolute beginners! #guitar #music #lessons #beginner",
    views: "1.5M",
    likes: "98K",
    totalDuration: 1125,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Guitar Parts & Setup",
        startTime: 0,
        endTime: 180,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Guitar+Parts",
      },
      {
        id: "2",
        title: "Proper Posture",
        startTime: 181,
        endTime: 300,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Posture",
      },
      {
        id: "3",
        title: "First Chord: G Major",
        startTime: 301,
        endTime: 480,
        thumbnail: "/placeholder.svg?height=120&width=200&text=G+Chord",
      },
      {
        id: "4",
        title: "Second Chord: C Major",
        startTime: 481,
        endTime: 660,
        thumbnail: "/placeholder.svg?height=120&width=200&text=C+Chord",
      },
      {
        id: "5",
        title: "Third Chord: D Major",
        startTime: 661,
        endTime: 840,
        thumbnail: "/placeholder.svg?height=120&width=200&text=D+Chord",
      },
      {
        id: "6",
        title: "Chord Transitions",
        startTime: 841,
        endTime: 1020,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Transitions",
      },
      {
        id: "7",
        title: "Playing Your First Song",
        startTime: 1021,
        endTime: 1125,
        thumbnail: "/placeholder.svg?height=120&width=200&text=First+Song",
      },
    ],
  },
  {
    id: "sourdough-bread",
    title: "Artisan Sourdough Bread",
    creator: "Baker Emma",
    username: "bakeremma",
    duration: "25:20",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Sourdough+Bread",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    chapterCount: 8,
    category: "Cooking",
    description:
      "Master the art of sourdough! From starter maintenance to the perfect loaf. Includes troubleshooting tips! #sourdough #bread #baking #artisan https://bakingguide.com",
    views: "3.2M",
    likes: "245K",
    totalDuration: 1520,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Starter Preparation",
        startTime: 0,
        endTime: 240,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Starter",
      },
      {
        id: "2",
        title: "Mixing the Dough",
        startTime: 241,
        endTime: 420,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Mixing+Dough",
      },
      {
        id: "3",
        title: "Autolyse Process",
        startTime: 421,
        endTime: 540,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Autolyse",
      },
      {
        id: "4",
        title: "Bulk Fermentation",
        startTime: 541,
        endTime: 780,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Fermentation",
      },
      {
        id: "5",
        title: "Shaping the Loaf",
        startTime: 781,
        endTime: 960,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Shaping",
      },
      {
        id: "6",
        title: "Final Proof",
        startTime: 961,
        endTime: 1140,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Final+Proof",
      },
      {
        id: "7",
        title: "Scoring & Baking",
        startTime: 1141,
        endTime: 1380,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Baking",
      },
      {
        id: "8",
        title: "Cooling & Slicing",
        startTime: 1381,
        endTime: 1520,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Cooling",
      },
    ],
  },
  {
    id: "yoga-flow",
    title: "Morning Yoga Flow",
    creator: "Yoga Instructor Lisa",
    username: "yogalisa",
    duration: "22:30",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Yoga+Flow",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    chapterCount: 6,
    category: "Fitness",
    description:
      "Start your day with this energizing yoga flow! Perfect for all levels. Increase flexibility and find your inner peace. #yoga #morning #flexibility #mindfulness @yogalisa",
    views: "1.8M",
    likes: "134K",
    totalDuration: 1350,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Centering & Breathing",
        startTime: 0,
        endTime: 180,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Centering",
      },
      {
        id: "2",
        title: "Gentle Warm-Up",
        startTime: 181,
        endTime: 360,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Warm+Up",
      },
      {
        id: "3",
        title: "Sun Salutations",
        startTime: 361,
        endTime: 720,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Sun+Salutations",
      },
      {
        id: "4",
        title: "Standing Poses",
        startTime: 721,
        endTime: 1020,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Standing+Poses",
      },
      {
        id: "5",
        title: "Floor Sequence",
        startTime: 1021,
        endTime: 1200,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Floor+Sequence",
      },
      {
        id: "6",
        title: "Relaxation",
        startTime: 1201,
        endTime: 1350,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Relaxation",
      },
    ],
  },
  {
    id: "piano-fundamentals",
    title: "Piano Fundamentals",
    creator: "Piano Teacher Alex",
    username: "pianoalex",
    duration: "16:15",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Piano+Fundamentals",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    chapterCount: 5,
    category: "Music",
    description:
      "Learn piano basics! Hand position, scales, and your first melody. Great for beginners of all ages! #piano #music #lessons #scales",
    views: "2.4M",
    likes: "187K",
    totalDuration: 975,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Piano Setup & Posture",
        startTime: 0,
        endTime: 180,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Piano+Setup",
      },
      {
        id: "2",
        title: "Hand Position",
        startTime: 181,
        endTime: 360,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Hand+Position",
      },
      {
        id: "3",
        title: "C Major Scale",
        startTime: 361,
        endTime: 600,
        thumbnail: "/placeholder.svg?height=120&width=200&text=C+Major+Scale",
      },
      {
        id: "4",
        title: "Simple Chords",
        startTime: 601,
        endTime: 780,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Simple+Chords",
      },
      {
        id: "5",
        title: "Playing Twinkle Twinkle",
        startTime: 781,
        endTime: 975,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Twinkle+Twinkle",
      },
    ],
  },
  {
    id: "thai-curry",
    title: "Authentic Thai Green Curry",
    creator: "Chef Niran",
    username: "chefniran",
    duration: "14:45",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Thai+Curry",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    chapterCount: 5,
    category: "Cooking",
    description:
      "Authentic Thai green curry recipe! Learn to make curry paste from scratch and balance the perfect flavors. #thai #curry #authentic #spicy @chefniran",
    views: "1.1M",
    likes: "89K",
    totalDuration: 885,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    chapters: [
      {
        id: "1",
        title: "Ingredient Preparation",
        startTime: 0,
        endTime: 180,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Ingredients",
      },
      {
        id: "2",
        title: "Making Curry Paste",
        startTime: 181,
        endTime: 420,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Curry+Paste",
      },
      {
        id: "3",
        title: "Cooking the Base",
        startTime: 421,
        endTime: 600,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Cooking+Base",
      },
      {
        id: "4",
        title: "Adding Vegetables & Protein",
        startTime: 601,
        endTime: 780,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Adding+Ingredients",
      },
      {
        id: "5",
        title: "Final Seasoning & Serving",
        startTime: 781,
        endTime: 885,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Final+Seasoning",
      },
    ],
  },
  {
    id: "strength-training",
    title: "Full Body Strength Training",
    creator: "Trainer Mike",
    username: "trainermike",
    duration: "35:00",
    thumbnail: "/placeholder.svg?height=800&width=450&text=Strength+Training",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    chapterCount: 7,
    category: "Fitness",
    description:
      "Complete full-body strength workout! Build muscle and increase power with proper form demonstrations. #strength #training #muscle #fitness #workout",
    views: "756K",
    likes: "54K",
    totalDuration: 2100,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    chapters: [
      {
        id: "1",
        title: "Dynamic Warm-Up",
        startTime: 0,
        endTime: 300,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Dynamic+Warmup",
      },
      {
        id: "2",
        title: "Chest & Triceps",
        startTime: 301,
        endTime: 600,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Chest+Triceps",
      },
      {
        id: "3",
        title: "Back & Biceps",
        startTime: 601,
        endTime: 900,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Back+Biceps",
      },
      {
        id: "4",
        title: "Shoulders",
        startTime: 901,
        endTime: 1200,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Shoulders",
      },
      {
        id: "5",
        title: "Legs & Glutes",
        startTime: 1201,
        endTime: 1650,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Legs+Glutes",
      },
      {
        id: "6",
        title: "Core Strengthening",
        startTime: 1651,
        endTime: 1950,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Core",
      },
      {
        id: "7",
        title: "Cool Down Stretch",
        startTime: 1951,
        endTime: 2100,
        thumbnail: "/placeholder.svg?height=120&width=200&text=Cool+Down",
      },
    ],
  },
]

export default function FeedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetVideoId = searchParams.get("video")
  const tagContext = searchParams.get("tag")
  const userContext = searchParams.get("user")

  const [feedType, setFeedType] = useState<"foryou" | "following">("foryou")
  const [showChapterSelector, setShowChapterSelector] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videos, setVideos] = useState(mockVideos)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareVideoIndex, setShareVideoIndex] = useState<number | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentVideoIndex, setCommentVideoIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Determine the feed mode
  const isContextualFeed = tagContext || userContext

  // Filter videos based on context or default feed type
  const displayVideos = (() => {
    if (tagContext) {
      return videos.filter((video) => video.category.toLowerCase() === tagContext.toLowerCase())
    }
    if (userContext) {
      const userVideos = videos.filter((video) => video.username.toLowerCase() === userContext.toLowerCase())

      // If coming from profile page with index, reorder videos to start from selected index
      const videoIndex = searchParams.get("index")
      const totalVideos = searchParams.get("total")

      if (videoIndex && totalVideos) {
        const startIndex = Number.parseInt(videoIndex)
        const total = Number.parseInt(totalVideos)

        // Create a reordered array starting from the selected video
        const reorderedVideos = []
        for (let i = 0; i < total; i++) {
          const currentIndex = (startIndex + i) % userVideos.length
          if (userVideos[currentIndex]) {
            reorderedVideos.push(userVideos[currentIndex])
          }
        }
        return reorderedVideos.length > 0 ? reorderedVideos : userVideos
      }

      return userVideos
    }
    return feedType === "following" ? videos.filter((video) => video.isFollowing) : videos
  })()

  // Handle direct video linking
  useEffect(() => {
    if (targetVideoId) {
      const videoIndex = displayVideos.findIndex((video) => video.id === targetVideoId)
      if (videoIndex !== -1) {
        setPlayingVideoIndex(videoIndex)
        // Scroll to the video
        setTimeout(() => {
          const videoElement = document.querySelector(`[data-video-id="${targetVideoId}"]`)
          if (videoElement) {
            videoElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
      }
    }
  }, [targetVideoId, displayVideos])

  // Update progress
  useEffect(() => {
    const updateProgress = () => {
      if (playingVideoIndex !== null) {
        const video = videoRefs.current[playingVideoIndex]
        if (video) {
          setCurrentTime(video.currentTime)
          setDuration(video.duration || displayVideos[playingVideoIndex].totalDuration)
        }
      }
    }

    const interval = setInterval(updateProgress, 100)
    return () => clearInterval(interval)
  }, [playingVideoIndex, displayVideos])

  const safePlay = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      if (!document.contains(videoElement)) {
        return
      }

      videoRefs.current.forEach((video, index) => {
        if (video && video !== videoElement && !video.paused) {
          video.pause()
        }
      })

      await videoElement.play()
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Video play was interrupted")
        } else if (error.name === "NotAllowedError") {
          console.log("Video play was not allowed (user interaction required)")
        } else {
          console.log("Video play error:", error.message)
        }
      }
    }
  }, [])

  // Add this after the existing useEffect hooks, around line 280
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Video needs to be 50% visible to play
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const videoElement = entry.target as HTMLElement
        const videoId = videoElement.getAttribute("data-video-id")
        const videoIndex = displayVideos.findIndex((video) => video.id === videoId)

        if (videoIndex !== -1) {
          const video = videoRefs.current[videoIndex]

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Video is in view - but don't auto-play, just prepare it
            if (video && playingVideoIndex === videoIndex) {
              // Only resume if this was the playing video
              safePlay(video)
            }
          } else {
            // Video is out of view - pause it
            if (video && !video.paused) {
              video.pause()
              if (playingVideoIndex === videoIndex) {
                setIsPlaying(false)
                setPlayingVideoIndex(null)
                setIsMinimized(false)
              }
            }
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // Observe all video containers
    const videoContainers = document.querySelectorAll("[data-video-id]")
    videoContainers.forEach((container) => observer.observe(container))

    return () => {
      observer.disconnect()
    }
  }, [displayVideos, playingVideoIndex])

  const handleLike = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const actualVideoId = displayVideos[videoIndex].id
    setVideos((prev) =>
      prev.map((video) => (video.id === actualVideoId ? { ...video, isLiked: !video.isLiked } : video)),
    )
  }

  const handleSave = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const actualVideoId = displayVideos[videoIndex].id
    setVideos((prev) =>
      prev.map((video) => (video.id === actualVideoId ? { ...video, isSaved: !video.isSaved } : video)),
    )
  }

  const handleFollow = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Follow button clicked for video index:", videoIndex)
    const actualVideoId = displayVideos[videoIndex].id
    setVideos((prev) =>
      prev.map((video) => (video.id === actualVideoId ? { ...video, isFollowing: !video.isFollowing } : video)),
    )
  }

  const handleShare = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShareVideoIndex(videoIndex)
    setShowShareModal(true)
  }

  const handleComment = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCommentVideoIndex(videoIndex)
    setShowCommentModal(true)
  }

  const copyToClipboard = async () => {
    if (shareVideoIndex !== null) {
      const video = displayVideos[shareVideoIndex]
      const url = `${window.location.origin}/video/${video.id}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWatchWithChapters = (videoIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVideoIndex(videoIndex)
    setShowChapterSelector(true)
  }

  const handleChapterSelect = useCallback(
    async (chapterStartTime: number) => {
      if (selectedVideoIndex !== null) {
        const videoElement = videoRefs.current[selectedVideoIndex]
        if (videoElement && document.contains(videoElement)) {
          try {
            videoElement.currentTime = chapterStartTime
            setPlayingVideoIndex(selectedVideoIndex)
            await safePlay(videoElement)
            setIsPlaying(true)
          } catch (error) {
            console.log("Error setting chapter time:", error)
          }
        }
      }
      setShowChapterSelector(false)
    },
    [selectedVideoIndex],
  )

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (selectedVideoIndex !== null) {
        const videoElement = videoRefs.current[selectedVideoIndex]
        if (videoElement && document.contains(videoElement)) {
          const rect = e.currentTarget.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          const percentage = clickX / rect.width
          const newTime = percentage * duration
          videoElement.currentTime = newTime
          setCurrentTime(newTime)
        }
      }
    },
    [selectedVideoIndex, duration],
  )

  // Also update the handlePlayPause function to work better with scrolling
  const handlePlayPause = useCallback(
    async (videoIndex: number) => {
      const videoElement = videoRefs.current[videoIndex]
      if (videoElement && document.contains(videoElement)) {
        // Pause all other videos first
        videoRefs.current.forEach((video, index) => {
          if (video && index !== videoIndex && !video.paused) {
            video.pause()
          }
        })

        if (isPlaying && playingVideoIndex === videoIndex) {
          videoElement.pause()
          setIsPlaying(false)
          setPlayingVideoIndex(null)
          setIsMinimized(false)
        } else {
          setPlayingVideoIndex(videoIndex)
          await safePlay(videoElement)
          setIsPlaying(true)
          setIsMinimized(false)
        }
      }
    },
    [isPlaying, playingVideoIndex],
  )

  const handleVideoClick = (videoIndex: number) => {
    if (playingVideoIndex === videoIndex && isPlaying) {
      // If video is playing, toggle minimize state
      setIsMinimized(!isMinimized)
    } else {
      // If video is not playing, start playing
      handlePlayPause(videoIndex)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-transparent">
        {isContextualFeed ? (
          <div className="flex items-center p-4">
            <button onClick={() => router.back()} className="mr-3 text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white">{tagContext ? `#${tagContext}` : `@${userContext}`}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3">
            <div className="flex space-x-1">
              <button
                onClick={() => setFeedType("foryou")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  feedType === "foryou"
                    ? "border border-white text-white bg-transparent"
                    : "text-white hover:text-white/70 bg-transparent"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => setFeedType("following")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  feedType === "following"
                    ? "border border-white text-white bg-transparent"
                    : "text-white hover:text-white/70 bg-transparent"
                }`}
              >
                Following
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Feed */}
      <div className={`pb-14 snap-y snap-mandatory overflow-y-scroll h-screen ${isContextualFeed ? "pt-12" : "pt-16"}`}>
        {displayVideos.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">👥</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
                <p className="text-slate-400 text-sm">
                  {feedType === "following"
                    ? "Follow some creators to see their content here"
                    : "Check back later for new content"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          displayVideos.map((video, videoIndex) => (
            <div
              key={video.id}
              className="relative h-screen snap-start flex items-center justify-center"
              data-video-id={video.id}
            >
              {/* Background Video/Image */}
              <div className="absolute inset-0" onClick={() => handleVideoClick(videoIndex)}>
                {playingVideoIndex === videoIndex ? (
                  <video
                    ref={(el) => (videoRefs.current[videoIndex] = el)}
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false)
                      setPlayingVideoIndex(null)
                      setIsMinimized(false)
                    }}
                    onError={(e) => {
                      console.log("Video error:", e)
                      setIsPlaying(false)
                      setPlayingVideoIndex(null)
                      setIsMinimized(false)
                    }}
                  />
                ) : (
                  <>
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <video
                      ref={(el) => (videoRefs.current[videoIndex] = el)}
                      src={video.videoUrl}
                      className="hidden"
                      preload="metadata"
                    />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* Content Overlay - Hidden when minimized and playing */}
              {!(isMinimized && playingVideoIndex === videoIndex && isPlaying) && (
                <>
                  {/* Main Content Area */}
                  <div className="relative z-10 w-full h-full flex">
                    <div className="flex-1 flex items-center justify-center">
                      <button onClick={() => handlePlayPause(videoIndex)} className="group">
                        <div className="relative">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            {isPlaying && playingVideoIndex === videoIndex ? (
                              <Pause className="w-8 h-8 text-white" fill="currentColor" />
                            ) : (
                              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                            )}
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Right Sidebar - Actions */}
                    <div className="w-16 flex flex-col items-center justify-end pb-32 space-y-6">
                      <button
                        onClick={(e) => handleLike(videoIndex, e)}
                        className="flex flex-col items-center space-y-1 group"
                      >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Heart className={`w-6 h-6 ${video.isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                        </div>
                        <span className="text-xs text-white font-medium">{video.likes}</span>
                      </button>

                      <button
                        onClick={(e) => handleComment(videoIndex, e)}
                        className="flex flex-col items-center space-y-1 group"
                      >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-white font-medium">Comment</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(videoIndex, e)}
                        className="flex flex-col items-center space-y-1 group"
                      >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Share className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-white font-medium">Share</span>
                      </button>

                      <button
                        onClick={(e) => handleSave(videoIndex, e)}
                        className="flex flex-col items-center space-y-1 group"
                      >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Bookmark
                            className={`w-6 h-6 ${video.isSaved ? "text-yellow-500 fill-yellow-500" : "text-white"}`}
                          />
                        </div>
                        <span className="text-xs text-white font-medium">Save</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-16 left-0 right-16 p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-primary text-primary-foreground">{video.category}</Badge>
                      <div className="flex items-center text-white/80 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center text-white/80 text-sm">
                        <span>{video.chapterCount} chapters</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/profile/${video.username}`}
                          className="flex items-center space-x-2 group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-white/50 transition-all">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium group-hover:underline">@{video.username}</span>
                        </Link>
                        <Button
                          onClick={(e) => handleFollow(videoIndex, e)}
                          size="sm"
                          variant="outline"
                          className={`text-xs h-6 px-2 ${
                            video.isFollowing
                              ? "bg-slate-700 text-white border-slate-600"
                              : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                          }`}
                        >
                          {video.isFollowing ? "Following" : "Follow"}
                        </Button>
                      </div>

                      <h2 className="text-white text-lg font-bold leading-tight">{video.title}</h2>
                      <div className="text-white/90 text-sm leading-relaxed max-w-md">
                        {video.description.split(/(\s+)/).map((word, index) => {
                          // Check if word is a hashtag
                          if (word.startsWith("#")) {
                            return (
                              <Link
                                key={index}
                                href={`/feed?tag=${word.slice(1)}`}
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {word}
                              </Link>
                            )
                          }
                          // Check if word is a mention
                          else if (word.startsWith("@")) {
                            return (
                              <Link
                                key={index}
                                href={`/profile/${word.slice(1)}`}
                                className="text-purple-400 hover:text-purple-300 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {word}
                              </Link>
                            )
                          }
                          // Check if word is a URL
                          else if (word.match(/^https?:\/\/.+/)) {
                            return (
                              <a
                                key={index}
                                href={word}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {word}
                              </a>
                            )
                          }
                          // Regular text
                          else {
                            return <span key={index}>{word}</span>
                          }
                        })}
                      </div>

                      <div className="flex items-center space-x-4 text-white/70 text-sm">
                        <span>{video.views} views</span>
                        <span>•</span>
                        <span>{video.likes} likes</span>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <Button
                      onClick={(e) => handleWatchWithChapters(videoIndex, e)}
                      className="w-full mt-4 bg-white text-black hover:bg-white/90 font-medium relative z-10"
                    >
                      Jump to Chapters
                    </Button>
                  </div>

                  {/* Minimize/Maximize Button - Only show when video is playing and NOT minimized */}
                  {playingVideoIndex === videoIndex && isPlaying && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsMinimized(!isMinimized)
                      }}
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Minimize2 className="w-5 h-5 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        videoTitle={commentVideoIndex !== null ? displayVideos[commentVideoIndex]?.title || "" : ""}
      />

      {/* Share Modal */}
      {showShareModal && shareVideoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Share Video</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-white" />}
                <span className="text-white">{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Send className="w-5 h-5 text-white" />
                <span className="text-white">Send to Friends</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Selector Overlay */}
      {showChapterSelector && selectedVideoIndex !== null && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
            showChapterSelector ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl transform transition-transform duration-300 ${
              showChapterSelector ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white text-lg font-semibold">Jump to Chapter</h3>
              <button
                onClick={() => setShowChapterSelector(false)}
                className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video Timeline */}
            <div className="px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between text-white text-sm mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Progress Bar with Chapter Markers */}
              <div className="relative">
                <div className="w-full h-2 bg-slate-700 rounded-full cursor-pointer" onClick={handleTimelineClick}>
                  {/* Progress */}
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />

                  {/* Chapter Markers */}
                  {displayVideos[selectedVideoIndex].chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="absolute top-0 w-1 h-2 bg-white/60 rounded-full"
                      style={{ left: `${duration > 0 ? (chapter.startTime / duration) * 100 : 0}%` }}
                      title={chapter.title}
                    />
                  ))}
                </div>

                {/* Current Time Indicator */}
                <div
                  className="absolute -top-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white"
                  style={{
                    left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {displayVideos[selectedVideoIndex].chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.startTime)}
                    className="flex-shrink-0 group"
                  >
                    <div className="w-48 space-y-2">
                      {/* Chapter Thumbnail */}
                      <div className="relative">
                        <img
                          src={chapter.thumbnail || "/placeholder.svg"}
                          alt={chapter.title}
                          className="w-full h-28 object-cover rounded-lg group-hover:ring-2 group-hover:ring-white transition-all"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatTime(chapter.startTime)}
                        </div>
                      </div>

                      {/* Chapter Info */}
                      <div className="text-left">
                        <div className="text-white/60 text-xs mb-1">Chapter {index + 1}</div>
                        <h4 className="text-white text-sm font-medium leading-tight line-clamp-2">{chapter.title}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
