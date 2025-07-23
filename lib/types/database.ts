// Frontend-facing types that match existing component expectations
export interface User {
  id: string
  username: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  isVerified: boolean
  followersCount: number
  followingCount: number
  isFollowing?: boolean
  isSubscribed?: boolean
}

export interface Video {
  id: string
  title: string
  description?: string
  uploader: User
  uploadDate: string
  thumbnailUrl?: string
  videoUrl: string
  chapters: Chapter[]
  viewCount: number
  likeCount: number
  processingStatus: 'pending' | 'processing' | 'complete' | 'error'
  aiProcessingStatus?: 'not_started' | 'queued' | 'processing' | 'complete' | 'error'
}

export interface Chapter {
  id: string
  videoId: string
  title: string
  description?: string
  startTime: number // seconds
  endTime: number // seconds
  order: number
  thumbnailUrl?: string
  isAiGenerated: boolean
  confidenceScore?: number
}

export interface Comment {
  id: string
  videoId: string
  chapterId?: string
  author: User
  content: string
  createdAt: string
  parentId?: string
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          uploader_id: string
          video_url: string
          thumbnail_url: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          mime_type: string | null
          processing_status: string
          ai_processing_status: string
          ai_job_id: string | null
          view_count: number
          like_count: number
          is_public: boolean
          tags: string[] | null
          metadata: any | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          uploader_id: string
          video_url: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          mime_type?: string | null
          processing_status?: string
          ai_processing_status?: string
          ai_job_id?: string | null
          view_count?: number
          like_count?: number
          is_public?: boolean
          tags?: string[] | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          uploader_id?: string
          video_url?: string
          thumbnail_url?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          mime_type?: string | null
          processing_status?: string
          ai_processing_status?: string
          ai_job_id?: string | null
          view_count?: number
          like_count?: number
          is_public?: boolean
          tags?: string[] | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      chapters: {
        Row: {
          id: string
          video_id: string
          title: string
          description: string | null
          start_time_seconds: number
          end_time_seconds: number
          chapter_order: number
          thumbnail_url: string | null
          is_ai_generated: boolean
          confidence_score: number | null
          ai_metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          title: string
          description?: string | null
          start_time_seconds: number
          end_time_seconds: number
          chapter_order: number
          thumbnail_url?: string | null
          is_ai_generated?: boolean
          confidence_score?: number | null
          ai_metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          title?: string
          description?: string | null
          start_time_seconds?: number
          end_time_seconds?: number
          chapter_order?: number
          thumbnail_url?: string | null
          is_ai_generated?: boolean
          confidence_score?: number | null
          ai_metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
