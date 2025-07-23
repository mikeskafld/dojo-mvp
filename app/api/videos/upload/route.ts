import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { features } from '@/lib/config/features'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('video') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string || null
    const autoGenerateChapters = formData.get('autoGenerate') === 'true'
    
    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate video file
    const maxSize = 500 * 1024 * 1024 // 500MB
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 500MB limit' }, { status: 400 })
    }
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Supported: MP4, MOV, AVI' }, { status: 400 })
    }
    
    // Generate unique video ID
    const videoId = crypto.randomUUID()
    const fileExt = file.name.split('.').pop()
    const fileName = `${videoId}.${fileExt}`
    const filePath = `${user.id}/${fileName}`
    
    // Upload video to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      throw uploadError
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath)
    
    // Create video record
    const { data: video, error: dbError } = await supabase
      .from('videos')
      .insert({
        id: videoId,
        title,
        description,
        uploader_id: user.id,
        video_url: publicUrl,
        file_size_bytes: file.size,
        mime_type: file.type,
        processing_status: 'pending',
        ai_processing_status: features.aiChapterDetection && autoGenerateChapters ? 'queued' : 'not_started'
      })
      .select()
      .single()
    
    if (dbError) {
      throw dbError
    }
    
    // Future: Queue AI processing if enabled
    if (features.aiChapterDetection && autoGenerateChapters) {
      console.log('AI processing would be queued here for video:', videoId)
    }
    
    return NextResponse.json({
      success: true,
      data: video
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
