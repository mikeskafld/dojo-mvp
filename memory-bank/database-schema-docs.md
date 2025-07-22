# dojo-mvp Database Schema Documentation

---

## 1. Database Overview

This document outlines the database schema design for the dojo-mvp application, supporting AI-powered video chapterization with social features, user management, and content organization.

### Technology Recommendations
- **Primary Database:** PostgreSQL (recommended for ACID compliance, JSON support, full-text search)
- **Alternative:** MySQL 8.0+ (with JSON column support)
- **Cache Layer:** Redis (for session management, real-time features)
- **File Storage:** AWS S3 / Google Cloud Storage / Azure Blob (for video files and thumbnails)

---

## 2. Core Tables

### 2.1 Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    display_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT username_length CHECK (LENGTH(username) >= 3),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2.2 Videos Table

```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- PostgreSQL array, or separate tags table for MySQL
    metadata JSONB, -- Store additional video metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT processing_status_check CHECK (
        processing_status IN ('pending', 'processing', 'complete', 'error', 'cancelled')
    ),
    CONSTRAINT processing_progress_check CHECK (
        processing_progress >= 0 AND processing_progress <= 100
    ),
    CONSTRAINT duration_positive CHECK (duration_seconds > 0),
    CONSTRAINT file_size_positive CHECK (file_size_bytes > 0)
);

-- Indexes
CREATE INDEX idx_videos_uploader_id ON videos(uploader_id);
CREATE INDEX idx_videos_processing_status ON videos(processing_status);
CREATE INDEX idx_videos_created_at ON videos(created_at);
CREATE INDEX idx_videos_published_at ON videos(published_at);
CREATE INDEX idx_videos_is_public ON videos(is_public);
CREATE INDEX idx_videos_tags ON videos USING GIN(tags); -- PostgreSQL
CREATE INDEX idx_videos_metadata ON videos USING GIN(metadata); -- PostgreSQL
```

### 2.3 Chapters Table

```sql
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time_seconds DECIMAL(10,3) NOT NULL,
    end_time_seconds DECIMAL(10,3) NOT NULL,
    chapter_order INTEGER NOT NULL,
    thumbnail_url VARCHAR(500),
    is_ai_generated BOOLEAN DEFAULT TRUE,
    confidence_score DECIMAL(3,2), -- AI confidence (0.00-1.00)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT start_before_end CHECK (start_time_seconds < end_time_seconds),
    CONSTRAINT time_non_negative CHECK (start_time_seconds >= 0),
    CONSTRAINT chapter_order_positive CHECK (chapter_order > 0),
    CONSTRAINT confidence_range CHECK (
        confidence_score IS NULL OR (confidence_score >= 0.00 AND confidence_score <= 1.00)
    ),
    
    -- Unique constraint to prevent overlapping chapters
    UNIQUE(video_id, chapter_order)
);

-- Indexes
CREATE INDEX idx_chapters_video_id ON chapters(video_id);
CREATE INDEX idx_chapters_start_time ON chapters(start_time_seconds);
CREATE INDEX idx_chapters_chapter_order ON chapters(video_id, chapter_order);
```

