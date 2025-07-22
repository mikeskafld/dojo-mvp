"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Heart, Send, Reply, User } from "lucide-react"
import Link from "next/link"

interface Comment {
  id: string
  username: string
  text: string
  likes: number
  isLiked: boolean
  timestamp: string
  replies?: Comment[]
  parentId?: string // Add parentId
  parentUsername?: string // Add parentUsername
}

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  videoTitle: string
}

const mockComments: Comment[] = [
  {
    id: "1",
    username: "animationfan",
    text: "This is absolutely amazing! The animation quality is incredible 🔥",
    likes: 24,
    isLiked: false,
    timestamp: "2h",
    replies: [
      {
        id: "1-1",
        username: "blenderfoundation",
        text: "Thank you so much! We're glad you enjoyed it!",
        likes: 8,
        isLiked: false,
        timestamp: "1h",
        replies: [
          {
            id: "1-1-1",
            username: "animationfan",
            text: "Keep up the amazing work! Can't wait for the next one 🎬",
            likes: 3,
            isLiked: false,
            timestamp: "45m",
          },
        ],
      },
      {
        id: "1-2",
        username: "3dartist",
        text: "I agree! The lighting is phenomenal",
        likes: 5,
        isLiked: false,
        timestamp: "1h",
      },
    ],
  },
  {
    id: "2",
    username: "blenderfoundation",
    text: "How long did this take to render? The lighting is perfect!",
    likes: 12,
    isLiked: true,
    timestamp: "4h",
  },
  {
    id: "3",
    username: "creativestudio",
    text: "Tutorial please! Would love to learn this technique",
    likes: 8,
    isLiked: false,
    timestamp: "6h",
  },
  {
    id: "4",
    username: "motiondesigner",
    text: "The character design is so cute! Big Buck Bunny never gets old ❤️",
    likes: 31,
    isLiked: false,
    timestamp: "8h",
  },
]

export default function CommentModal({ isOpen, onClose, videoTitle }: CommentModalProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleLikeComment = (commentId: string, path: string[] = []) => {
    setComments((prev) => {
      const updateCommentLike = (comments: Comment[], targetId: string, currentPath: string[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === targetId && currentPath.length === 0) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          } else if (comment.replies && currentPath.length > 0 && comment.id === currentPath[0]) {
            return {
              ...comment,
              replies: updateCommentLike(comment.replies, targetId, currentPath.slice(1)),
            }
          }
          return comment
        })
      }

      return updateCommentLike(prev, commentId, path)
    })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        username: "johndoe",
        text: newComment,
        likes: 0,
        isLiked: false,
        timestamp: "now",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const handleAddReply = (targetId: string, path: string[] = []) => {
    if (replyText.trim()) {
      // Find the parent comment to get its username
      const findCommentById = (comments: Comment[], id: string): Comment | undefined => {
        for (const comment of comments) {
          if (comment.id === id) return comment
          if (comment.replies) {
            const found = findCommentById(comment.replies, id)
            if (found) return found
          }
        }
        return undefined
      }

      const parentComment = findCommentById(comments, targetId)

      const reply: Comment = {
        id: `${targetId}-${Date.now()}`,
        username: "johndoe",
        text: replyText,
        likes: 0,
        isLiked: false,
        timestamp: "now",
        parentId: targetId, // Set parentId
        parentUsername: parentComment?.username, // Set parentUsername
      }

      setComments((prev) => {
        const addReplyToComment = (comments: Comment[], targetId: string, currentPath: string[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === targetId && currentPath.length === 0) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply],
              }
            } else if (comment.replies && currentPath.length > 0 && comment.id === currentPath[0]) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies, targetId, currentPath.slice(1)),
              }
            }
            return comment
          })
        }

        return addReplyToComment(prev, targetId, path)
      })

      setReplyText("")
      setReplyingTo(null)
    }
  }

  const renderComment = (comment: Comment, depth = 0, path: string[] = []) => {
    const isReplying = replyingTo === comment.id
    const maxDepth = 3 // Limit nesting depth

    return (
      <div key={comment.id} className="space-y-3">
        {/* Comment */}
        <div className={`flex space-x-3 ${depth > 0 ? "ml-6" : ""}`}>
          <Link href={`/profile/${comment.username}`}>
            <div
              className={`${
                depth === 0 ? "w-8 h-8" : depth === 1 ? "w-6 h-6" : "w-5 h-5"
              } bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-white/50 transition-all`}
            >
              <User className={`${depth === 0 ? "w-4 h-4" : depth === 1 ? "w-3 h-3" : "w-2.5 h-2.5"} text-white`} />
            </div>
          </Link>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Link href={`/profile/${comment.username}`} className="hover:underline">
                <span className={`text-white font-medium ${depth === 0 ? "text-sm" : "text-xs"}`}>
                  {comment.username}
                </span>
              </Link>
              {comment.parentUsername && (
                <span className="text-slate-400 text-xs">
                  <span className="mx-1">▶</span>
                  <Link href={`/profile/${comment.parentUsername}`} className="hover:underline">
                    {comment.parentUsername}
                  </Link>
                </span>
              )}
              <span className="text-slate-400 text-xs">{comment.timestamp}</span>
            </div>
            <p className={`text-white ${depth === 0 ? "text-sm" : "text-xs"} mb-2`}>{comment.text}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLikeComment(comment.id, path)}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
              >
                <Heart
                  className={`${depth === 0 ? "w-4 h-4" : "w-3 h-3"} ${
                    comment.isLiked ? "text-red-500 fill-red-500" : ""
                  }`}
                  fill={comment.isLiked ? "currentColor" : "none"}
                />
                <span className="text-xs">{comment.likes}</span>
              </button>
              {depth < maxDepth && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Reply className={`${depth === 0 ? "w-4 h-4" : "w-3 h-3"}`} />
                  <span className="text-xs">Reply</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className={`${depth > 0 ? "ml-9" : "ml-11"} flex items-center space-x-2`}>
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.username}...`}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddReply(comment.id, path)}
            />
            <Button
              onClick={() => handleAddReply(comment.id, path)}
              size="sm"
              disabled={!replyText.trim()}
              className="bg-white text-black hover:bg-white/90 disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1, [...path, comment.id]))}
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div
        className={`absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-white text-lg font-semibold">Comments</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="space-y-4">{comments.map((comment) => renderComment(comment))}</div>
        </div>

        {/* Comment Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <Button
                onClick={handleAddComment}
                size="sm"
                disabled={!newComment.trim()}
                className="bg-white text-black hover:bg-white/90 disabled:bg-slate-700 disabled:text-slate-400"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
