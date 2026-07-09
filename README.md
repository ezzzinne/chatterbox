# Chatterbox

Chatterbox is a modern social blogging platform built with **Next.js**, **Supabase**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It allows users to create, preview, publish, discover, and interact with posts through likes, comments, bookmarks, follows, tags, notifications, analytics, and search.

The platform supports a complete content workflow from draft creation to publishing, personalized content discovery, social engagement, analytics tracking, and automated testing.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Core User Flows](#core-user-flows)
* [Database Overview](#database-overview)
* [Supabase Edge Functions](#supabase-edge-functions)
* [Analytics System](#analytics-system)
* [Testing](#testing)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Running the Project Locally](#running-the-project-locally)
* [Running Tests](#running-tests)
* [Deployment Notes](#deployment-notes)

---

## Overview

Chatterbox is a content publishing and discovery application where authenticated users can write markdown-based articles, save drafts, preview posts, publish articles, and interact with posts from other users.

The project includes:

* Authentication with Supabase Auth
* Markdown post creation and preview
* Draft and published post workflow
* Tag selection and tag following
* Personalized feed based on followed tags and authors
* Search powered by Supabase PostgreSQL functions
* Likes, bookmarks, comments, and nested replies
* Author follow/unfollow
* Notification bell for likes, comments, replies, and follows
* Analytics tracking using Supabase Edge Functions
* Recharts-powered stats dashboard
* Unit, component, and E2E testing setup

---

## Features

### Authentication

Users can create accounts, log in, and access protected dashboard routes.

Key features:

* Email/password authentication
* Supabase Auth integration with forgot password implementation
* Protected dashboard routes
* Auth-based redirects
* User profile creation and retrieval

---

### Content Creation

Authors can create and manage posts through a markdown editor.

Features:

* Rich markdown writing experience
* Post title and excerpt fields
* Draft saving
* Preview draft before publishing
* Publish workflow
* Tags attached to posts
* Reading time calculation
* Markdown rendering in HTML for article view

Post statuses include:

```txt
draft
published
```

---

### Draft and Article Workflow

The content workflow is structured around drafts and published articles.

Flow:

```txt
User writes post
↓
Post is saved as draft
↓
User clicks Preview
↓
User views draft preview
↓
User clicks Publish
↓
Post moves to published articles
↓
Published post appears in dashboard/home feed
```

Drafts and articles are scoped to the author where needed, while published posts are visible in the main feed.

---

### Content Discovery

The dashboard feed supports personalized content discovery.

Features:

* Personalized feed ranked by followed tags and authors
* Tag-based discovery
* Suggested tags from a predefined table on the database
* Follow and unfollow tags
* Followed tags card
* Search by title, body, and tags
* Cursor-based pagination & infinite scroll support

Personalization considers:

* Tags followed by the user
* Authors followed by the user
* Post recency

---

### Social Features

Users can interact with posts and authors.

Features:

* Like posts
* Bookmark posts
* Comment on posts
* Reply to comments
* Two-level nested comments
* Follow and unfollow authors
* View bookmarked posts
* Notification bell for social interactions

Notification events include:

```txt
like
comment
reply
follow
```

---

### Comments

Comments support top-level comments and replies.

Structure:

```txt
Comment
└── Reply
```

The system supports two comment levels:

* Level 0: top-level comments
* Level 1: replies

Each comment displays:

* Comment body
* Author name
* Author avatar
* Timestamp

And the top-level comment also displays:

* Reply action

---

### Bookmarks

Users can save posts for later.

Features:

* Bookmark/unbookmark posts
* Bookmark state persists after page refresh
* Bookmarked posts page
* Bookmark counts displayed on post cards

---

### Author Following

Users can follow and unfollow authors.

Features:

* Follow author from article page
* Follow state persists after refresh
* Followers influence personalized feed ranking
* Follow actions trigger notifications

---

### Tag Following

Users can follow tags to personalize their feed.

Features:

* Follow suggested tags
* View followed tags
* Unfollow tags from followed tags card
* Followed tags influence personalized feed ranking

---

### Notifications

The notification system informs users when other users interact with their content or profile.

Notification triggers:

* Someone likes your post
* Someone comments on your post
* Someone replies to your comment
* Someone follows you

Notifications are stored in Supabase and displayed in a notification bell.

---

### Analytics

Analytics are tracked for published posts.

Tracked metrics:

* Views
* Unique readers
* Likes
* Comments
* Bookmarks

Analytics are recorded through a Supabase Edge Function and stored in an `analytics_events` table.

The stats dashboard displays:

* Aggregated metric cards
* Views and unique readers line chart
* Likes, comments, and bookmarks bar chart
* Last 7 days vs previous 7 days comparison

---

## Tech Stack

### Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React Icons
* React Markdown Editor
* Recharts

### Backend / Database

* Supabase Auth
* Supabase PostgreSQL
* Supabase Row Level Security
* Supabase Edge Functions
* PostgreSQL RPC functions
* PostgreSQL triggers

### Testing

* Vitest
* React Testing Library
* MSW
* Playwright

---

## Project Structure

```txt
src/
  app/
    (auth)/
      login/
      signup/
      forgot-password/
      reset-password/

    (dashboard)/
      dashboard/
        page.tsx
        layout.tsx
        posts/
          new/
          edit/
        drafts/
          [postId]/
        articles/
          [postId]/
        bookmarks/
        search/
        stats/
        tags/
        users/

  actions/
    posts.ts
    feed.ts
    search.ts
    likes.ts
    bookmarks.ts
    comments.ts
    authors.ts
    tags.ts
    notifications.ts

  components/
    analytics/
      __tests__/
      post-view-tracker.tsx
      stats-charts.tsx

    dashboard/
      sidebar.tsx
      desktop-sidebar.tsx
      mobile-sidebar.tsx
      dashboard-navbar.tsx

    editor/
      markdown-editor.tsx
      post-editor.tsx
      publish-sidebar.tsx
      tag-selector.tsx

    feed/
      feed-list.tsx

    notifications/
      notification-bell.tsx

    post/
      __tests__
      post-card.tsx
      article-preview.tsx
      draft-preview.tsx
      article-actions.tsx
      comment-section.tsx

    profile/
      profile-header.tsx
      follow-author-button.tsx

    search/
      search-input.tsx
      search-page-client.tsx

    tags/
      __tests__
      tag-card.tsx
      followed-tags.tsx
      followed-tag-badge.tsx
      suggested-tags.tsx
      follow-tag-button.tsx

    ui/

    logout-button.tsx
    password-input.tsx
    protected-route.tsx

  lib/
    __tests__/
    server.ts
    client.ts
    reading-time.ts
    feed-sort.ts
    analytics-aggregator.ts
    post-validation.ts
    middleware.ts

  context/
    auth-context.ts

  providers/
    auth-provider.tsx

test/
  setup.ts
  msw/
    handlers.ts
    server.ts

e2e/
  auth.spec.ts
  signup.spec.ts
  search.spec.ts
  bookmarks.spec.ts
  like-comment.spec.ts
  publish-post.spec.ts
  helpers/
    auth.ts

supabase/
  config.toml
  functions/
    track-post-view/
      index.ts
  .temp/
```

---

## Core User Flows

### Sign Up

```txt
User opens signup page
↓
User fills signup form
↓
Client-side validation runs
↓
Supabase creates user
↓
Profile row is created
↓
User is redirected to dashboard
```

---

### Create and Publish Post

```txt
User opens create post page (+New Article)
↓
User enters title, excerpt, markdown content, and tags
↓
Draft is saved
↓
User previews draft
↓
User publishes post
↓
Post status changes from draft to published
↓
Published post appears in dashboard feed
```

---

### Like and Bookmark

```txt
User opens article
↓
Article page fetches existing like/bookmark state
↓
User clicks Like or Save
↓
Server action toggles database row
↓
UI updates immediately
↓
State persists after refresh
```

---

### Comment and Reply

```txt
User opens article
↓
Existing comments are loaded
↓
User posts comment
↓
Comment is inserted into comments table
↓
Comment appears immediately
↓
Post author receives notification
```

For replies:

```txt
User clicks Reply
↓
Reply input opens
↓
Reply is inserted with parent_id
↓
Parent comment author receives notification
```

---

### Follow Author

```txt
User opens article
↓
User clicks Follow
↓
Row is inserted into author_follows
↓
Followed author receives notification
↓
Follow state persists after refresh
```

---

### Follow Tag

```txt
User clicks Follow on a tag
↓
Row is inserted into tag_follows
↓
Tag appears in followed tags card
↓
Personalized feed ranking improves posts with that tag
```

---

## Database Overview

The project uses Supabase PostgreSQL.

Main tables include:

```txt
profiles
posts
tags
post_tags
tag_follows
author_follows
post_likes
bookmarks
comments
notifications
analytics_events
```

---

### `posts`

Stores post content and publishing state.

Important fields:

```txt
id
author_id
title
excerpt
content_markdown
status
created_at
updated_at
published_at
```

---

### `post_tags`

Join table between posts and tags.

Important fields:

```txt
post_id
tag_id
```

---

### `tag_follows`

Tracks tags followed by users.

Important fields:

```txt
user_id
tag_id
created_at
```

---

### `author_follows`

Tracks author follow relationships.

Important fields:

```txt
follower_id
author_id
created_at
```

---

### `post_likes`

Tracks liked posts.

Important fields:

```txt
post_id
user_id
created_at
```

---

### `bookmarks`

Tracks bookmarked posts.

Important fields:

```txt
post_id
user_id
created_at
```

---

### `comments`

Stores comments and replies.

Important fields:

```txt
id
post_id
author_id
parent_id
body
depth
created_at
updated_at
```

---

### `notifications`

Stores notifications for users.

Important fields:

```txt
id
recipient_id
actor_id
post_id
comment_id
type
read_at
created_at
```

Supported notification types:

```txt
like
comment
reply
follow
```

---

### `analytics_events`

Stores analytics events.

Important fields:

```txt
id
post_id
user_id
event_type
session_id
user_agent
referrer
created_at
```

Supported analytics events:

```txt
view
```

The project uses `analytics_events` as the source of truth for view analytics but it contains a `views.ts` actions file as a fallback.

---

## Supabase Edge Functions

### `track-post-view`

The project includes a Supabase Edge Function for analytics tracking.

Function path:

```txt
supabase/functions/track-post-view/index.ts
```

The function is called when a user opens a post.

It records:

* Post ID
* User ID, if logged in
* Session ID
* User agent
* Referrer
* Timestamp

It inserts the view event into:

```txt
analytics_events
```

Function config in `supabase/config.toml`:

```toml
[functions.track-post-view]
verify_jwt = true
```

Deploy the function:

```bash
supabase functions deploy track-post-view
```

---

## Analytics System

Analytics are displayed on the stats page using Recharts.

The stats page includes:

* Views
* Unique readers
* Likes
* Comments
* Bookmarks
* Last 7 days vs previous 7 days comparison
* Line chart for views and unique readers
* Bar chart for likes, comments, and bookmarks

Analytics data is aggregated through Supabase RPC functions.

RPC functions:

```txt
get_post_analytics
get_author_daily_stats
get_personalized_feed
search_posts
```

---

## Testing

The project includes unit, component, and end-to-end testing.

### Test Tools

* Vitest
* React Testing Library
* MSW
* Playwright

---

### Unit Tests

Unit tests cover pure logic.

Such as:

* Analytics aggregation
* Feed sorting
* Post form validation

Files:

```txt
src/lib/__tests__/feed-sort.test.ts
src/lib/__tests__/analytics-aggregator.test.ts
src/lib/__tests__/post-validation.test.ts
```

---

### Component Tests

Component tests cover UI rendering and state.

Such as:

* `PostCard`
* `CommentSection`
* `TagCard`
* `StatsCharts`

Files:

```txt
src/components/post/__tests__/post-card.test.tsx
src/components/post/__tests__/comment-section.test.tsx
src/components/tags/__tests__/tag-card.test.tsx
src/components/analytics/__tests__/stats-charts.test.tsx
```

---

### E2E Tests

Playwright tests cover real browser flows.

Such as:

* Auth-protected redirect
* Signup page access
* Search posts
* Bookmark post
* Like and comment on post
* Write and publish post

Files:

```txt
e2e/auth.spec.ts
e2e/signup.spec.ts
e2e/search.spec.ts
e2e/bookmarks.spec.ts
e2e/like-comment.spec.ts
e2e/publish-post.spec.ts
```

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm or any package manager installed
* Supabase account/project
* Supabase CLI installed
* Git installed

---

## Environment Variables

Create a `.env.local` file in the project root and add your environment variables.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For E2E tests, create a `.env.local` and add environment variables for testing. Make sure the test email and password belongs to an authenticated user and has a row in the database.

Example:

```env
E2E_EMAIL=janedoe@gmail.com
E2E_PASSWORD=Password123
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

Environmental variables should not be committed.

---

## Running the Project Locally

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Running Supabase Locally

If using local Supabase:

```bash
supabase start
```

Serve the Edge Function locally:

```bash
supabase functions serve track-post-view
```

If using hosted Supabase, deploy the Edge Function:

```bash
supabase functions deploy track-post-view
```

---

## Running Tests

### Unit and Component Tests

Run tests in watch mode:

```bash
npm run test
```

Run tests once:

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

---

### E2E Tests

Install Playwright browsers:

```bash
npx playwright install
```

Run E2E tests:

```bash
npm run test:e2e
```

Run E2E tests with UI:

```bash
npm run test:e2e:ui
```

Run a single E2E test:

```bash
npx playwright test e2e/auth.spec.ts --headed
```

---

## Useful Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Deployment Notes

### Deploying the App

The app can be deployed to platforms such as Vercel.

Before deploying, make sure the following environment variables are set in the deployment platform:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

---

### Deploying Supabase Edge Functions

Deploy the post view tracking function:

```bash
supabase functions deploy track-post-view
```

Add the function configuration to `supabase/config.toml`:

```toml
[functions.track-post-view]
verify_jwt = true
```

---

## Future Improvements

* Full profile editing
* Image upload from markdown editor to Supabase Storage
* Advanced notification filtering
* Better analytics breakdown per post
* Public author profile pages
* More advanced feed recommendation ranking
* Advanced commenting system
* Improved SEO and Accessibility
* Dynamic Open Graph and Twitter Card meta tag for social sharing
* CI pipeline for tests and linting

---

### Author
Ezinne Nwani

LinkedIn: https://linkedin.com/in/ezinne-nwani

Email: ezinne.nwani22@gmail.com
