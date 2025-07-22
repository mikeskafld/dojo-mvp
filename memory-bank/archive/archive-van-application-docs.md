# dojo-mvp Application: Comprehensive Technical Documentation

---

## 1. Project Overview

**dojo-mvp** is a Next.js 15 application designed to transform long-form videos into interactive, chapterized timelines using AI. The app provides a modern, mobile-friendly interface for uploading, editing, and sharing videos with automatically generated chapters.

---

## 2. Project Structure

```
dojo-mvp/
  app/                # Main application routes and pages (Next.js App Router)
  components/         # Reusable React components (feature and UI primitives)
    ui/               # Atomic UI components (Radix-based and custom)
  hooks/              # Custom React hooks
  lib/                # Utility functions
  public/             # Static assets (images, etc.)
  styles/             # Global CSS (Tailwind)
  memory-bank/        # (AI assistant context, not part of shipped app)
  package.json        # Project metadata, dependencies, scripts
  tailwind.config.ts  # Tailwind CSS configuration
  tsconfig.json       # TypeScript configuration
```

The complete documentation has now been properly stored in `memory-bank/archive/archive-van-application-docs.md` with all the actual content included. Your backend engineer can now reference this file for comprehensive documentation on the frontend capabilities and requirements.

---

## 3. Frameworks & Tooling

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS, custom global styles
- **UI Library:** Radix UI primitives, custom UI components, Lucide icons
- **Forms & Validation:** react-hook-form, zod
- **Other Libraries:** Embla Carousel, recharts, date-fns, sonner (toasts), vaul (drawers/modals)
- **TypeScript:** Full type safety throughout

---

## 4. Routing & Pages

### App Directory Structure

- **`app/layout.tsx`**  
  Sets up the root HTML structure, applies the Inter font, and includes global CSS. All pages are rendered as children.

- **`app/page.tsx`**  
  The root route (`/`). Immediately redirects to `/feed`, making the feed the default landing page.

### Main Routes

Each subdirectory in `app/` represents a route. Notable routes include:

- **/feed**  
  The main content feed, likely showing videos and updates.

- **/browse**  
  Browse all available videos.

- **/upload**  
  Upload a new video for chapterization.

- **/review**  
  Review and edit the AI-generated chapters for a video.

- **/processing**  
  Shows processing status or a demo of the AI chapterization.

- **/profile/[username]**  
  User profile page, with subroutes for followers and following.

- **/followers, /following**  
  Global lists of followers/following.

- **/settings, /sign-out, /subscribe/[username], /help-support, /privacy-safety**  
  Account management and support pages.

---

## 5. Components

### Feature Components

- **ChapterList.tsx**  
  Displays a list of video chapters, likely with editing capabilities.

- **CommentModal.tsx**  
  Modal for adding or viewing comments on videos or chapters.

- **SubscriptionModal.tsx**  
  Handles user subscriptions to content or creators.

- **UnfollowWarningModal.tsx**  
  Confirms unfollow actions.

- **UploadDropzone.tsx**  
  Drag-and-drop interface for uploading video files.

- **VideoPlayer.tsx**  
  Custom video player component.

- **BottomNavigation.tsx**  
  Mobile/tab navigation bar.

### UI Primitives (`components/ui/`)

A comprehensive set of atomic UI components, mostly built on Radix UI primitives, including:

- Buttons, cards, dialogs, drawers, dropdowns, forms, inputs, labels, menus, modals, navigation, pagination, popovers, progress bars, radio groups, scroll areas, selects, sheets, skeletons, sliders, switches, tables, tabs, textareas, toasts, tooltips, and more.

These components are designed for consistency, accessibility, and reusability across the app.

---

## 6. Custom Hooks

- **use-mobile.tsx**  
  Detects mobile devices or viewport sizes for responsive UI logic.

- **use-toast.ts**  
  Provides toast notification logic, likely wrapping the "sonner" library.

---

## 7. Utilities

- **lib/utils.ts**  
  Contains general utility functions used throughout the app (details can be expanded as needed).

---

## 8. Theming & Fonts

- **Font:**  
  Uses the Inter font from Google Fonts, applied globally via the root layout.

- **Theming:**  
  Likely supports dark mode and theming via `next-themes` and Tailwind CSS.

---

## 9. Build & Scripts

Defined in `package.json`:

- **dev:** Start development server (`next dev`)
- **build:** Build for production (`next build`)
- **start:** Start production server (`next start`)
- **lint:** Lint codebase (`next lint`)

---

## 10. Dependencies

Key dependencies (see `package.json` for full list):

