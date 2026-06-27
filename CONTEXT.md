# SkillHub — Project Context & Architecture Guide

> Use this document as a system prompt when continuing development on SkillHub with any AI assistant. It captures every architectural decision, convention, file structure, and constraint you must follow to keep the codebase consistent.

---

## 1. What is SkillHub?

SkillHub is a "GitHub for AI skills" — a web platform where developers create, version, fork, and share AI coding assistant prompts (called "skills") for tools like Claude, Cursor, Copilot, Windsurf, and Continue. Think of it as npm for prompt engineering.

**Current state:** Full-stack application with Prisma + Neon PostgreSQL backend fully wired. The mock data layer has been removed — all services now query the real database. Clerk authentication is live with webhook-based user sync. All API routes are implemented and functional. The explore page serves as the main landing page. Collection skill management UI is complete — users can add skills from both collection detail pages and skill detail pages.

---

## 2. Tech Stack (exact versions matter)

- **Next.js 16.2.9** (App Router, Turbopack) — NOT Next.js 14 or 15. Key differences:
  - `middleware.ts` is deprecated. We use `proxy.ts` with a named `proxy` export instead.
  - Page params are `Promise<{...}>` that must be awaited: `const { id } = await params`
  - The framework docs are at `node_modules/next/dist/docs/`. Always check these before assuming an API works a certain way.
- **React 19.2.4** with React Compiler enabled (strict ESLint rules from `react-hooks/set-state-in-effect` etc.)
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** with `@tailwindcss/postcss` — syntax differs from v3 (e.g., `bg-(--my-var)` not `bg-[var(--my-var)]`)
- **shadcn/ui** (v4, base-nova style) backed by `@base-ui/react` — NOT Radix UI. Key differences:
  - No `asChild` prop on Button. Use `<Link className={buttonVariants({...})}>` for link-as-button.
  - TooltipTrigger uses `render` prop: `<TooltipTrigger render={<Button />}>children</TooltipTrigger>`
  - Dialog's `onOpenChange` signature: `onOpenChange={(isOpen) => { if (!isOpen) onCancel() }}`
- **Clerk v7** (`@clerk/nextjs@7.5.3`) for auth — NOT Clerk v5/v6. `auth()` returns a Promise.
- **Prisma 7.8** with `@prisma/adapter-neon` — Neon serverless PostgreSQL
- **Zustand 5** for client state
- **Zod v4** — imported as `from 'zod/v4'` (the hookform resolver supports both v3 and v4)
- **lucide-react** for all icons (lighter than @tabler/icons-react — 43 MB vs 94 MB on disk). For filled icon states (liked heart, saved bookmark), use the `fill="currentColor"` prop on the same icon component.
- **next-themes** for dark mode
- **react-hook-form** + `@hookform/resolvers` for forms
- **@uiw/react-md-editor** for the skill content editor (loaded via `dynamic()` with `ssr: false`)
- **react-markdown** + **rehype-highlight** for rendering markdown content
- **sonner** for toast notifications
- **diff** package for version comparison

---

## 3. Project Structure

