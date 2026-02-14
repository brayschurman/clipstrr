# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js 20+ installed
- ✅ PostgreSQL running
- ✅ pnpm installed (`npm install -g pnpm`)

## 5-Minute Setup

### 1. Database Setup

Make sure PostgreSQL is running. If using the provided script:

```bash
./start-database.sh
```

Or start your own PostgreSQL instance.

### 2. Environment Variables

Your `.env` file should already have:

```env
DATABASE_URL="postgresql://..."
```

Verify the connection string is correct for your setup.

### 3. Install & Migrate

```bash
# Install dependencies (already done)
pnpm install

# Run migrations (already done)
pnpm db:migrate

# Verify everything is good
pnpm typecheck
pnpm lint
```

### 4. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 🎉

## First Use

### Create Your First Room

1. **Enter Username** - You'll be prompted for a username on first visit
2. **Create Room** - Enter a room name like "Test Room 🎬"
3. **Share Link** - Click "Share 🔗" to copy the room URL

### Post Your First Clip

1. **Click the ➕ Button** - Floating button in bottom-right
2. **Paste YouTube URL** - Any YouTube video URL
3. **Set Timestamps**:
   - Play the video to your desired start point
   - Click "Set Start"
   - Play to your desired end point
   - Click "Set End"
   - Or manually enter times (MM:SS format)
4. **Add Description** - Optional note about the clip
5. **Post!** - Click "Post 🎬"

### React to Posts

1. **Click ➕ on any post** - Opens emoji picker
2. **Select emoji** - Choose your reaction
3. **Toggle off** - Click the same emoji again to remove

## Testing the App

### Test Scenarios

1. **Create Multiple Rooms** - Test room isolation
2. **Share Room Link** - Open in incognito/different browser
3. **Post Various Videos** - Test different YouTube URL formats
4. **Add Reactions** - Test emoji toggle behavior
5. **Scroll Feed** - Test infinite scroll with 20+ posts
6. **Mobile View** - Test responsive design

### Sample YouTube URLs to Test

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Migration Issues

```bash
# Reset and re-run migrations
pnpm db:push
```

### Build Issues

```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

## Development Tools

### Drizzle Studio

Visual database browser:

```bash
pnpm db:studio
```

Opens at http://localhost:4983

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

### Format Code

```bash
pnpm format:check
pnpm format:write
```

## Production Build

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

Vercel will automatically:
- Install dependencies
- Run build
- Deploy to edge network

## Need Help?

- Check `README.md` for detailed documentation
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Review component files for inline comments

---

**You're all set!** 🎉 Start creating rooms and sharing clips!
