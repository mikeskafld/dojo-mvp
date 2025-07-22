"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X } from "lucide-react"

interface Chapter {
  id: string
  title: string
  startTime: number
  endTime: number
}

interface ChapterListProps {
  chapters: Chapter[]
  editable?: boolean
  onChaptersChange?: (chapters: Chapter[]) => void
  onChapterClick?: (startTime: number) => void
}

export default function ChapterList({
  chapters,
  editable = false,
  onChaptersChange,
  onChapterClick,
}: ChapterListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editStartTime, setEditStartTime] = useState("")
  const [editEndTime, setEditEndTime] = useState("")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const parseTime = (timeStr: string) => {
    const [mins, secs] = timeStr.split(":").map(Number)
    return mins * 60 + secs
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingId(chapter.id)
    setEditTitle(chapter.title)
    setEditStartTime(formatTime(chapter.startTime))
    setEditEndTime(formatTime(chapter.endTime))
  }

  const handleSave = () => {
    if (!onChaptersChange || !editingId) return

    const updatedChapters = chapters.map((chapter) =>
      chapter.id === editingId
        ? {
            ...chapter,
            title: editTitle,
            startTime: parseTime(editStartTime),
            endTime: parseTime(editEndTime),
          }
        : chapter,
    )

    onChaptersChange(updatedChapters)
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (!onChaptersChange) return
    const updatedChapters = chapters.filter((chapter) => chapter.id !== id)
    onChaptersChange(updatedChapters)
  }

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="border rounded-lg p-3">
          {editingId === chapter.id ? (
            <div className="space-y-3">
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Chapter title" />
              <div className="grid grid-cols-2 gap-2">
                <Input value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} placeholder="0:00" />
                <Input value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} placeholder="0:00" />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div
                className={`flex-1 ${!editable && onChapterClick ? "cursor-pointer hover:text-primary" : ""}`}
                onClick={() => !editable && onChapterClick && onChapterClick(chapter.startTime)}
              >
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium">{chapter.title}</h4>
                    <p className="text-sm text-slate-500">
                      {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {editable && (
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(chapter)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(chapter.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