```
skillhub/
├── app/
│   ├── layout.tsx                    # Root layout (ClerkProvider → ThemeProvider → TooltipProvider → Toaster)
│   ├── globals.css                   # Tailwind imports + shadcn theme variables + tokens + prose + thin scrollbar
│   ├── icon.svg                      # SkillHub favicon (lightning bolt in dark circle)
│   ├── (auth)/                       # Sign-in/sign-up (Clerk components, no layout shell)
│   ├── (app)/                        # Authenticated app (Topbar + Sidebar + main content)
│   │   ├── layout.tsx                # Server component — calls requireAuth(), renders shell with cached sidebar counts
│   │   ├── loading.tsx               # Group-level skeleton fallback
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Server fetches → dashboard-filters.tsx (client filters/tabs)
│   │   │   └── loading.tsx           # Skeleton: stat cards + tab bar + skill grid
│   │   ├── skills/
│   │   │   ├── new/page.tsx          # Client — uses editor store for draft persistence
│   │   │   └── [skillId]/
│   │   │       ├── page.tsx          # Server fetches → skill-detail-client.tsx
│   │   │       ├── edit/page.tsx     # Server fetches → edit-skill-client.tsx
│   │   │       ├── versions/page.tsx # Server fetches → versions-client.tsx
│   │   │       └── loading.tsx       # Skeleton for skill detail/edit/versions
│   │   ├── collections/
│   │   │   ├── page.tsx              # Collections list with server-fetched data
│   │   │   ├── new/
│   │   │   │   ├── page.tsx          # Server page — Breadcrumb + heading
│   │   │   │   └── new-collection-form.tsx  # Client form component
│   │   │   ├── loading.tsx           # Skeleton for collections list
│   │   │   └── [collectionId]/
│   │   │       ├── page.tsx          # Server — collection detail, skills grid, empty state with AddSkillButton
│   │   │       ├── collection-actions.tsx  # Client — Add Skills + Edit + Delete buttons
│   │   │       ├── add-skill-button.tsx    # Client — trigger for AddSkillDialog (used in empty state)
│   │   │       ├── edit/
│   │   │       │   ├── page.tsx      # Server page — Breadcrumb + heading
│   │   │       │   └── edit-collection-form.tsx  # Client form component
│   │   │       └── loading.tsx       # Skeleton for collection detail
│   │   ├── saves/
│   │   │   ├── page.tsx              # Server-fetched saved skills grid
│   │   │   └── loading.tsx           # Skeleton: header + skill grid
│   │   └── settings/page.tsx         # Profile edit form (display name, username, bio)
│   ├── (explore)/                    # Public browsing (Topbar, no sidebar, max-width centered)
│   │   ├── page.tsx                  # Main landing — hero + explore content with server-prefetched data
│   │   ├── explore/
│   │   │   ├── page.tsx              # Explore with Suspense → explore-content.tsx
│   │   │   ├── explore-content.tsx   # Client — search, filters, skills grid, load more
│   │   │   └── loading.tsx           # Skeleton for explore page
│   │   └── [username]/
│   │       ├── page.tsx              # Server fetches → profile-client.tsx
│   │       ├── loading.tsx           # Skeleton for user profile
│   │       └── [skillId]/
│   │           ├── page.tsx          # Server fetches → public-skill-client.tsx
│   │           └── loading.tsx       # Skeleton for public skill detail
│   └── api/
│       ├── webhooks/clerk/route.ts   # Clerk webhook — user.created/updated/deleted sync
│       ├── skills/
│       │   ├── route.ts              # GET (list with filters), POST (create)
│       │   └── [skillId]/
│       │       ├── route.ts          # GET, PATCH, DELETE
│       │       ├── like/route.ts     # POST/DELETE
│       │       ├── save/route.ts     # POST/DELETE (+ sidebar cache invalidation)
│       │       ├── fork/route.ts     # POST (+ sidebar cache invalidation)
│       │       ├── export/route.ts   # GET (file download)
│       │       └── versions/route.ts # GET
│       ├── tags/route.ts             # GET (all tags)
│       ├── users/[username]/route.ts # GET (profile), PATCH (update with username uniqueness check)
│       └── collections/
│           ├── route.ts              # GET (list), POST (create)
│           ├── skill-status/[skillId]/route.ts  # GET (user's collections with membership status for a skill)
│           └── [collectionId]/
│               ├── route.ts          # GET, PATCH, DELETE
│               ├── skills/[skillId]/route.ts    # POST (add skill), DELETE (remove skill)
│               └── follow/route.ts   # POST/DELETE
├── components/
│   ├── ui/                           # shadcn primitives (Button, Card, Badge, Input, Dialog, Tabs, Select, etc.)
│   ├── layout/                       # Topbar, TopbarSearch, Sidebar, ThemeToggle, UserButton, NewSkillButton
│   ├── skills/                       # SkillCard, SkillForm (+ memo'd ContentEditor), SkillDetailView,
│   │                                 # SkillViewerActions, SkillOwnerActions, SkillContentActions,
│   │                                 # SkillExportCard, SkillDiff, SkillEditorSidebar, TargetToolBadge,
│   │                                 # PublicPrivateBadge
│   ├── collections/                  # CollectionCard, FollowButton, AddSkillDialog,
│   │                                 # AddToCollectionDialog, CollectionSkillItem (server),
│   │                                 # SkillRemoveButton (client)
│   ├── explore/                      # ExploreFilters, SkillsGrid, TrendingPanel
│   ├── settings/                     # SettingsForm (profile edit with react-hook-form + Zod validation)
│   └── shared/                       # Breadcrumb, ConfirmDialog, EmptyState (supports children for
│                                     # custom actions), LoadingSkeleton, Toast, ThemeProvider, ClientTabs
├── lib/
│   ├── db.ts                         # PrismaClient with Neon adapter (singleton pattern)
│   ├── auth.ts                       # getCurrentUser(), requireAuth(), requireAuthApi(), getCurrentDbUser()
│   ├── cache.ts                      # unstable_cache wrappers: sidebar counts, username, tags, user profile,
│   │                                 # skill fork origin, skill versions + invalidation helpers for all mutations
│   ├── generated/prisma/             # Prisma generated client (output target)
│   ├── services/                     # Service layer (all backed by Prisma now)
│   │   ├── skill.service.ts          # Full CRUD + like/unlike/save/unsave/fork/versions + batch engagement checks
│   │   ├── collection.service.ts     # Full CRUD + add/remove skills + follow/unfollow
│   │   ├── user.service.ts           # getUserById, getUserByUsername, getUserProfile, updateUser
│   │   ├── tag.service.ts            # getTags()
│   │   └── export.service.ts         # formatSkillForExport() — pure logic, no API call
│   └── validations/
│       ├── skill.ts                  # Zod schemas: createSkillSchema, updateSkillSchema
│       ├── user.ts                   # updateUserSchema
│       └── collection.ts             # createCollectionSchema, updateCollectionSchema
├── hooks/
│   ├── use-copy.ts                   # Clipboard copy with 2s confirmation
│   ├── use-skill.ts                  # Single skill fetcher hook
│   ├── use-skills.ts                 # Paginated skills fetcher with filters
│   └── use-mounted.ts               # SSR-safe mounted check via useSyncExternalStore
├── store/
│   ├── editor-store.ts               # Zustand — skill editor draft state + isDirty
│   └── explore-store.ts              # Zustand — explore page filter state
├── types/
│   ├── skill.ts                      # Skill, SkillWithAuthor, SkillWithRelations, SkillVersion, Tag, TargetTool enum
│   ├── user.ts                       # User, UserProfile
│   ├── collection.ts                 # Collection, CollectionWithSkills
│   └── api.ts                        # ApiResponse<T>, PaginatedResponse<T>
├── config/
│   ├── site.ts                       # SITE_CONFIG (name, description, url, defaultPageSize)
│   └── tools.ts                      # TARGET_TOOLS config with brand colors per tool
├── styles/
│   ├── tokens.css                    # GitHub-inspired design tokens (colors, spacing, radius, fonts)
│   └── prose.css                     # Markdown rendering styles
├── prisma/
│   ├── schema.prisma                 # Full schema with all models, relations, and indexes
│   ├── seed.ts                       # Database seed script (tsx runner)
│   └── migrations/                   # Migration history (init migration applied)
└── proxy.ts                          # Next.js 16 proxy (was middleware.ts) — Clerk route protection
```

