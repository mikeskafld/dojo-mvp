"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadDropzoneProps {
  onUpload: (file: File) => void
}

export default function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        setError("Please upload a valid video file (MP4, MOV, AVI)")
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        // Check file size (max 500MB)
        if (file.size > 500 * 1024 * 1024) {
          setError("File size must be less than 500MB")
          return
        }

        onUpload(file)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple: false,
    noClick: true,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-slate-400"}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-slate-400" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isDragActive ? "Drop your video here" : "Upload your video"}
            </h3>
            <p className="text-slate-400 mb-4">Drag and drop your video file here, or click to browse</p>
            <Button onClick={open} variant="outline" className="bg-white text-black hover:bg-white/90">
              <File className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>

          <div className="text-xs text-slate-400">Supported formats: MP4, MOV, AVI • Max size: 500MB</div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