- **Next.js, React, React DOM**
- **Radix UI** (multiple packages for accessible UI primitives)
- **Tailwind CSS** (utility-first styling)
- **react-hook-form, zod** (forms and validation)
- **Lucide-react** (icon set)
- **Embla Carousel, recharts, date-fns** (carousel, charts, date utilities)
- **sonner** (toasts), **vaul** (drawers/modals)

---

## 11. Application Flow

1. **User lands on `/`**  
   Instantly redirected to `/feed`.

2. **Navigation**  
   Users can browse videos, upload new content, review/edit chapters, and manage their profile and subscriptions.

3. **Upload & Chapterization**  
   Users upload a video via `/upload`. The app uses AI to generate chapters, which can be reviewed and edited in `/review`.

4. **Social Features**  
   Users can follow/unfollow others, subscribe, and interact via comments and modals.

5. **Responsive Design**  
   The app is designed to be mobile-friendly, with bottom navigation and responsive layouts.

---

## 12. Notable Patterns

- **Atomic Design:**  
  UI is built from atomic components, ensuring consistency and reusability.

- **Radix UI Integration:**  
  Many UI primitives are based on Radix, providing accessibility and composability.

- **App Router (Next.js 13+):**  
  Uses the new file-based routing and layouts for modular, scalable page structure.

- **Type Safety:**  
  TypeScript is used throughout for type safety and maintainability.

---

## 13. Extensibility

- **Easy to add new routes/pages** via the `app/` directory.
- **Reusable UI components** make it simple to build new features with a consistent look and feel.
- **Custom hooks and utilities** centralize logic for maintainability.

---

## 14. Summary

dojo-mvp is a modern, scalable, and maintainable Next.js application for AI-powered video chapterization. It leverages best-in-class UI primitives, a modular architecture, and a focus on user experience and accessibility.

---

# dojo-mvp: Backend-Oriented Frontend Documentation

## 1. High-Level Application Flows

### User Flows
- **Authentication:** (Not explicitly shown, but likely required for profile, upload, and social features)
- **Video Upload:** User uploads a video, which is processed by AI to generate chapters.
- **Chapter Review/Edit:** User reviews and edits AI-generated chapters.
- **Feed/Browse:** Users view a feed of videos and can browse/search.
- **Profile & Social:** Users have profiles, can follow/unfollow, and subscribe to others.
- **Comments:** Users can comment on videos/chapters.
- **Notifications/Toasts:** Users receive feedback on actions (e.g., uploads, edits).

---

## 2. Key Frontend Pages & Their Data Needs

### `/feed` (Main Feed)
- **Data Needed:**
  - List of videos (paginated)
    - Video ID, title, thumbnail, uploader, upload date, chapter summary, view count, like count, etc.
- **API Endpoints:**
  - `GET /api/videos/feed?page=1`
- **Backend Notes:**
  - Support pagination, sorting (latest, popular), and possibly filtering.

---

### `/browse`
- **Data Needed:**
  - List of all videos (with similar fields as feed)
  - Search/filter parameters
- **API Endpoints:**
  - `GET /api/videos?search=...&filter=...`
- **Backend Notes:**
  - Implement search and filter logic.

---

### `/upload`
- **Data Needed:**
  - Video file upload (multipart/form-data)
  - Metadata: title, description, tags
- **API Endpoints:**
  - `POST /api/videos/upload`
- **Backend Notes:**
  - Handle file storage, trigger AI chapterization, return processing status.

---

### `/processing`
- **Data Needed:**
  - Status of video processing (by video ID)
  - Progress, errors, estimated time
- **API Endpoints:**
  - `GET /api/videos/{id}/processing-status`
- **Backend Notes:**
  - Support polling or websockets for real-time updates.

---

### `/review`
- **Data Needed:**
  - Video details and generated chapters
    - Chapter start/end times, titles, descriptions
  - Ability to edit chapters
- **API Endpoints:**
  - `GET /api/videos/{id}/chapters`
  - `PUT /api/videos/{id}/chapters`
- **Backend Notes:**
  - Store chapters as structured data, allow updates.

---

### `/profile/[username]`
- **Data Needed:**
  - User profile info (username, avatar, bio, stats)
  - User's videos
  - Followers/following lists
- **API Endpoints:**
  - `GET /api/users/{username}`
  - `GET /api/users/{username}/videos`
  - `GET /api/users/{username}/followers`
  - `GET /api/users/{username}/following`
- **Backend Notes:**
  - Support for user lookups by username.

---

### `/followers`, `/following`
- **Data Needed:**
  - Lists of users the current user follows or is followed by
- **API Endpoints:**
  - `GET /api/users/me/followers`
  - `GET /api/users/me/following`