### 2.4 Comments Table

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0),
    CONSTRAINT content_length CHECK (LENGTH(content) <= 2000),
    
    -- Either video-level or chapter-level comment, not both
    CONSTRAINT comment_target CHECK (
        (chapter_id IS NULL AND video_id IS NOT NULL) OR 
        (chapter_id IS NOT NULL AND video_id IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_chapter_id ON comments(chapter_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_active ON comments(video_id, created_at) WHERE is_deleted = FALSE;
```

---

## 3. Social Features Tables

### 3.1 Follows Table

```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- Indexes
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at);
```

### 3.2 Subscriptions Table

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_type VARCHAR(20) DEFAULT 'basic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT no_self_subscription CHECK (subscriber_id != creator_id),
    CONSTRAINT subscription_type_check CHECK (
        subscription_type IN ('basic', 'premium', 'pro')
    ),
    UNIQUE(subscriber_id, creator_id)
);

-- Indexes
CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active, expires_at);
```

### 3.3 Likes Table

```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    -- Must like either a video or a comment, not both or neither
    CONSTRAINT like_target CHECK (
        (video_id IS NOT NULL AND comment_id IS NULL) OR 
        (video_id IS NULL AND comment_id IS NOT NULL)
    ),
    
    -- Unique constraints
    UNIQUE(user_id, video_id),
    UNIQUE(user_id, comment_id)
);

-- Indexes
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_video_id ON likes(video_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
```

---

## 4. System Tables

### 4.1 Sessions Table (if using database sessions)

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 4.2 Processing Jobs Table

```sql
CREATE TABLE processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    progress INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT job_status_check CHECK (
        status IN ('pending', 'running', 'completed', 'failed', 'cancelled')
    ),
    CONSTRAINT job_type_check CHECK (
        job_type IN ('chapter_generation', 'thumbnail_extraction', 'transcription', 'video_processing')
    ),
    CONSTRAINT progress_range CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT attempts_non_negative CHECK (attempts >= 0)
);

-- Indexes
CREATE INDEX idx_processing_jobs_video_id ON processing_jobs(video_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_processing_jobs_scheduled_at ON processing_jobs(scheduled_at);
CREATE INDEX idx_processing_jobs_priority ON processing_jobs(priority DESC, created_at);
```

---

## 5. Views for Common Queries

### 5.1 User Stats View

```sql
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    u.avatar_url,
    u.is_verified,
    COUNT(DISTINCT v.id) as video_count,
    COUNT(DISTINCT f1.follower_id) as followers_count,
    COUNT(DISTINCT f2.following_id) as following_count,
    COUNT(DISTINCT s.subscriber_id) as subscribers_count
FROM users u
LEFT JOIN videos v ON u.id = v.uploader_id AND v.is_public = true
LEFT JOIN follows f1 ON u.id = f1.following_id
LEFT JOIN follows f2 ON u.id = f2.follower_id
LEFT JOIN subscriptions s ON u.id = s.creator_id AND s.is_active = true
WHERE u.is_active = true
GROUP BY u.id, u.username, u.display_name, u.avatar_url, u.is_verified;
```

### 5.2 Video with Stats View

```sql
CREATE VIEW videos_with_stats AS
SELECT 
    v.*,
    u.username as uploader_username,
    u.display_name as uploader_display_name,
    u.avatar_url as uploader_avatar_url,
    u.is_verified as uploader_is_verified,
    COUNT(DISTINCT c.id) as chapter_count,
    COUNT(DISTINCT cm.id) as comment_count,
    COUNT(DISTINCT l.id) as like_count_actual
FROM videos v
LEFT JOIN users u ON v.uploader_id = u.id
LEFT JOIN chapters c ON v.id = c.video_id
LEFT JOIN comments cm ON v.id = cm.video_id AND cm.is_deleted = false
LEFT JOIN likes l ON v.id = l.video_id
WHERE v.is_public = true
GROUP BY v.id, u.username, u.display_name, u.avatar_url, u.is_verified;
```

---

## 6. Database Functions and Triggers

### 6.1 Update Timestamps Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processing_jobs_updated_at BEFORE UPDATE ON processing_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6.2 Update Like Counts Function

```sql
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.video_id IS NOT NULL THEN
            UPDATE videos SET like_count = like_count + 1 WHERE id = NEW.video_id;
        ELSIF NEW.comment_id IS NOT NULL THEN
            UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.video_id IS NOT NULL THEN
            UPDATE videos SET like_count = like_count - 1 WHERE id = OLD.video_id;
        ELSIF OLD.comment_id IS NOT NULL THEN
            UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_like_counts
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_like_counts();
```

---

## 7. Indexes for Performance

### 7.1 Composite Indexes for Common Queries

```sql
-- Feed queries (recent videos by followed users)
CREATE INDEX idx_videos_feed ON videos(is_public, created_at DESC, uploader_id);

-- User's videos
CREATE INDEX idx_videos_by_user ON videos(uploader_id, is_public, created_at DESC);

-- Chapter navigation
CREATE INDEX idx_chapters_navigation ON chapters(video_id, chapter_order, start_time_seconds);

-- Comment threads
CREATE INDEX idx_comments_thread ON comments(video_id, parent_id, created_at) WHERE is_deleted = false;

-- Processing queue
CREATE INDEX idx_processing_queue ON processing_jobs(status, priority DESC, created_at) 
    WHERE status IN ('pending', 'running');
```

---

## 8. Data Migration Scripts

### 8.1 Initial Data Setup

```sql
-- Create admin user
INSERT INTO users (username, email, password_hash, display_name, is_verified)
VALUES ('admin', 'admin@dojo-mvp.com', '$2b$12$...', 'System Admin', true);

-- Create default processing job types
INSERT INTO processing_jobs (video_id, job_type, status) 
SELECT id, 'chapter_generation', 'pending' 
FROM videos 
WHERE processing_status = 'pending';
```

---

## 9. Performance Considerations

### 9.1 Partitioning (for large datasets)

```sql
-- Partition comments by month for better performance
CREATE TABLE comments_y2024m01 PARTITION OF comments
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition processing_jobs by status
CREATE TABLE processing_jobs_pending PARTITION OF processing_jobs
    FOR VALUES IN ('pending');
CREATE TABLE processing_jobs_completed PARTITION OF processing_jobs
    FOR VALUES IN ('completed', 'failed', 'cancelled');
```

### 9.2 Materialized Views for Analytics

```sql
CREATE MATERIALIZED VIEW daily_video_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as videos_uploaded,
    COUNT(*) FILTER (WHERE processing_status = 'complete') as videos_processed,
    AVG(duration_seconds) as avg_duration
FROM videos
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Refresh daily
CREATE UNIQUE INDEX ON daily_video_stats (date);
```

---

## 10. Security Considerations

### 10.1 Row Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY users_own_data ON users
    FOR ALL TO authenticated_users
    USING (id = current_user_id());

CREATE POLICY videos_public_or_own ON videos
    FOR SELECT TO authenticated_users
    USING (is_public = true OR uploader_id = current_user_id());
```

---

## 11. Backup and Maintenance

### 11.1 Regular Maintenance Tasks

```sql
-- Clean up expired sessions
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- Clean up soft-deleted comments older than 30 days
DELETE FROM comments 
WHERE is_deleted = true 
AND updated_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Update video view counts (if using separate analytics)
-- This would typically be done via application logic
```

---

## 12. Database Setup Checklist

- [ ] Install PostgreSQL 14+
- [ ] Create database and user with appropriate permissions
- [ ] Run table creation scripts in order
- [ ] Create indexes and constraints
- [ ] Set up triggers and functions
- [ ] Create views for common queries
- [ ] Configure connection pooling
- [ ] Set up backup strategy
- [ ] Configure monitoring and alerting
- [ ] Test with sample data

---

This database schema supports all the frontend requirements while providing scalability, performance, and data integrity for the dojo-mvp application. 