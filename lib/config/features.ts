export const features = {
  aiChapterDetection: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
  videoTranscoding: false,
  autoThumbnails: true,
  socialFeatures: true,
  analytics: false
} as const

export type FeatureFlags = typeof features

// Usage in components:
// import { features } from '@/lib/config/features'
// if (features.aiChapterDetection) { ... }
