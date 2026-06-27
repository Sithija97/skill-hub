<p align="center">
  <img src="app/icon.svg" width="60" height="60" alt="SkillHub logo" />
</p>

<h1 align="center">SkillHub</h1>

<p align="center">
  <strong>Create, version, and share AI coding skills</strong><br />
  A community platform for prompt engineering — like GitHub, but for AI tool configurations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169e1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2d3748?logo=prisma" alt="Prisma" />
</p>

---

## What is SkillHub?

SkillHub is a platform where developers create, version, fork, and share AI coding assistant prompts (called **skills**) for tools like Claude, Cursor, Copilot, Windsurf, and Continue.

Think of it as **npm for prompt engineering** — browse community skills, fork and customize them, organize them into collections, and export ready-to-use configuration files.

### Key Features

- **Skill CRUD** — Create skills with a markdown editor, tag them, set visibility (public/private), and export as tool-specific config files
- **Version History** — Every edit creates an immutable version snapshot with changelog and inline diff view
- **Forking** — Fork any public skill to customize it, with attribution back to the original
- **Engagement** — Like, save, and comment on community skills
- **Collections** — Organize skills into themed collections (e.g., "Frontend Toolkit"), follow other users' collections
- **Explore** — Search, filter by tool/tag/popularity, trending panel, URL-synced filters
- **Multi-Tool Export** — Download skills formatted for Claude (`CLAUDE.md`), Cursor (`.cursorrules`), Copilot, Windsurf, or Continue
- **Dark/Light Mode** — Full theme support with system preference detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19, React Compiler) |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL via [Neon](https://neon.tech/) (serverless) |
| ORM | [Prisma 7.8](https://www.prisma.io/) with `@prisma/adapter-pg` (TCP pool) |
| Auth | [Clerk v7](https://clerk.com/) (webhook-synced user model) |
| UI | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui v4](https://ui.shadcn.com/) (base-nova) |
| State | [Zustand 5](https://zustand.docs.pmnd.rs/) |
| Validation | [Zod v4](https://zod.dev/) + [react-hook-form](https://react-hook-form.com/) |
| Editor | [@uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/) (dynamic import) |
| Icons | [Lucide React](https://lucide.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.dev/) |

## Getting Started

### Prerequisites

- Node.js >= 22
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) application

### 1. Clone and install

```bash
git clone https://github.com/Sithija97/skill-hub.git
cd skill-hub
npm install
```

### 2. Configure environment

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

ADMIN_USER_IDS="user_abc123"
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed    # Optional: populate with sample data
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (app)/              # Authenticated routes (sidebar layout)
    dashboard/        # User's skills with stats and filters
    skills/           # Create, edit, view skills and versions
    collections/      # Create, manage, browse collections
    saves/            # Bookmarked skills
    settings/         # Profile settings
  (explore)/          # Public routes (no sidebar)
    explore/          # Browse and search all public skills
    [username]/       # Public user profiles and skill views
  api/                # REST API routes

components/
  ui/                 # shadcn/ui primitives
  layout/             # Sidebar, Topbar, Search, ThemeToggle
  skills/             # SkillCard, SkillForm, ViewerActions, etc.
  collections/        # CollectionCard, AddSkillDialog, etc.
  explore/            # SkillsGrid, Filters, TrendingPanel

lib/
  services/           # Server-side business logic
  validations/        # Zod schemas
  cache.ts            # unstable_cache wrappers + invalidation
  auth.ts             # Clerk auth helpers + just-in-time user sync
  db.ts               # Prisma client (pg Pool, singleton)

prisma/
  schema.prisma       # Database schema (10 models)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db seed` | Seed database with sample data |

## Architecture Highlights

- **Server-first rendering** — Pages are server components that fetch data directly. Client components are pushed as deep as possible in the tree.
- **Just-in-time user provisioning** — If a Clerk webhook fails, the app self-heals by creating the user record on next page load.
- **Tag-based cache invalidation** — `unstable_cache` with `revalidateTag()` ensures mutations bust stale data immediately.
- **Optimistic UI** — Like, save, follow, and collection toggles update instantly, reverting on failure.
- **TCP connection pooling** — `pg.Pool` with Prisma's `@prisma/adapter-pg` for persistent database connections.

## Database Schema

```
User ──< Skill ──< SkillVersion
  |        |──< SkillTag >── Tag
  |        |──< SkillLike
  |        |──< SkillSave
  |        └──< CollectionSkill >── Collection ──< CollectionFollow
  └──< Collection
```

10 models: `User`, `Skill`, `SkillVersion`, `Tag`, `SkillTag`, `Collection`, `CollectionSkill`, `SkillLike`, `SkillSave`, `CollectionFollow`

## Deployment

### Vercel (Recommended)

1. Import the repo on [vercel.com](https://vercel.com)
2. Set the **Serverless Function Region** to match your Neon database region
3. Add all environment variables from `.env.local`
4. Deploy

### Clerk Webhook Setup

After deploying, create a webhook endpoint in the [Clerk Dashboard](https://dashboard.clerk.com/):

- **URL:** `https://your-app.vercel.app/api/webhooks/clerk`
- **Events:** `user.created`, `user.updated`, `user.deleted`
- Copy the signing secret to `CLERK_WEBHOOK_SECRET` in Vercel env vars

## License

This project is for educational and portfolio purposes.

---

<p align="center">
  Built with Next.js, Prisma, and Clerk
</p>
