"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  X,
  Camera,
  Video,
  RotateCcw,
  Zap,
  ZapOff,
  Music,
  Timer,
  Sparkles,
  Upload,
  Play,
  Square,
  Check,
  ImageIcon,
  Mic,
  MicOff,
  Circle,
} from "lucide-react"

interface VideoFile {
  id: string
  file: File
  url: string
  thumbnail: string
  duration: number
  name: string
}

// Mock gallery videos for demo
const mockGalleryVideos: VideoFile[] = [
  {
    id: "1",
    file: new File([], "video1.mp4"),
    url: "/placeholder.svg?height=400&width=300&text=Video+1",
    thumbnail: "/placeholder.svg?height=400&width=300&text=Video+1",
    duration: 120,
    name: "My Cooking Video",
  },
  {
    id: "2",
    file: new File([], "video2.mp4"),
    url: "/placeholder.svg?height=400&width=300&text=Video+2",
    thumbnail: "/placeholder.svg?height=400&width=300&text=Video+2",
    duration: 85,
    name: "Workout Session",
  },
  {
    id: "3",
    file: new File([], "video3.mp4"),
    url: "/placeholder.svg?height=400&width=300&text=Video+3",
    thumbnail: "/placeholder.svg?height=400&width=300&text=Video+3",
    duration: 200,
    name: "Guitar Practice",
  },
]

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentView, setCurrentView] = useState<"camera" | "gallery" | "preview">("camera")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [galleryVideos, setGalleryVideos] = useState<VideoFile[]>(mockGalleryVideos)
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        const video: VideoFile = {
          id: Date.now().toString() + Math.random(),
          file,
          url,
          thumbnail: url,
          duration: 0,
          name: file.name,
        }
        setGalleryVideos((prev) => [video, ...prev])
      }
    })
  }

  const selectVideoFromGallery = (video: VideoFile) => {
    setSelectedVideo(video)
    setCurrentView("preview")
  }

  const handleContinue = () => {
    if (selectedVideo) {
      router.push("/processing")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleClose = () => {
    router.back()
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 30) {
          // Auto-stop after 30 seconds for demo
          clearInterval(interval)
          setIsRecording(false)
          // Create a mock recorded video
          const mockVideo: VideoFile = {
            id: Date.now().toString(),
            file: new File([], "recording.mp4"),
            url: "/placeholder.svg?height=800&width=450&text=Recorded+Video",
            thumbnail: "/placeholder.svg?height=800&width=450&text=Recorded+Video",
            duration: prev,
            name: `Recording ${new Date().toLocaleTimeString()}`,
          }
          setSelectedVideo(mockVideo)
          setCurrentView("preview")
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Camera View */}
      {currentView === "camera" && (
        <>
          {/* Mock Camera Feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Grid overlay for camera feel */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>

            {/* Mock viewfinder content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 opacity-60">
                <Camera className="w-24 h-24 text-white mx-auto" />
                <p className="text-white text-lg">Camera Preview</p>
                <p className="text-white/70 text-sm">Point camera at your subject</p>
              </div>
            </div>

            {/* Focus indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-20 h-20 border-2 border-yellow-400 rounded-lg opacity-0 animate-pulse"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm ${
                    flashEnabled ? "bg-yellow-500" : "bg-black/50"
                  }`}
                >
                  {flashEnabled ? <Zap className="w-5 h-5 text-black" /> : <ZapOff className="w-5 h-5 text-white" />}
                </button>

                <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm ${
                    micEnabled ? "bg-black/50" : "bg-red-500"
                  }`}
                >
                  {micEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-red-500 px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-white font-mono text-lg">{formatTime(recordingTime)}</span>
              </div>
            </div>
          )}

          {/* Side Controls */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 space-y-6">
            <button
              onClick={() => setCameraFacing(cameraFacing === "user" ? "environment" : "user")}
              className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>

            <button className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
              <Music className="w-6 h-6 text-white" />
            </button>

            <button className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
              <Sparkles className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              {/* Gallery Button */}
              <button
                onClick={() => setCurrentView("gallery")}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-white" />
              </button>

              {/* Record Button */}
              <div className="relative">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                    isRecording ? "bg-red-500 scale-110" : "bg-transparent hover:scale-105"
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 text-white fill-white" />
                  ) : (
                    <Circle className="w-16 h-16 text-red-500 fill-red-500" />
                  )}
                </button>

                {/* Tap to record hint */}
                {!isRecording && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <span className="text-white text-xs opacity-70">Tap to record</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Camera Mode Selector */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-sm rounded-full px-6 py-2">
              <button className="text-white/60 text-sm">PHOTO</button>
              <button className="text-white font-semibold text-sm">VIDEO</button>
              <button className="text-white/60 text-sm">SLOW-MO</button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}

      {/* Gallery View */}
      {currentView === "gallery" && (
        <div className="absolute inset-0 bg-black">
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentView("camera")}>
                <X className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-bold text-white">Select Video</h1>
              <button onClick={() => fileInputRef.current?.click()} className="text-white text-sm">
                Import
              </button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="p-4">
            {galleryVideos.length === 0 ? (
              <div className="text-center py-20">
                <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
                <p className="text-slate-400 text-sm mb-6">Import videos or record new ones</p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-white/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Videos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {galleryVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => selectVideoFromGallery(video)}
                    className="aspect-[9/16] bg-slate-800 rounded-lg overflow-hidden relative group"
                  >
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatTime(video.duration)}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Preview View */}
      {currentView === "preview" && selectedVideo && (
        <div className="absolute inset-0 bg-black">
          {/* Video Preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={selectedVideo.thumbnail || "/placeholder.svg"}
              alt={selectedVideo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentView("gallery")}>
                <X className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-bold text-white">Preview</h1>
              <div />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-white text-lg font-semibold mb-1">{selectedVideo.name}</h3>
                <p className="text-slate-400 text-sm">Duration: {formatTime(selectedVideo.duration)}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setCurrentView("gallery")}
                  variant="outline"
                  className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                  Back
                </Button>
                <Button onClick={handleContinue} className="flex-1 bg-white text-black hover:bg-white/90">
                  <Check className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
