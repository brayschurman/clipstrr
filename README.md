# Clipstrr

Elegant, collaborative YouTube clip curation.

![Clipstrr demo](./public/demo.gif)

## Why Clipstrr

Clipstrr makes it easy to capture the exact part of a YouTube video that matters, drop it into a shared space, and let friends react in real time.

## Highlights

- Timestamped YouTube clips with custom start/end times
- Shareable rooms for collaborative curation
- Lightweight username-based access (no signup wall)
- Emoji reactions for quick feedback
- Mobile-friendly interface with smooth interactions

## Stack

- Next.js 15 (App Router)
- TypeScript
- tRPC + TanStack Query
- PostgreSQL + Drizzle ORM
- Tailwind CSS v4
- Better Auth

## Quick Start

### 1. Install

```bash
pnpm install
```

### 2. Configure env

Copy `.env.example` to `.env` and set your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5466/clipstrr"
```

### 3. Run migrations

```bash
pnpm db:migrate
```

### 4. Start dev server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Core Flow

1. Enter a username.
2. Create or join a room.
3. Paste a YouTube URL.
4. Set start/end timestamps.
5. Post and react with friends.

## Scripts

- `pnpm dev` - Start local development
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm check` - Lint + typecheck
- `pnpm lint` - Run linting
- `pnpm typecheck` - Run TypeScript checks
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema directly
- `pnpm db:studio` - Open Drizzle Studio

## Project Layout

```text
src/
  app/                    # Routes and UI
  server/api/routers/     # tRPC routers
  server/db/              # Drizzle schema and DB setup
  lib/                    # Shared utilities
```

## License

MIT

## Future Vision: YouTube Archive & Playlist Platform

This One Part is evolving into a personal YouTube archive—a place to curate your favorite videos and discover what others are watching. Think of it as an entirely different interface for YouTube, focused on collections and community.

**Core concept:**

- Your little archive of favorite YouTube videos
- Create and share playlists (currently called "rooms")
- Browse other people's curated collections
- A more social, playlist-centric way to experience YouTube

**Potential changes:**

- Rename "room" to something more fitting (e.g., "playlist", "collection", "archive", "shelf", "curation")
- Emphasize the archival/curation aspect over the ephemeral "room" metaphor
- Consider discovery features to explore other users' playlists
- Build out the playlist/collection management experience

**Feature ideas:**

- **Persistent Curations**: Save curations to your profile so you can always return to them. View all your curations from your profile page.
- **Auto-play Experience**: When a clip finishes playing in a curation, automatically start the next clip. Create a seamless, custom viewing experience across multiple YouTube videos—like a personalized mini-documentary or mixtape.
