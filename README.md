# 🎬 This One Part

Share your favorite YouTube moments with friends in private rooms!

## Features

- 🎥 **YouTube Clip Sharing** - Post YouTube videos with custom start and end timestamps
- 😂 **Emoji Reactions** - React to posts with your favorite emojis
- 🔗 **Shareable Rooms** - Create rooms and invite friends with a simple link
- 👤 **Anonymous Access** - No signup required, just enter a username
- 📱 **Mobile-Friendly** - Responsive design with touch-friendly interactions
- ✨ **Fun Animations** - Smooth transitions and satisfying button press effects

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe APIs
- **Styling**: Tailwind CSS v4 with custom red theme
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

1. Set up your environment variables:

Copy `.env.example` to `.env` and fill in your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5466/thisonepart"
```

1. Run database migrations:

```bash
pnpm db:migrate
```

1. Start the development server:

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Room

1. Enter your username when prompted
2. Enter a room name (e.g., "Movie Night Clips 🍿")
3. Click "Create Room 🎬"
4. Share the room link with friends!

### Posting a YouTube Clip

1. Click the floating ➕ button in the bottom-right
2. Paste a YouTube URL
3. Use the embedded player to find your timestamps:
   - Play the video and click "Set Start" at your desired start time
   - Continue playing and click "Set End" at your desired end time
   - Or manually enter timestamps in MM:SS format
4. Add an optional description
5. Click "Post 🎬"

### Reacting to Posts

- Click the ➕ button below any post
- Select an emoji from the picker
- Click the same emoji again to remove your reaction

## Design Philosophy

This One Part features a vibrant, playful design with:

- **Red Primary Color** - Bold and energetic (#EF4444)
- **Rounded Corners** - Everything uses rounded-2xl or rounded-3xl
- **Responsive Buttons** - Satisfying press animations with scale(0.95)
- **Emojis Everywhere** - Fun visual language throughout the app
- **Smooth Animations** - Spring, slide-up, and fade-in effects

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── r/[roomId]/page.tsx         # Room page
│   └── _components/
│       ├── username-modal.tsx      # Username entry modal
│       ├── post-wizard.tsx         # YouTube post wizard
│       ├── post-card.tsx           # Individual post display
│       ├── emoji-picker.tsx        # Emoji reaction picker
│       └── infinite-feed.tsx       # Infinite scroll feed
├── server/
│   ├── api/
│   │   └── routers/
│   │       └── room.ts             # Room tRPC router
│   └── db/
│       └── schema.ts               # Database schema
├── lib/
│   └── username.ts                 # Username management utilities
└── styles/
    └── globals.css                 # Global styles and theme
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio

## Database Schema

### rooms

- `id` - Unique room identifier (nanoid)
- `name` - Room name
- `createdBy` - Creator's username
- `createdAt` - Creation timestamp

### room_posts

- `id` - Post ID
- `roomId` - Foreign key to rooms
- `youtubeUrl` - Full YouTube URL
- `videoId` - Extracted video ID
- `startTime` - Start timestamp (seconds)
- `endTime` - End timestamp (seconds)
- `description` - Optional description
- `createdBy` - Poster's username
- `createdAt` - Post timestamp

### reactions

- `id` - Reaction ID
- `postId` - Foreign key to room_posts
- `emoji` - Emoji character
- `createdBy` - Reactor's username
- `createdAt` - Reaction timestamp

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

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

- Rename "room" to something more fitting (e.g., "playlist", "collection", "archive", "shelf")
- Emphasize the archival/curation aspect over the ephemeral "room" metaphor
- Consider discovery features to explore other users' playlists
- Build out the playlist/collection management experience
