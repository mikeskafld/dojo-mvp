# Dojo MVP - Complete Implementation Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Frontend Implementation](#3-frontend-implementation)
4. [Backend Implementation](#4-backend-implementation)
5. [Database Implementation](#5-database-implementation)
6. [Shared Packages](#6-shared-packages)
7. [API Implementation Guide](#7-api-implementation-guide)
8. [Deployment Guide](#8-deployment-guide)

---

## 1. Project Overview

Dojo MVP is a monorepo application that transforms long-form videos into interactive, chapterized timelines. Built with Turborepo for efficient development and deployment.

### Technology Stack
- **Monorepo**: Turborepo
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL via Supabase
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth + JWT
- **Video Processing**: FFmpeg
- **Deployment**: Vercel (frontend), Railway (backend), Supabase (database + storage)

---

## 2. Monorepo Structure

```
dojo/
├── apps/
│   ├── web/                      # Next.js frontend
│   │   ├── app/                  # App Router pages
│   │   ├── components/           # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Frontend utilities
│   │   └── package.json
│   └── api/                      # Express.js backend
│       ├── src/
│       │   ├── routes/          # API routes
│       │   ├── controllers/     # Route controllers
│       │   ├── services/        # Business logic
│       │   ├── middlewares/     # Express middlewares
│       │   └── app.js
│       └── package.json
├── packages/
│   ├── database/                 # Shared database schemas & types
│   │   ├── schema/              # Knex migrations
│   │   ├── types/               # TypeScript types
│   │   └── package.json
│   ├── shared/                   # Shared utilities & constants
│   │   ├── constants/
│   │   ├── utils/
│   │   └── package.json
│   └── ui/                       # Shared UI components
│       ├── components/
│       └── package.json
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root package.json
├── pnpm-workspace.yaml          # PNPM workspace config
└── .env.example                  # Environment variables template
```

### Root Configuration Files

```json
// package.json
{
  "name": "dojo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "db:migrate": "turbo run db:migrate",
    "db:seed": "turbo run db:seed"
  },
  "devDependencies": {
    "turbo": "latest",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  },
  "packageManager": "pnpm@8.0.0"
}
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 3. Frontend Implementation

### 3.1 Frontend Structure (apps/web)

```
apps/web/
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to /feed)
│   ├── feed/                    # Main video feed
│   ├── browse/                  # Browse videos
│   ├── upload/                  # Upload interface
│   ├── review/                  # Chapter editing
│   ├── processing/              # Processing status
│   └── profile/[username]/      # User profiles
├── components/
│   ├── features/               # Feature-specific components
│   │   ├── ChapterList.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── UploadDropzone.tsx
│   └── ui/                     # UI primitives
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── supabase/              # Supabase client setup
│   │   ├── client.ts
│   │   └── storage.ts
│   └── utils.ts
└── package.json
```

### 3.2 Supabase Client Setup

```typescript
// apps/web/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@dojo/database/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// apps/web/lib/supabase/storage.ts
import { createClient } from './client'

export class StorageService {
  private supabase = createClient()
  
  async uploadVideo(file: File, userId: string) {
    const videoId = crypto.randomUUID()
    const fileExt = file.name.split('.').pop()
    const fileName = `${videoId}.${fileExt}`
    const filePath = `${userId}/${fileName}`
    
    const { data, error } = await this.supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    const { data: { publicUrl } } = this.supabase.storage
      .from('videos')
      .getPublicUrl(filePath)
    
    return {
      url: publicUrl,
      path: filePath,
      videoId
    }
  }
  
  async getUploadProgress(path: string) {
    // Implement progress tracking
    return 0
  }
}
```

### 3.3 Frontend Package.json

```json
// apps/web/package.json
{
  "name": "@dojo/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "tailwindcss": "^3.4.0",
    "@dojo/database": "workspace:*",
    "@dojo/shared": "workspace:*",
    "@dojo/ui": "workspace:*"
  }
}
```

---

## 4. Backend Implementation

### 4.1 Backend Structure (apps/api)

```
apps/api/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── video.routes.js
│   │   ├── chapter.routes.js
│   │   ├── user.routes.js
│   │   └── social.routes.js
│   ├── controllers/
│   ├── services/
│   │   ├── supabase.service.js
│   │   ├── video.service.js
│   │   └── chapter.service.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   └── app.js
├── package.json
└── .env
```

### 4.2 Environment Configuration

```env
# apps/api/.env
NODE_ENV=development
PORT=4000

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT (for additional security layer)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Redis (for queues and caching)
REDIS_URL=redis://localhost:6379
```

### 4.3 Supabase Service Setup

```javascript
// apps/api/src/services/supabase.service.js
const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  
  getClient() {
    return this.supabase;
  }
  
  async verifyUser(token) {
    const { data: { user }, error } = await this.supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  }
}

module.exports = new SupabaseService();
```

### 4.4 Video Service with Supabase Storage

```javascript
// apps/api/src/services/video.service.js
const supabaseService = require('./supabase.service');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

class VideoService {
  constructor() {
    this.supabase = supabaseService.getClient();
  }
  
  async createVideo(videoData, file, userId) {
    const videoId = uuidv4();
    
    try {
      // Upload video to Supabase Storage
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${videoId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('videos')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      // Extract video metadata
      const metadata = await this.extractVideoMetadata(file.buffer);
      
      // Create video record
      const { data: video, error: dbError } = await this.supabase
        .from('videos')
        .insert({
          id: videoId,
          title: videoData.title,
          description: videoData.description,
          uploader_id: userId,
          video_url: publicUrl,
          duration_seconds: metadata.duration,
          file_size_bytes: file.size,
          mime_type: file.mimetype,
          processing_status: 'pending',
          metadata: metadata
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      // Generate thumbnail asynchronously
      this.generateThumbnail(videoId, filePath, userId);
      
      // Create processing job
      await this.createProcessingJob(videoId);
      
      return video;
    } catch (error) {
      // Cleanup on error
      if (videoId) {
        await this.supabase.storage
          .from('videos')
          .remove([`${userId}/${videoId}.*`]);
      }
      throw error;
    }
  }
  
  async generateThumbnail(videoId, videoPath, userId) {
    try {
      // Download video temporarily for processing
      const { data: videoBuffer } = await this.supabase.storage
        .from('videos')
        .download(videoPath);
      
      // Extract frame at 10% of video duration
      const thumbnailBuffer = await this.extractFrame(videoBuffer);
      
      // Process with sharp
      const processedThumbnail = await sharp(thumbnailBuffer)
        .resize(640, 360, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();
      
      // Upload thumbnail
      const thumbnailPath = `${userId}/${videoId}_thumb.jpg`;
      const { error: uploadError } = await this.supabase.storage
        .from('thumbnails')
        .upload(thumbnailPath, processedThumbnail, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailPath);
      
      // Update video record
      await this.supabase
        .from('videos')
        .update({ thumbnail_url: publicUrl })
        .eq('id', videoId);
        
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    }
  }
  
  async getProcessingStatus(videoId) {
    const { data: job } = await this.supabase
      .from('processing_jobs')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    return {
      status: job?.status || 'unknown',
      progress: job?.progress || 0,
      error: job?.error_message
    };
  }
}

module.exports = new VideoService();
```

### 4.5 Backend Package.json

```json
// apps/api/package.json
{
  "name": "@dojo/api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "@supabase/supabase-js": "^2.39.0",
    "fluent-ffmpeg": "^2.1.2",
    "sharp": "^0.32.1",
    "bull": "^4.10.4",
    "redis": "^4.6.7",
    "socket.io": "^4.7.0",
    "@dojo/database": "workspace:*",
    "@dojo/shared": "workspace:*"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0"
  }
}
```

---

## 5. Database Implementation

### 5.1 Database Package Structure

```
packages/database/
├── schema/
│   ├── migrations/
│   │   ├── 001_initial_schema.js
│   │   ├── 002_add_chapters.js
│   │   └── 003_add_social.js
│   └── seeds/
│       └── initial_data.js
├── types/
│   ├── database.types.ts      # Generated from Supabase
│   └── index.ts
├── knexfile.js
└── package.json
```

### 5.2 Supabase Database Setup

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (managed by Supabase Auth)
-- Supabase creates auth.users automatically

-- Create public user profile
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    processing_status VARCHAR(20) DEFAULT 'pending',
    processing_progress INTEGER DEFAULT 0,
    processing_error TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Videos are viewable by everyone" ON videos
    FOR SELECT USING (is_public = true OR auth.uid() = uploader_id);

CREATE POLICY "Users can insert their own videos" ON videos
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their own videos" ON videos
    FOR UPDATE USING (auth.uid() = uploader_id);
```

### 5.3 Storage Buckets Setup

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('videos', 'videos', true),
    ('thumbnails', 'thumbnails', true),
    ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Users can upload videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'videos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Users can delete their own videos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'videos' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

---

## 6. Shared Packages

### 6.1 Shared Types Package

```typescript
// packages/shared/constants/index.ts
export const VIDEO_PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error',
  CANCELLED: 'cancelled'
} as const;

export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
```

```typescript
// packages/shared/utils/validation.ts
export function validateVideoFile(file: File) {
  if (file.size > MAX_VIDEO_SIZE) {
    return { valid: false, error: 'File size exceeds 500MB limit' };
  }
  
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  return { valid: true };
}
```

### 6.2 UI Components Package

```typescript
// packages/ui/components/VideoPlayer.tsx
import React from 'react';

export interface VideoPlayerProps {
  src: string;
  chapters?: Chapter[];
  onChapterClick?: (chapter: Chapter) => void;
}

export function VideoPlayer({ src, chapters, onChapterClick }: VideoPlayerProps) {
  // Shared video player implementation
  return (
    <div className="video-player">
      {/* Player implementation */}
    </div>
  );
}
```

---

## 7. API Implementation Guide

### 7.1 API Routes Structure

```javascript
// apps/api/src/routes/video.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middlewares/auth.middleware');
const videoController = require('../controllers/video.controller');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Routes
router.get('/feed', authenticate, videoController.getFeed);
router.get('/', videoController.getVideos);
router.post('/upload', authenticate, upload.single('video'), videoController.uploadVideo);
router.get('/:id/processing-status', authenticate, videoController.getProcessingStatus);
router.get('/:id', videoController.getVideo);
router.get('/:id/chapters', videoController.getChapters);
router.put('/:id/chapters', authenticate, videoController.updateChapters);

module.exports = router;
```

### 7.2 Manual Chapter Management

```javascript
// apps/api/src/services/chapter.service.js
const supabaseService = require('./supabase.service');
const { v4: uuidv4 } = require('uuid');

class ChapterService {
  constructor() {
    this.supabase = supabaseService.getClient();
  }
  
  async createChapter(videoId, chapterData, userId) {
    const { title, description, startTime, endTime } = chapterData;
    
    // Verify user owns the video
    const { data: video } = await this.supabase
      .from('videos')
      .select('uploader_id, duration_seconds')
      .eq('id', videoId)
      .single();
    
    if (video.uploader_id !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Validate times
    if (endTime > video.duration_seconds) {
      throw new Error('Chapter end time exceeds video duration');
    }
    
    // Check for overlaps
    const { data: overlapping } = await this.supabase
      .from('chapters')
      .select('id')
      .eq('video_id', videoId)
      .or(`start_time_seconds.lte.${endTime},end_time_seconds.gte.${startTime}`);
    
    if (overlapping && overlapping.length > 0) {
      throw new Error('Chapter times overlap with existing chapter');
    }
    
    // Get next order
    const { data: maxOrder } = await this.supabase
      .from('chapters')
      .select('chapter_order')
      .eq('video_id', videoId)
      .order('chapter_order', { ascending: false })
      .limit(1)
      .single();
    
    // Create chapter
    const { data: chapter, error } = await this.supabase
      .from('chapters')
      .insert({
        id: uuidv4(),
        video_id: videoId,
        title,
        description,
        start_time_seconds: startTime,
        end_time_seconds: endTime,
        chapter_order: (maxOrder?.chapter_order || 0) + 1,
        is_ai_generated: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return chapter;
  }
  
  async updateChapters(videoId, chapters, userId) {
    // Verify ownership
    const { data: video } = await this.supabase
      .from('videos')
      .select('uploader_id')
      .eq('id', videoId)
      .single();
    
    if (video.uploader_id !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Delete existing chapters
    await this.supabase
      .from('chapters')
      .delete()
      .eq('video_id', videoId);
    
    // Insert new chapters
    const chaptersToInsert = chapters.map((chapter, index) => ({
      id: uuidv4(),
      video_id: videoId,
      title: chapter.title,
      description: chapter.description,
      start_time_seconds: chapter.startTime,
      end_time_seconds: chapter.endTime,
      chapter_order: index + 1,
      is_ai_generated: false
    }));
    
    const { data, error } = await this.supabase
      .from('chapters')
      .insert(chaptersToInsert)
      .select();
    
    if (error) throw error;
    return data;
  }
}

module.exports = new ChapterService();
```

---

## 8. Deployment Guide

### 8.1 Monorepo Deployment Strategy

```yaml
# .github/workflows/deploy.yml
name: Deploy Dojo

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Build web app
        run: pnpm turbo run build --filter=@dojo/web
      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Build API
        run: pnpm turbo run build --filter=@dojo/api
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 8.2 Vercel Configuration (Frontend)

```json
// apps/web/vercel.json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@dojo/web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

### 8.3 Railway Configuration (Backend)

```toml
# apps/api/railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "cd ../.. && pnpm install && pnpm turbo run build --filter=@dojo/api"

[deploy]
startCommand = "cd apps/api && npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300

[[services]]
name = "api"
port = 4000
```

### 8.4 Environment Variables Setup

```bash
# Vercel (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://api.dojo.app

# Railway (Backend)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
REDIS_URL=redis://...
FRONTEND_URL=https://dojo.app
```

### 8.5 Supabase Setup Checklist

- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Create storage buckets (videos, thumbnails, avatars)
- [ ] Configure RLS policies
- [ ] Set up Edge Functions (if needed)
- [ ] Configure Auth providers
- [ ] Set up database backups

---

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Start specific app
pnpm dev --filter=@dojo/web
pnpm dev --filter=@dojo/api

# Run database migrations
pnpm db:migrate

# Run tests
pnpm test
```

### Adding Dependencies

```bash
# Add to specific workspace
pnpm add express --filter=@dojo/api
pnpm add framer-motion --filter=@dojo/web

# Add to shared package
pnpm add zod --filter=@dojo/shared
```

---

## Next Steps

1. **Set up Supabase Project**
   - Create project
   - Run migrations
   - Configure storage buckets

2. **Implement Core Features**
   - User authentication flow
   - Video upload with progress
   - Manual chapter creation/editing
   - Social features (follow/subscribe)

3. **Testing**
   - Unit tests for services
   - Integration tests for API
   - E2E tests for critical flows

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure performance monitoring
   - Set up logging aggregation

5. **Future AI Integration**
   - Prepare chapter detection service
   - Add AI confidence scoring
   - Implement auto-titling

This monorepo structure provides a scalable foundation for the Dojo MVP with shared code, unified deployment, and efficient development workflow.