"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, Edit3, Play } from "lucide-react"
import VideoPlayer from "@/components/VideoPlayer"
import ChapterList from "@/components/ChapterList"
import BottomNavigation from "@/components/BottomNavigation"

interface Chapter {
  id: string
  title: string
  startTime: number
  endTime: number
}

export default function ReviewPage() {
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "Opening Scene", startTime: 0, endTime: 120 },
    { id: "2", title: "Character Introduction", startTime: 121, endTime: 240 },
    { id: "3", title: "Forest Adventure", startTime: 241, endTime: 360 },
    { id: "4", title: "Action Sequence", startTime: 361, endTime: 480 },
    { id: "5", title: "Finale", startTime: 481, endTime: 596 },
  ])

  const handleChapterUpdate = (updatedChapters: Chapter[]) => {
    setChapters(updatedChapters)
  }

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: "New Chapter",
      startTime: 0,
      endTime: 60,
    }
    setChapters([...chapters, newChapter])
  }

  const handleCancel = () => {
    router.push("/upload")
  }

  const handlePublish = () => {
    console.log("Publishing chapters:", chapters)
    // Simulate publishing process
    setTimeout(() => {
      // Redirect to profile page after publishing
      router.push("/profile")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Review Chapters</h1>
          <button onClick={handleCancel} className="p-1">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Chapters Generated!</h2>
              <p className="text-slate-400 text-sm">Review and edit your chapters, then publish your video</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-sm">Big Buck Bunny</h3>
                  <p className="text-xs text-slate-400">10:00 • 5 chapters</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <VideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full rounded-lg"
              />
            </div>
          </div>

          {/* Chapter List */}
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-sm">Edit Chapters</h3>
              </div>
              <Button
                onClick={handleAddChapter}
                variant="outline"
                size="sm"
                className="bg-transparent border-slate-600 text-xs h-8 px-3"
              >
                Add Chapter
              </Button>
            </div>
            <ChapterList chapters={chapters} editable={true} onChaptersChange={handleChapterUpdate} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePublish}
              className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-medium"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Publish Timeline
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 h-12"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Upload
            </Button>
          </div>

          {/* Publishing Info */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">What happens next?</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Your video will be published to your profile</li>
              <li>• Viewers can jump between chapters</li>
              <li>• You can edit chapters anytime</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