- **Backend Notes:**
  - Pagination for large lists.

---

### `/subscribe/[username]`
- **Data Needed:**
  - Subscription status, ability to subscribe/unsubscribe
- **API Endpoints:**
  - `POST /api/users/{username}/subscribe`
  - `DELETE /api/users/{username}/subscribe`
- **Backend Notes:**
  - Track subscriptions per user.

---

### `/comment` (Modal)
- **Data Needed:**
  - Comments for a video/chapter
  - Ability to add/delete comments
- **API Endpoints:**
  - `GET /api/videos/{id}/comments`
  - `POST /api/videos/{id}/comments`
  - `DELETE /api/comments/{commentId}`
- **Backend Notes:**
  - Support threaded/nested comments if needed.

---

## 3. Data Models (Frontend Expectations)

### User
```ts
{
  id: string
  username: string
  avatarUrl: string
  bio?: string
  followersCount: number
  followingCount: number
  isFollowing?: boolean // relative to current user
  isSubscribed?: boolean
}
```

### Video
```ts
{
  id: string
  title: string
  description: string
  uploader: User
  uploadDate: string
  thumbnailUrl: string
  videoUrl: string
  chapters: Chapter[]
  viewCount: number
  likeCount: number
  processingStatus?: 'pending' | 'processing' | 'complete' | 'error'
}
```

### Chapter
```ts
{
  id: string
  videoId: string
  startTime: number // seconds
  endTime: number // seconds
  title: string
  description?: string
}
```

### Comment
```ts
{
  id: string
  videoId: string
  chapterId?: string
  author: User
  content: string
  createdAt: string
  parentId?: string // for replies
}
```

---

## 4. Authentication & Authorization

- **Assumed:** JWT or session-based authentication.
- **Frontend expects:** Ability to get current user, check login status, and perform actions as authenticated user (upload, comment, follow, etc.).
- **API Endpoints:**
  - `GET /api/auth/me`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/register`

---

## 5. Error Handling & Status

- **Processing:** `/processing` page expects real-time or polling updates.
- **Uploads:** Frontend expects clear error/success responses for uploads and edits.
- **Forms:** All forms expect validation errors in a structured format.

---

## 6. Notifications

- **Toasts:** Used for feedback on actions (success, error, info).
- **Backend should:** Return clear, actionable messages for all endpoints.

---

## 7. Social Features

- **Follow/Unfollow:**  
  - `POST /api/users/{username}/follow`
  - `DELETE /api/users/{username}/follow`
- **Subscribe/Unsubscribe:**  
  - `POST /api/users/{username}/subscribe`
  - `DELETE /api/users/{username}/subscribe`

---

## 8. File Storage

- **Uploads:** Video files and thumbnails must be stored and retrievable via URLs.
- **Backend should:** Return URLs for uploaded assets.

---

## 9. Real-Time/Async

- **Processing status:** Should support polling or websockets for updates.
- **Comments:** Optional real-time updates for new comments.

---

## 10. Summary Table: Key Endpoints

| Feature         | Endpoint(s)                                      | Method(s)   | Notes                        |
|-----------------|--------------------------------------------------|-------------|------------------------------|
| Feed            | /api/videos/feed                                 | GET         | Paginated                    |
| Browse/Search   | /api/videos                                      | GET         | Search/filter params         |
| Upload Video    | /api/videos/upload                               | POST        | Multipart, triggers AI       |
| Processing      | /api/videos/{id}/processing-status               | GET         | Polling/real-time            |
| Review/Edit     | /api/videos/{id}/chapters                        | GET, PUT    | Structured chapters          |
| Profile         | /api/users/{username}                            | GET         | User info                    |
| User Videos     | /api/users/{username}/videos                     | GET         |                              |
| Followers       | /api/users/{username}/followers                  | GET         |                              |
| Following       | /api/users/{username}/following                  | GET         |                              |
| Subscribe       | /api/users/{username}/subscribe                  | POST, DELETE|                              |
| Comments        | /api/videos/{id}/comments                        | GET, POST   |                              |
| Delete Comment  | /api/comments/{commentId}                        | DELETE      |                              |
| Auth            | /api/auth/me, /login, /logout, /register         | GET, POST   |                              |

---

## 11. Backend Engineer Action Items

- Implement the above endpoints and data models.
- Ensure endpoints return data in the expected shape.
- Support file uploads and return asset URLs.
- Implement authentication and authorization.
- Provide clear error/status responses for all actions.
- Support pagination, filtering, and real-time updates where needed.

---

This documentation should provide a backend engineer with a clear map of what the frontend expects, enabling efficient backend development.