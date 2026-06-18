# SkillHub — Project Context & Architecture Guide

> Use this document as a system prompt when continuing development on SkillHub with any AI assistant. It captures every architectural decision, convention, file structure, and constraint you must follow to keep the codebase consistent.

---

## 1. What is SkillHub?

SkillHub is a "GitHub for AI skills" — a web platform where developers create, version, fork, and share AI coding assistant prompts (called "skills") for tools like Claude, Cursor, Copilot, Windsurf, and Continue. Think of it as npm for prompt engineering.

**Current state:** Frontend complete with mock data layer. Backend (database, real API routes) not yet implemented. The mock layer is designed so that wiring the real backend is a one-line import swap per service file.

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
- **Zustand 5** for client state
- **Zod v4** — imported as `from 'zod/v4'` (the hookform resolver supports both v3 and v4)
- **@tabler/icons-react** for icons (not Lucide — Lucide is only used internally by shadcn components)
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
│   ├── globals.css                   # Tailwind imports + shadcn theme variables + tokens + prose
│   ├── (auth)/                       # Sign-in/sign-up (Clerk components, no layout shell)
│   ├── (marketing)/                  # Landing page (MarketingNav, no sidebar)
│   ├── (app)/                        # Authenticated app (Topbar + Sidebar + main content)
│   │   ├── layout.tsx                # Server component — calls requireAuth(), renders shell
│   │   ├── dashboard/                # page.tsx (server fetches) → dashboard-client.tsx (client filters/tabs)
│   │   ├── skills/
│   │   │   ├── new/page.tsx          # Client — uses editor store for draft persistence
│   │   │   └── [skillId]/
│   │   │       ├── page.tsx          # Server fetches → skill-detail-client.tsx
│   │   │       ├── edit/page.tsx     # Server fetches → edit-skill-client.tsx
│   │   │       └── versions/page.tsx # Server fetches → versions-client.tsx
│   │   ├── collections/             # Stub pages (not yet implemented)
│   │   ├── saves/page.tsx           # Stub
│   │   └── settings/page.tsx        # Stub
│   ├── (explore)/                    # Public browsing (Topbar, no sidebar, max-width centered)
│   │   ├── explore/
│   │   │   ├── page.tsx              # Server with Suspense → explore-content.tsx (client, uses useSearchParams)
│   │   └── [username]/
│   │       ├── page.tsx              # Server fetches → profile-client.tsx
│   │       └── [skillId]/page.tsx    # Server fetches → public-skill-client.tsx
│   └── api/                          # Route handlers (all stubs returning 501, ready for backend wiring)
├── components/
│   ├── ui/                           # shadcn primitives (Button, Card, Badge, Input, Dialog, Tabs, Select, etc.)
│   ├── layout/                       # Topbar, Sidebar, MarketingNav, ThemeToggle, UserButton, NewSkillButton
│   ├── skills/                       # SkillCard, SkillForm, SkillDetailView, TargetToolBadge, etc.
│   ├── collections/                  # CollectionCard, FollowButton
│   ├── explore/                      # ExploreFilters, SkillsGrid, TrendingPanel
│   └── shared/                       # Breadcrumb, ConfirmDialog, EmptyState, LoadingSkeleton, Toast, ThemeProvider
├── lib/
│   ├── auth.ts                       # getCurrentUser(), requireAuth() — wraps Clerk's auth()
│   ├── utils.ts                      # cn() utility (clsx + tailwind-merge)
│   ├── mock/                         # Mock data layer
│   │   ├── data/                     # Raw mock data (users, skills, tags, versions, collections)
│   │   ├── skills.mock.ts            # Mock service functions with SkillFilters, CreateSkillInput types
│   │   ├── collections.mock.ts       # Mock collection service
│   │   └── users.mock.ts             # Mock user service
│   ├── services/                     # Service layer (components import from HERE, never from mock/)
│   │   ├── skill.service.ts          # Re-exports from mock — swap to Prisma calls in backend phase
│   │   ├── collection.service.ts
│   │   ├── user.service.ts
│   │   ├── tag.service.ts
│   │   └── export.service.ts         # formatSkillForExport() — pure logic, no API call
│   └── validations/
│       └── skill.ts                  # Zod schemas: createSkillSchema, updateSkillSchema, skillFiltersSchema
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
└── proxy.ts                          # Next.js 16 proxy (was middleware.ts) — Clerk route protection
```

---

## 4. Architectural Rules (NON-NEGOTIABLE)

### Server/Client Component Boundaries

This is the most critical architectural decision. We follow a strict pattern:

1. **Pages are server components** that fetch data using `await` — no `useEffect` + `useState` for data loading.
2. **Interactive UI lives in thin `-client.tsx` files** that receive pre-fetched data as props.
3. **Components are server by default.** Only add `'use client'` when the component itself uses hooks or event handlers.
4. **Client components CAN be children of server components** — Next.js handles the boundary. Don't mark a parent as client just because it renders a client child.

Current server/client classification:
- **Server components (no 'use client'):** Topbar, MarketingNav, UserButton, Sidebar items, SkillCard, SkillEditorSidebar, SkillDiff, LoadingSkeleton, Breadcrumb, EmptyState, CollectionCard, PublicPrivateBadge, all shadcn UI wrappers
- **Client components ('use client'):** ThemeToggle, NewSkillButton, FollowButton, Sidebar (usePathname), SkillForm (react-hook-form), SkillDetailView (useCopy), ExploreFilters (useState), SkillsGrid (onClick), TrendingPanel (onClick), ConfirmDialog (Dialog state), Toast (useTheme), TargetToolBadge (useTheme), all page `-client.tsx` files

### The Service Layer Pattern

```
Components → lib/services/*.service.ts → lib/mock/*.mock.ts
                                          ↑
                                    (swap to Prisma here)
```

- Components ONLY import from `lib/services/`. Never from `lib/mock/` directly.
- Each service file currently re-exports from the mock layer.
- When wiring the real backend, replace the re-exports with actual Prisma/DB calls. Zero component changes needed.
- Service function signatures and return types are already defined — don't change them.

### Styling Rules

- **Tailwind classes only** — no inline `style={{}}` except for dynamic values that can't be expressed as static classes (currently only 2 places: TargetToolBadge brand colors, SkillForm tool selector dot).
- **All colors from CSS tokens** defined in `styles/tokens.css`. Zero hardcoded hex in component files.
- **shadcn components for all UI primitives** — Card, Badge, Button, Input, Textarea, Dialog, Select, Tabs, Separator, Skeleton, Avatar, Tooltip, DropdownMenu.
- **Hover states via Tailwind** `hover:` utilities — no `onMouseEnter`/`onMouseLeave` event handlers for styling.
- **GitHub-inspired theme:** dark header bar (`--color-bg-header`), system font stack, 6px border radius, GitHub Primer color palette, `font-weight: 600` for emphasis.
- Both light and dark mode must work. Dark mode tokens are in `styles/tokens.css` under `.dark` and `@media (prefers-color-scheme: dark)`.

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

## 5. Data Model

### TargetTool (enum)
`CLAUDE | CURSOR | COPILOT | WINDSURF | CONTINUE | OTHER`

### Skill
`id, title, description, content (markdown), targetTool, isPublic, version, likesCount, savesCount, forksCount, createdAt, updatedAt, authorId, forkedFromId`

### SkillWithRelations (extends Skill)
Adds: `author: User, tags: Tag[], versions: SkillVersion[], isLiked: boolean, isSaved: boolean`

### User
`id (Clerk userId), username, displayName, bio, avatarUrl, createdAt, updatedAt`

### Collection
`id, name, description, isPublic, authorId, createdAt, updatedAt`

### Service Function Signatures (must not change)
```typescript
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
getSkillVersions(skillId: string): Promise<SkillVersion[]>
```

---

## 6. Authentication

- **Clerk v7** handles all auth. `@clerk/nextjs@7.5.3`.
- `proxy.ts` protects all routes except: `/`, `/explore`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks/clerk`, `/:username/:skillId`
- `lib/auth.ts` exports `getCurrentUser()` and `requireAuth()` — wrappers around Clerk's `auth()`.
- The `(app)` layout calls `await requireAuth()` — redirects to `/sign-in` if not authenticated.
- Currently using mock user `user_mock_current` (id: `'user_mock_current'`, username: `'johndoe'`). Replace with real Clerk userId when wiring backend.

---

## 7. What's Built vs. What's Remaining

### BUILT (frontend complete with mock data):
- Auth flow (Clerk sign-in/sign-up, protected routes)
- App shell (Topbar with dark header, Sidebar with active states, theme toggle)
- Dashboard (stats, tabs, tool filters, sort, skill cards grid)
- Skill CRUD (create with markdown editor, edit with pre-fill, delete with confirmation)
- Skill detail view (owner view with edit/delete, public view with like/save/fork)
- Version history (timeline, diff view, restore)
- Explore page (search, tool/tag/sort filters, URL-synced state, trending panel, load more)
- Public user profiles (avatar, bio, stats, skills/collections tabs)
- Export service (format skills for Claude/Cursor/Copilot/Windsurf/Continue)
- Full mock data layer (5 users, 21 skills, 20 tags, 17 versions, 4 collections)

### REMAINING (next development phases):
- **Database:** Set up Prisma with PostgreSQL. Schema should mirror the types in `types/`.
- **Backend wiring:** Replace mock re-exports in `lib/services/*.service.ts` with real Prisma calls.
- **API routes:** Implement the stub route handlers in `app/api/` — they currently return 501.
- **Clerk webhook:** `app/api/webhooks/clerk/route.ts` — sync Clerk user data to the database.
- **Real user context:** Replace hardcoded `'user_mock_current'` with actual Clerk userId from `auth()`.
- **Collections CRUD:** The stub pages at `/collections/new` and `/collections/[id]` need full implementation.
- **Saves page:** `/saves` needs implementation (list user's saved skills).
- **Settings page:** `/settings` needs implementation (profile edit form).
- **Search:** The search bar in the topbar is a placeholder — needs real search implementation.
- **Marketing landing page:** `/` is a stub div.
- **Pagination:** Explore page has "Load more" wired to mock — needs real paginated API.
- **Real-time like/save counts:** Currently optimistic-only against mock data.
- **Error boundaries:** Add proper error.tsx files for each route segment.
- **SEO:** Add generateMetadata to dynamic pages.
- **Testing:** No tests yet — add Vitest + React Testing Library.
- **CI/CD:** No GitHub Actions or deployment config yet.

---

## 8. Performance Optimizations Already Applied

- Server components for data fetching (no loading spinners — data available at first render)
- 15 components converted from client → server (reduced client JS bundle)
- `@uiw/react-md-editor` loaded via `dynamic()` with loading skeleton
- Editor chunk prefetched on hover of "New skill" button
- `useSyncExternalStore` for mounted state (avoids React Compiler issues)
- Tailwind classes instead of inline styles (better CSS optimization)
- `useMemo` for filtered/sorted lists in dashboard and explore

---

## 9. File Naming Conventions

- `page.tsx` — Next.js page (server component by default)
- `*-client.tsx` — Client component companion to a server page
- `*.service.ts` — Service layer (the import boundary between UI and data)
- `*.mock.ts` — Mock implementations
- `*.tsx` in `components/` — Reusable UI components
- `use-*.ts` in `hooks/` — Custom React hooks
- `*-store.ts` in `store/` — Zustand stores

---

## 10. Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint check
npx tsc --noEmit # TypeScript type check
```

The build MUST pass with zero TypeScript errors and zero ESLint errors before any commit. The only acceptable warning is the react-hook-form `incompatible-library` informational notice.
