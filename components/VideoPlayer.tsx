"use client"

import { forwardRef, useState } from "react"
import { AlertCircle } from "lucide-react"

interface VideoPlayerProps {
  src: string
  className?: string
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ src, className = "" }, ref) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Use a working placeholder video URL
  const videoSrc =
    src === "/placeholder-video.mp4"
      ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      : src

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={`bg-slate-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Unable to load video</p>
          <p className="text-sm text-slate-500 mt-1">Please check the video source</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      )}
      <video
        ref={ref}
        src={videoSrc}
        controls
        className={`rounded-lg w-full ${isLoading ? "opacity-0" : "opacity-100"}`}
        preload="metadata"
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
})

VideoPlayer.displayName = "VideoPlayer"

export default VideoPlayer
