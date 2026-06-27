@AGENTS.md

# SkillHub — AI Coding Skills Platform

A community platform for creating, sharing, and discovering AI coding tool skills (prompts/rules files for Claude, Cursor, Copilot, Windsurf, Continue, etc.).

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router, React 19, React Compiler)
- **Language:** TypeScript 5 (strict)
- **UI:** Tailwind CSS v4 + shadcn/ui v4 (base-nova style, backed by `@base-ui/react` — NOT Radix)
- **Icons:** lucide-react
- **Database:** PostgreSQL (Neon serverless) via Prisma 7.8
- **Auth:** Clerk v7 (webhook-synced user model, `requireAuth` / `requireAuthApi` helpers in `lib/auth.ts`)
- **Validation:** Zod v4 (import from `zod/v4`) + react-hook-form with `@hookform/resolvers/zod`
- **State:** Zustand 5 for client stores (`store/editor-store.ts`, `store/explore-store.ts`)
- **Toasts:** sonner
- **Caching:** Next.js `unstable_cache` with tag-based invalidation (`lib/cache.ts`)

## Project Structure

```
app/
  (app)/                    # Authenticated routes (sidebar layout)
    dashboard/              # User's skills dashboard with filters
    skills/
      new/                  # Create skill (client form)
      [skillId]/            # Skill detail, edit, versions
    collections/
      new/                  # Create collection (server page + client form)
      [collectionId]/       # Collection detail, edit, add-skill-button
    saves/                  # Saved skills
    settings/               # Profile settings
  (explore)/                # Public routes (no sidebar)
    explore/                # Browse/search skills
    [username]/             # Public profile
    [username]/[skillId]/   # Public skill view
  api/
    skills/                 # CRUD + like, save, fork, export, versions
    collections/            # CRUD + add/remove skills, follow, skill-status
    tags/                   # Tag listing
    users/[username]/       # Profile update
    webhooks/clerk/         # Clerk user sync
    health/                 # Health check
    admin/reconcile-counters/

components/
  ui/                       # shadcn/ui primitives (Button, Dialog, Input, Card, Badge, etc.)
  shared/                   # EmptyState, Breadcrumb, ConfirmDialog, ClientTabs, LoadingSkeleton
  layout/                   # Sidebar, Topbar, TopbarSearch, ThemeToggle, NewSkillButton
  skills/                   # SkillCard, SkillForm, SkillViewerActions, SkillOwnerActions, etc.
  collections/              # AddSkillDialog, AddToCollectionDialog, CollectionCard, FollowButton, etc.
  explore/                  # SkillsGrid, TrendingPanel, ExploreFilters
  settings/                 # SettingsForm

lib/
  services/                 # Server-side business logic (skill, collection, user, tag, export)
  validations/              # Zod schemas (skill, collection, user)
  actions/                  # Server actions (skill.actions.ts)
  cache.ts                  # unstable_cache wrappers + tag invalidation helpers
  auth.ts                   # Clerk auth helpers
  db.ts                     # Prisma client (Neon adapter)
  rate-limit.ts             # In-memory rate limiter
  utils.ts                  # cn() helper

store/                      # Zustand stores (editor-store, explore-store)
hooks/                      # Custom hooks (use-copy, use-mounted, use-skill, use-skills)
types/                      # TypeScript interfaces (skill, collection, user, api)
config/                     # Site config, tools config
prisma/schema.prisma        # Database schema
```

## Data Models

- **User** — Clerk-synced (id = Clerk userId), has skills, collections, likes, saves, follows
- **Skill** — Title, description, content (markdown), targetTool enum, version tracking, fork chain
- **Collection** — Named group of skills, public/private, followable
- **Tag** — Name + slug, many-to-many with skills via SkillTag
- **SkillVersion** — Immutable content snapshots with changelog
- **SkillLike / SkillSave** — User engagement, with denormalized counts on Skill
- **CollectionSkill** — Join table with addedAt timestamp
- **CollectionFollow** — User follows on collections

## Key Conventions

### Server vs Client Components
- Pages are server components; interactive parts are extracted into focused client children
- Push `'use client'` boundaries as deep as possible — only the interactive piece should be client
- Form pages: server page renders Breadcrumb + heading, client component is just the form
- List items with one interactive element: server component for the card, tiny client component for the button

### API Patterns
- Route handlers in `app/api/` use `requireAuthApi()` for auth
- Services in `lib/services/` contain all DB logic; route handlers are thin
- Mutations invalidate cache tags via `invalidateSkillMutation()`, `invalidateCollectionMutation()`, etc.
- Pagination: `{ data, total, page, pageSize, hasMore }` shape (`PaginatedResponse<T>`)

### Client-Side Fetch Patterns
- Optimistic updates for toggles (like, save, follow) — update UI first, revert on error
- `router.refresh()` fires immediately on successful mutation (not deferred to dialog close)
- AbortController on search/fetch-on-open patterns to cancel stale requests
- Debounced search inputs (300ms) with cleanup on unmount
- Dialogs: use `useEffect` on `open` prop to trigger initial data fetch (not `onOpenChange` callback)

### Styling
- Tailwind v4 with CSS variables for theming (light/dark via next-themes)
- Button variants: default, outline, secondary, ghost, destructive, link
- Button sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
- Consistent spacing: `gap-2` for button groups, `gap-4` for card grids, `gap-6` for form sections

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type-check
```