---

## 4. Architectural Rules (NON-NEGOTIABLE)

### Server/Client Component Boundaries

This is the most critical architectural decision. We follow a strict pattern:

1. **Pages are server components** that fetch data using `await` — no `useEffect` + `useState` for data loading.
2. **Interactive UI lives in focused client children** that receive pre-fetched data as props.
3. **Components are server by default.** Only add `'use client'` when the component itself uses hooks or event handlers.
4. **Client components CAN be children of server components** — Next.js handles the boundary. Don't mark a parent as client just because it renders a client child.
5. **Push `'use client'` as deep as possible.** Form pages: server page renders Breadcrumb + heading, client component is just the form (e.g., `new-collection-form.tsx`, `edit-collection-form.tsx`). List items with one interactive element: server component for the card, tiny client component for the button (e.g., `CollectionSkillItem` is server, `SkillRemoveButton` is client).
6. **Name client form components `*-form.tsx`** (not `*-client.tsx`) to clarify their role.

Current server/client classification:
- **Server components (no 'use client'):** Topbar, UserButton, Sidebar items, SkillCard, SkillEditorSidebar, SkillDiff, LoadingSkeleton, Breadcrumb, EmptyState, CollectionCard, CollectionSkillItem, PublicPrivateBadge, all shadcn UI wrappers
- **Client components ('use client'):** ThemeToggle, TopbarSearch, NewSkillButton, FollowButton, Sidebar (usePathname), SkillForm (react-hook-form) + ContentEditor (memo'd, useController), SkillDetailView (useCopy), SkillViewerActions (memo'd), SkillOwnerActions, SkillContentActions, SkillRemoveButton, AddSkillDialog, AddSkillButton, AddToCollectionDialog, ExploreFilters (memo'd), SkillsGrid (onClick), TrendingPanel (onClick), ConfirmDialog (Dialog state), Toast (useTheme), TargetToolBadge (useTheme), SettingsForm (react-hook-form), NewCollectionForm, EditCollectionForm, ClientTabs, all page-level client wrappers

### The Service Layer Pattern

```
Components → lib/services/*.service.ts → Prisma (lib/db.ts → Neon PostgreSQL)
```

- Components ONLY import from `lib/services/`. Never from `lib/db.ts` directly (except `lib/cache.ts` and `lib/auth.ts`).
- Each service function maps Prisma results to the app's TypeScript types (Date → ISO string, join tables → flat arrays).
- Service function signatures and return types are stable — don't change them without updating all callers.

### Caching Strategy

- `lib/cache.ts` uses `unstable_cache` with tag-based revalidation for:
  - **Sidebar counts** (saved, public, private, forked, collections) — `revalidate: 60`, tag: `sidebar`
  - **Username lookup** — `revalidate: 300`, tag: `user-profile`
  - **All tags** — `revalidate: 300`, tag: `tags`
  - **User profile** (profile data + public skill count) — `revalidate: 120`, tag: `user-profile`
  - **Skill fork origin** (title + author username) — `revalidate: 300`, tag: `skills`
  - **Skill versions** (version history for a skill) — `revalidate: 300`, tag: `skills`
- Invalidation is wired into all mutation functions:
  - `invalidateSkillMutation()` — called by createSkill, updateSkill, deleteSkill, likeSkill, unlikeSkill, saveSkill, unsaveSkill, forkSkill. Invalidates `skills`, `sidebar`, and `tags`.
  - `invalidateCollectionMutation()` — called by createCollection, updateCollection, deleteCollection, addSkillToCollection, removeSkillFromCollection. Invalidates `collections` and `sidebar`.
  - `invalidateSaves()` — called by saveSkill, unsaveSkill. Invalidates `saves`.
  - `invalidateUserProfile()` — called by updateUser. Invalidates `user-profile`.
- Viewer-specific engagement data (isLiked, isSaved) is NOT cached — it's fetched fresh per request via `batchCheckLikedSaved()` or individual lookups.

### Styling Rules

- **Tailwind classes only** — no inline `style={{}}` except for dynamic values that can't be expressed as static classes (currently only 2 places: TargetToolBadge brand colors, SkillForm tool selector dot).
- **All colors from CSS tokens** defined in `styles/tokens.css`. Zero hardcoded hex in component files.
- **shadcn components for all UI primitives** — Card, Badge, Button, Input, Textarea, Dialog, Select, Tabs, Separator, Skeleton, Avatar, Tooltip, DropdownMenu.
- **Hover states via Tailwind** `hover:` utilities — no `onMouseEnter`/`onMouseLeave` event handlers for styling.
- **GitHub-inspired theme:** dark header bar (`--color-bg-header`), system font stack, 6px border radius, GitHub Primer color palette, `font-weight: 600` for emphasis.
- Both light and dark mode must work. Dark mode tokens are in `styles/tokens.css` under `.dark` and `@media (prefers-color-scheme: dark)`.
- **Thin scrollbars globally:** `scrollbar-width: thin` + WebKit `::-webkit-scrollbar` (6px width, `--border` color thumb). Applied in `globals.css` base layer.
- **Scroll containment:** Both `(app)` and `(explore)` layouts use `h-screen` on the outer wrapper with `overflow-y-auto` on the main content area. The topbar stays fixed while only content scrolls — the browser scrollbar appears only on the content region, not the full page.

### Next.js 16 Specifics

- **Proxy, not middleware:** The file is `proxy.ts` at root, exports a named `proxy` function.
- **Params are Promises:** `export default async function Page({ params }: { params: Promise<{ id: string }> })`
- **useSearchParams needs Suspense:** Any page using `useSearchParams()` must be wrapped in a `<Suspense>` boundary. See the explore page pattern.
- **shadcn CSS import:** `globals.css` imports `shadcn/tailwind.css` — the `shadcn` package MUST stay in `dependencies` (not devDependencies) because this CSS file is needed at build time.

### React 19 + React Compiler Rules

- **No `setState` directly inside `useEffect` body** — triggers the `react-hooks/set-state-in-effect` error. Use `startTransition()` or restructure.
- **For mounted state,** use `useMounted()` hook from `hooks/use-mounted.ts` (built on `useSyncExternalStore`) — not `useState(false)` + `useEffect(() => setMounted(true))`.
- **react-hook-form's `watch()`** triggers a known `react-hooks/incompatible-library` warning — this is expected and can't be fixed. It's a warning, not an error.
- **Hydration mismatches:** Any component that renders differently based on `resolvedTheme` must use `useMounted()` to gate the theme-dependent rendering. See ThemeToggle and TargetToolBadge.

---

## 5. Database

### Provider

**Neon PostgreSQL** via `@prisma/adapter-neon` serverless driver. The Prisma client is configured in `lib/db.ts` with a singleton pattern for dev HMR safety.

### Schema (`prisma/schema.prisma`)

**Models:** User, Skill, SkillVersion, Tag, SkillTag (join), Collection, CollectionSkill (join), SkillLike, SkillSave, CollectionFollow

**Key design decisions:**
- User `id` is the Clerk userId (not auto-generated) — set via webhook sync
- Skill uses denormalized counters (`likesCount`, `savesCount`, `forksCount`) updated in transactions
- SkillVersion stores full content snapshots (not diffs), ordered by `version` number
- Tag has both `name` (display) and `slug` (URL/filter) fields, both unique
- All join tables use composite primary keys
- Cascade deletes on User→Skills, Skill→Versions/Tags/Likes/Saves, Collection→Skills/Follows

**Indexes optimized for common queries:**
- `skills(authorId)`, `skills(isPublic, updatedAt DESC)`, `skills(isPublic, likesCount DESC)`, `skills(isPublic, forksCount DESC)`, `skills(targetTool)`, `skills(updatedAt DESC)`, `skills(forksCount DESC)`
- `skill_versions(skillId)`, `skill_tags(tagId)`, `skill_likes(skillId)`, `skill_saves(skillId)`
- `collections(authorId)`, `collections(isPublic, updatedAt DESC)`

### Seeding

`prisma/seed.ts` (run via `tsx`) populates the database with test data. Configured in `package.json` under `prisma.seed`.

---

## 6. Data Model (TypeScript types)

### TargetTool (enum)
`CLAUDE | CURSOR | COPILOT | WINDSURF | CONTINUE | OTHER`

### Skill
`id, title, description, content (markdown), targetTool, isPublic, version, likesCount, savesCount, forksCount, createdAt, updatedAt, authorId, forkedFromId`

### SkillWithRelations (extends Skill)
Adds: `author: User, tags: Tag[], versions: SkillVersion[], isLiked: boolean, isSaved: boolean`

### User
`id (Clerk userId), username, displayName, bio, avatarUrl, createdAt, updatedAt`

### UserProfile (extends User)
Adds: `skillsCount, followersCount`

### Collection
`id, name, description, isPublic, authorId, createdAt, updatedAt`

### CollectionWithSkills (extends Collection)
Adds: `skills: Skill[], skillsCount?: number`

### Service Function Signatures (must not change)
```typescript
// Skills
getSkills(filters?: SkillFilters): Promise<PaginatedResponse<SkillWithRelations>>
getSkillById(id: string): Promise<SkillWithRelations | null>
getSkillsByUser(userId: string): Promise<SkillWithRelations[]>
createSkill(data: CreateSkillInput): Promise<SkillWithRelations>
updateSkill(id: string, data: UpdateSkillInput): Promise<SkillWithRelations>
deleteSkill(id: string): Promise<void>
forkSkill(id: string, userId: string): Promise<SkillWithRelations>
likeSkill(id: string, userId: string): Promise<void>
unlikeSkill(id: string, userId: string): Promise<void>
saveSkill(id: string, userId: string): Promise<void>
unsaveSkill(id: string, userId: string): Promise<void>
getSavedSkillsByUser(userId: string): Promise<SkillWithRelations[]>
getSkillForkOrigin(forkedFromId: string | null): Promise<{ title: string; authorUsername: string } | null>
getSkillVersions(skillId: string): Promise<SkillVersion[]>

// Collections
getCollections(userId?: string): Promise<PaginatedResponse<CollectionWithSkills>>
getCollectionById(id: string): Promise<CollectionWithSkills | null>
createCollection(data: CreateCollectionInput): Promise<CollectionWithSkills>
updateCollection(id: string, data: UpdateCollectionInput): Promise<CollectionWithSkills>
deleteCollection(id: string): Promise<void>
addSkillToCollection(collectionId: string, skillId: string): Promise<void>
removeSkillFromCollection(collectionId: string, skillId: string): Promise<void>
followCollection(collectionId: string, userId: string): Promise<void>
unfollowCollection(collectionId: string, userId: string): Promise<void>

// Users
getUserById(id: string): Promise<User | null>
getUserByUsername(username: string): Promise<User | null>
getUserProfile(username: string): Promise<UserProfile | null>
updateUser(id: string, data: Partial<Pick<User, 'displayName' | 'username' | 'bio'>>): Promise<User>

// Tags
getTags(): Promise<Tag[]>
```

---

## 7. Authentication

- **Clerk v7** handles all auth. `@clerk/nextjs@7.5.3`.
- `proxy.ts` protects all routes except: `/`, `/explore`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks/clerk`, `/:username/:skillId`
- `lib/auth.ts` exports:
  - `getCurrentUser()` — cached via React `cache()`, returns `{ userId, sessionId } | null`
  - `requireAuth()` — redirects to `/sign-in` if not authenticated
  - `requireAuthApi()` — throws 401 Response if not authenticated, returns `userId`
  - `getCurrentDbUser()` — fetches the full User record from database
- The `(app)` layout calls `await requireAuth()` — redirects to `/sign-in` if not authenticated.
- **Clerk webhook** (`app/api/webhooks/clerk/route.ts`) syncs user data on `user.created`, `user.updated`, `user.deleted` events using `verifyWebhook()`.

---

## 8. What's Built vs. What's Remaining

### BUILT (fully functional with real database):
- **Auth flow:** Clerk sign-in/sign-up, protected routes, webhook user sync
- **App shell:** Topbar with dark header + search (keyboard shortcut `/`), Sidebar with real counts (cached), theme toggle
- **Dashboard:** Stats, tabs, tool filters, sort, skill cards grid — all server-fetched
- **Skill CRUD:** Create with markdown editor, edit with pre-fill, delete with confirmation — all via API routes + Prisma
- **Skill engagement:** Like/unlike, save/unsave, fork — with denormalized counters in transactions
- **Skill detail view:** Owner view (edit/delete/export), public view (like/save/fork), fork origin display
- **Version history:** Timeline, diff view — versions stored as full snapshots
- **Explore / Landing page:** The explore page IS the landing page (`/`). Hero + search, tool/tag/sort filters, URL-synced state, trending panel, load more pagination
- **Public user profiles:** Avatar, bio, stats, skills tab — server-fetched
- **Collections:** Full CRUD (list, create, detail with skills, edit, delete), follow/unfollow, add/remove skills via API and UI
- **Collection skill management UI:** AddSkillDialog (search + add skills from collection detail page with AbortController, debounced search, optimistic "Added" state), AddToCollectionDialog (toggle skills across collections from skill detail page), AddSkillButton in empty collection state, "Add Skills" button in collection header actions
- **Saves page:** Server-fetched saved skills grid with empty state
- **Settings page:** Profile edit form (display name, username with uniqueness check, bio) via API
- **Export service:** Format skills for Claude/Cursor/Copilot/Windsurf/Continue (file download)
- **All API routes:** Fully implemented with Zod validation, auth guards, error handling, cache invalidation
- **Database:** Prisma schema with migrations, indexes, seed data, Neon PostgreSQL
- **Caching:** `unstable_cache` with tag-based revalidation for sidebar counts, username, and tags

### REMAINING (next development phases):
- **Marketing landing page:** The `/` route currently shows explore content. A dedicated marketing/hero page for unauthenticated users could be added.
- **Full-text search:** Search works via Prisma `contains` (case-insensitive). Could upgrade to PostgreSQL full-text search or a dedicated search service for better relevance.
- **Followers count:** `UserProfile.followersCount` is hardcoded to 0 — needs a followers table or count query.
- **Error boundaries:** `error.tsx` exists for `(app)` and `(explore)` route groups plus `global-error.tsx`, but individual route segments could add more specific error handling.
- **SEO:** Add `generateMetadata` to remaining dynamic pages (profile and public skill pages already have it).
- **Testing:** No tests yet — add Vitest + React Testing Library.
- **CI/CD:** No GitHub Actions or deployment config yet.
- **Rate limiting:** Only on `POST /api/skills` (10 requests/60s). Other mutation endpoints don't have rate limiting yet.
- **Image uploads:** Avatar managed through Clerk; no custom image upload support.

---

## 9. Performance Optimizations Already Applied

### Data Layer — Caching
- `unstable_cache` with tag-based revalidation for 8 query functions: sidebar counts, username, tags, user profile, skill fork origin, skill versions (see Section 4 Caching Strategy for full list)
- All mutation functions (create/update/delete/like/save/fork for skills; create/update/delete/add/remove for collections; update for users) call the appropriate invalidation helper to bust stale caches immediately
- Viewer-specific engagement data (isLiked/isSaved) intentionally NOT cached — fetched fresh per request

### Data Layer — Query Optimization
- Batch engagement checks (`batchCheckLikedSaved`) to avoid N+1 queries on skill lists
- `omit: { content: true }` on all list/grid queries (`getSkills`, `getSkillsByUser`, `getSavedSkillsByUser`) AND collection skill includes — the large `@db.Text` content column is excluded everywhere except detail pages
- Collection queries use `_count: { select: { skills: true } }` for efficient skill counting without loading skill rows
- `getCachedUserProfile` uses single Prisma query with `include: { _count: { select: { skills: { where: { isPublic: true } } } } }` — 1 DB round-trip instead of 2 sequential queries
- `upsertTags()` batched with `Promise.all()` instead of sequential for-loop (N tags = 1 round-trip instead of N)
- `getSkillVersions()` uses a single combined query (`select` + `include`) instead of 2 sequential queries
- Auth-check queries in `updateSkill`, `deleteSkill`, `updateCollection`, `deleteCollection`, `addSkillToCollection`, `removeSkillFromCollection` use `select: { authorId: true }` instead of loading full rows
- Database indexes on all common query patterns (see Section 5)
- Prisma `include` preloads used to avoid waterfall queries

### Rendering
- Server components for data fetching (no loading spinners — data available at first render)
- `loading.tsx` skeletons on every route segment for instant navigation feedback
- `@uiw/react-md-editor` loaded via `dynamic()` with loading skeleton; chunk prefetched on hover of "New skill" button
- **ContentEditor isolation:** MDEditor extracted into a `memo`-wrapped component using `useController` — only re-renders when content changes, completely isolated from sibling field changes in the form
- **Debounced draft sync:** `watch(callback)` with 300ms debounce for Zustand editor store sync — prevents cascading parent re-renders on every keystroke
- `useSyncExternalStore` for mounted state (avoids React Compiler issues)
- `useMemo` for filtered/sorted lists in dashboard and explore
- `memo()` on `SkillCard`, `ExploreFilters`, and `SkillViewerActions` to prevent unnecessary re-renders

### Client-Side Fetch Patterns
- **Optimistic updates** for toggles (like, save, follow, add-to-collection) — update UI first, revert on error
- **`router.refresh()` fires immediately** on successful mutation — never deferred to dialog close or unmount
- **AbortController** on search/fetch-on-open patterns (e.g., `AddSkillDialog`) — cancels stale in-flight requests before starting new ones
- **Debounced search** inputs (300ms) with cleanup on unmount via `useEffect` return
- **Dialog initial fetch** uses `useEffect` on `open` prop (not `onOpenChange` callback) — ensures data loads reliably regardless of how the dialog opens
- **State cleanup on dialog close** — `pendingIds` and transient state cleared when dialog closes to prevent stale UI on reopen
- **No redundant navigation** — `router.push()` is followed by `return` to skip unnecessary `router.refresh()` (e.g., `settings-form.tsx` on username change)
- **`setPendingIds` functional updater** for guard checks — avoids adding `pendingIds` to `useCallback` dependency arrays, preventing unnecessary callback recreations

### Bundle Optimization
- **Single icon library:** Consolidated to `lucide-react` only (43 MB vs 94 MB for @tabler/icons-react). Filled states (heart, bookmark) use `fill="currentColor"` prop instead of separate `*Filled` variants.
- **Selective syntax highlighting:** `lib/rehype-highlight.ts` registers only 10 language grammars (javascript, typescript, python, bash, json, yaml, css, xml, sql, markdown) instead of the full `lowlight/common` bundle (~35 grammars). `highlight.js` is a transitive dependency only (via `rehype-highlight → lowlight`), not a direct dependency.
- **`next.config.ts`:** Configured `images.remotePatterns` for Clerk avatar optimization and `serverExternalPackages: ['@prisma/client']` to reduce serverless cold start times by preventing Prisma from being bundled into server functions.

### CSS & Layout
- Tailwind classes instead of inline styles (better CSS optimization)
- Scroll containment: `h-screen` + `overflow-y-auto` on main content — scrollbar only on content area, not full page
- Thin scrollbar styling (6px, `scrollbar-width: thin`)

---

## 10. File Naming Conventions

- `page.tsx` — Next.js page (server component by default)
- `*-form.tsx` — Client form component (e.g., `new-collection-form.tsx`, `edit-collection-form.tsx`)
- `*-client.tsx` — Client component companion to a server page (legacy; prefer `*-form.tsx` for forms)
- `*-button.tsx` / `*-dialog.tsx` — Focused client components for a single interactive element
- `*.service.ts` — Service layer (the import boundary between UI and data)
- `*.tsx` in `components/` — Reusable UI components
- `use-*.ts` in `hooks/` — Custom React hooks
- `*-store.ts` in `store/` — Zustand stores

---

## 11. Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint check
npx tsc --noEmit # TypeScript type check
npx prisma db push    # Push schema to database
npx prisma generate   # Regenerate Prisma client
npx prisma db seed    # Run seed script
```

The build MUST pass with zero TypeScript errors and zero ESLint errors before any commit. The only acceptable warning is the react-hook-form `incompatible-library` informational notice.
