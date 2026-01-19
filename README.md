# Personal Portfolio Website

A minimal, modern personal portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Notion API integration. Features a clean, developer-friendly design with dynamic content management.

## Features

- **Minimal Landing Page**: Chronark-inspired landing page with large name display and Cal Sans font
- **Portfolio Page**: Centralized hub for accessing Blog, Movies, and Books sections
- **Blog**: Minimal blog layout with featured posts and individual post pages
- **Movies & Shows**: Interactive card grid with hover details for watched content
- **Books**: Interactive card grid with hover details for reading list
- **Contact Page**: Clean contact cards for email and social links
- **Notion Integration**: All content is managed through Notion databases
- **Settings Management**: Dynamic site title, favicon, and metadata from Notion
- **Dark Mode**: Toggle between light and dark themes
- **Automated Sync**: Vercel Cron Jobs automatically sync data from Notion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **CMS**: Notion API
- **Deployment**: Vercel

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Notion Setup

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Create the following databases in Notion:
   - **Settings**: For site configuration (title, favicon, metadata)
   - **Profile**: For landing page information
   - **Blog**: For blog posts
   - **Movies**: For movies and TV shows
   - **Books**: For books

3. Share each database with your Notion integration
4. Copy the database IDs from Notion (found in the URL)

### 3. Environment Variables

Create a `.env.local` file:

```env
NOTION_API_KEY=secret_xxx
NOTION_SETTINGS_DB=xxx
NOTION_PROFILE_DB=xxx
NOTION_BLOG_DB=xxx
NOTION_MOVIES_DB=xxx
NOTION_BOOKS_DB=xxx
CRON_SECRET=your-secret-token-here
```

### 4. Notion Database Schema

#### Settings Database
- **Title** (Rich Text) - Site title (used in browser tab)
- **Favicon** (URL) - Favicon image URL
- **Site Name** (Rich Text) - Site name
- **Description** (Rich Text) - Meta description
- **Meta Tags** (Rich Text) - Additional meta tags (optional)

#### Profile Database
- **Name** (Title)
- **Title** (Rich Text)
- **Bio** (Rich Text)
- **Email** (Email)
- **Location** (Rich Text)
- **Skills** (Multi-select)
- **GitHub** (URL)
- **LinkedIn** (URL)
- **Twitter** (URL)
- **Website** (URL)
- **Avatar** (URL)

#### Blog Database
- **Title** (Title)
- **Slug** (Rich Text) - unique identifier for URLs
- **Published Date** (Date)
- **Status** (Select) - "published" or "draft"
- **Excerpt** (Rich Text)
- **Cover Image** (URL)

#### Movies Database
- **Title** (Title)
- **Type** (Select) - "movie" or "series"
- **Rating** (Number) - 0-10
- **Watched Date** (Date)
- **Poster** (URL)
- **Year** (Number)
- **Genre** (Multi-select)

#### Books Database
- **Title** (Title)
- **Author** (Rich Text)
- **Rating** (Number) - 0-10
- **Read Date** (Date)
- **Cover** (URL)
- **Genre** (Multi-select)
- **Pages** (Number)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The cron job is configured to run every 6 hours to sync data from Notion. You can adjust the schedule in `vercel.json`.

### Manual Sync

You can manually trigger a sync by calling:

```bash
POST /api/notion/sync
Authorization: Bearer YOUR_CRON_SECRET
```

Or via Vercel Cron:

```bash
GET /api/cron?token=YOUR_CRON_SECRET
```

## Navigation Structure

- **Landing Page (/)**: Minimal page with name, title, and links to Portfolio and Contact
- **Portfolio (/portfolio)**: Hub page with links to Blog, Movies, and Books
- **Blog (/blog)**: List of blog posts with minimal design
- **Movies (/movies)**: Grid of movie/show cards with hover details
- **Books (/books)**: Grid of book cards with hover details
- **Contact (/contact)**: Contact cards for email and social links

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── blog/             # Blog pages
│   ├── movies/           # Movies page
│   ├── books/            # Books page
│   ├── portfolio/        # Portfolio hub page
│   ├── contact/          # Contact page
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout with theme provider
├── components/
│   ├── ui/               # Reusable UI components
│   ├── landing/          # Landing page components
│   ├── blog/             # Blog components
│   ├── movies/           # Movie components
│   ├── books/            # Book components
│   ├── contact/          # Contact components
│   └── providers/        # Context providers (Theme, RouteTransition)
├── lib/
│   ├── notion/           # Notion API helpers
│   │   ├── settings.ts   # Settings data fetching
│   │   ├── profile.ts    # Profile data fetching
│   │   ├── blog.ts       # Blog data fetching
│   │   ├── movies.ts     # Movies data fetching
│   │   └── books.ts      # Books data fetching
│   └── utils/            # Utility functions
└── public/
    └── fonts/            # Cal Sans font files (if using local)
```

## Typography

- **Cal Sans**: Used for hero name display on landing page
- **Inter**: Default font for body text and UI elements

## Design Principles

- **Minimal**: Clean, uncluttered design
- **Centered Layout**: Content is centered with max-width constraints
- **White Background**: Primary background is white (dark mode available)
- **Small Fonts**: Compact typography for developer-friendly aesthetic
- **Interactive Cards**: Hover effects reveal additional information

## License

MIT
