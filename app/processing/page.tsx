"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Brain, Video, Scissors, Sparkles } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

const processingSteps = [
  { id: 1, title: "Analyzing video content", icon: Video, description: "Scanning your video for key moments" },
  { id: 2, title: "Detecting scene changes", icon: Scissors, description: "Finding natural break points" },
  { id: 3, title: "AI chapter generation", icon: Brain, description: "Creating intelligent chapters" },
  { id: 4, title: "Finalizing timeline", icon: Sparkles, description: "Polishing your chapters" },
]

export default function ProcessingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate processing steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval)
          // Auto-redirect after completion
          setTimeout(() => {
            router.push("/review")
          }, 2000)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [router])

  const handleCancel = () => {
    router.push("/upload")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Processing Video</h1>
          <button onClick={handleCancel} className="p-1">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-8">
          {/* Progress Circle */}
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-purple-500 transition-all duration-300"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((progress * 3.6 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((progress * 3.6 - 90) * Math.PI) / 180)}%, 50% 50%)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{Math.round(progress)}%</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Generating your chapters...</h2>
              <p className="text-slate-400 text-sm">This usually takes 1-2 minutes</p>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="bg-slate-900 rounded-xl p-6 space-y-4">
            {processingSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : isCompleted
                        ? "bg-green-500/10"
                        : "bg-slate-800/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? "bg-purple-500" : isCompleted ? "bg-green-500" : "bg-slate-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-sm ${
                        isActive ? "text-white" : isCompleted ? "text-green-400" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                  {isActive && (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isCompleted && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-slate-500 text-center">
              Our AI is analyzing your video to create the perfect chapters
            </p>
          </div>

          {/* Cancel Button */}
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 h-12"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Upload
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
