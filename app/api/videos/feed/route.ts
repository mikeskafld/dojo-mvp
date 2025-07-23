import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        *,
        uploader:user_profiles!uploader_id(
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        ),
        chapters(
          id,
          title,
          start_time_seconds,
          end_time_seconds,
          chapter_order
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    
    // Transform to match frontend expectations
    const transformedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      uploader: {
        id: video.uploader.id,
        username: video.uploader.username,
        displayName: video.uploader.display_name,
        avatarUrl: video.uploader.avatar_url,
        isVerified: video.uploader.is_verified
      },
      uploadDate: video.created_at,
      thumbnailUrl: video.thumbnail_url,
      videoUrl: video.video_url,
      chapters: video.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        startTime: chapter.start_time_seconds,
        endTime: chapter.end_time_seconds,
        order: chapter.chapter_order
      })),
      viewCount: video.view_count,
      likeCount: video.like_count,
      processingStatus: video.processing_status
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedVideos,
      pagination: {
        page,
        limit,
        hasMore: videos.length === limit
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
