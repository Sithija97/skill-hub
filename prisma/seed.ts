import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma/client'
import { TargetTool } from '../lib/generated/prisma/enums'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
})

async function main() {
  console.log('Seeding database...')

  // ── Users ──
  const users = [
    { id: 'user_mock_current', username: 'johndoe', displayName: 'John Doe', bio: 'Full-stack developer. Building tools that help developers ship faster.', avatarUrl: null, createdAt: new Date('2024-09-15T08:00:00Z'), updatedAt: new Date('2025-06-10T14:30:00Z') },
    { id: 'user_mock_2', username: 'sarahcodes', displayName: 'Sarah Chen', bio: 'Senior engineer at a fintech startup. Python and TypeScript enthusiast.', avatarUrl: null, createdAt: new Date('2024-10-02T10:15:00Z'), updatedAt: new Date('2025-05-28T09:00:00Z') },
    { id: 'user_mock_3', username: 'devmarcus', displayName: 'Marcus Rivera', bio: 'DevOps engineer. Automating everything that can be automated.', avatarUrl: null, createdAt: new Date('2024-11-18T16:45:00Z'), updatedAt: new Date('2025-06-01T11:20:00Z') },
    { id: 'user_mock_4', username: 'emmadev', displayName: 'Emma Larsson', bio: 'Frontend architect. Design systems and accessibility advocate.', avatarUrl: null, createdAt: new Date('2024-08-20T12:00:00Z'), updatedAt: new Date('2025-06-05T18:10:00Z') },
    { id: 'user_mock_5', username: 'kaizhang', displayName: 'Kai Zhang', bio: null, avatarUrl: null, createdAt: new Date('2025-01-10T07:30:00Z'), updatedAt: new Date('2025-06-12T15:45:00Z') },
  ]

  for (const u of users) {
    await prisma.user.upsert({ where: { id: u.id }, update: u, create: u })
  }
  console.log(`  ✓ ${users.length} users`)

  // ── Tags ──
  const tags = [
    { id: 'tag_1', name: 'Python', slug: 'python' },
    { id: 'tag_2', name: 'TypeScript', slug: 'typescript' },
    { id: 'tag_3', name: 'React', slug: 'react' },
    { id: 'tag_4', name: 'Code Review', slug: 'code-review' },
    { id: 'tag_5', name: 'Refactor', slug: 'refactor' },
    { id: 'tag_6', name: 'Documentation', slug: 'documentation' },
    { id: 'tag_7', name: 'Testing', slug: 'testing' },
    { id: 'tag_8', name: 'SQL', slug: 'sql' },
    { id: 'tag_9', name: 'Performance', slug: 'performance' },
    { id: 'tag_10', name: 'Security', slug: 'security' },
    { id: 'tag_11', name: 'Git', slug: 'git' },
    { id: 'tag_12', name: 'API', slug: 'api' },
    { id: 'tag_13', name: 'Next.js', slug: 'nextjs' },
    { id: 'tag_14', name: 'Prisma', slug: 'prisma' },
    { id: 'tag_15', name: 'Debugging', slug: 'debugging' },
    { id: 'tag_16', name: 'Architecture', slug: 'architecture' },
    { id: 'tag_17', name: 'DevOps', slug: 'devops' },
    { id: 'tag_18', name: 'Accessibility', slug: 'accessibility' },
    { id: 'tag_19', name: 'Design System', slug: 'design-system' },
    { id: 'tag_20', name: 'AI Prompts', slug: 'ai-prompts' },
  ]

  for (const t of tags) {
    await prisma.tag.upsert({ where: { id: t.id }, update: t, create: t })
  }
  console.log(`  ✓ ${tags.length} tags`)

  // ── Helper: find tag IDs by slug ──
  function tagIds(...slugs: string[]) {
    return slugs.map((s) => {
      const t = tags.find((tag) => tag.slug === s)
      if (!t) throw new Error(`Tag not found: ${s}`)
      return { tagId: t.id }
    })
  }

  // ── Skills ──
  // Minimal content for seed — the full markdown content from mock data is long,
  // using abbreviated versions here to keep the seed manageable
  const skills: Array<{
    id: string; title: string; description: string; content: string;
    targetTool: TargetTool; isPublic: boolean; version: number;
    likesCount: number; savesCount: number; forksCount: number;
    authorId: string; forkedFromId: string | null;
    createdAt: Date; updatedAt: Date;
    tagSlugs: string[];
  }> = [
    { id: 'skill_1', title: 'Python Code Reviewer', description: 'Thorough Python code review with focus on idioms, performance, and type safety.', content: '# Python Code Reviewer\n\nYou are an expert Python code reviewer. Analyze code for: Pythonic idioms, type safety, performance, error handling, and testing.\n\n## Review Checklist\n1. **Pythonic idioms** — Flag non-idiomatic patterns\n2. **Type safety** — Check for missing type hints\n3. **Performance** — Identify O(n²) loops\n4. **Error handling** — Check for bare except\n5. **Testing** — Note untestable patterns\n\n## Output Format\n- **Severity**: critical / warning / suggestion\n- **What**: one-sentence description\n- **Fix**: concrete code snippet', targetTool: TargetTool.CLAUDE, isPublic: true, version: 3, likesCount: 127, savesCount: 68, forksCount: 22, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-01-15T10:00:00Z'), updatedAt: new Date('2025-06-08T14:30:00Z'), tagSlugs: ['python', 'code-review', 'performance'] },
    { id: 'skill_2', title: 'React Component Architect', description: 'Designs React components with clean APIs, proper composition, and accessibility baked in.', content: '# React Component Architect\n\nYou are a senior React component designer.\n\n## Design Process\n1. **API first** — Define props interface before JSX\n2. **Composition over configuration** — Prefer compound components\n3. **Accessibility** — Every interactive component must have proper ARIA\n4. **Styling** — Use CSS variables for theming\n5. **State management** — Colocate state', targetTool: TargetTool.CURSOR, isPublic: true, version: 2, likesCount: 89, savesCount: 45, forksCount: 11, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-02-20T09:15:00Z'), updatedAt: new Date('2025-05-30T16:00:00Z'), tagSlugs: ['react', 'typescript', 'accessibility', 'design-system'] },
    { id: 'skill_3', title: 'SQL Query Optimizer', description: 'Analyzes SQL queries and suggests index, join, and structure optimizations.', content: '# SQL Query Optimizer\n\nYou are a database performance expert.\n\n## Analysis Steps\n1. **Scan patterns** — Identify full table scans\n2. **Join analysis** — Check join order and missing indexes\n3. **Index recommendations** — Suggest composite indexes\n4. **Subquery elimination** — Convert to JOINs or CTEs\n5. **Pagination** — Recommend keyset pagination', targetTool: TargetTool.COPILOT, isPublic: true, version: 1, likesCount: 56, savesCount: 31, forksCount: 8, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-03-10T11:30:00Z'), updatedAt: new Date('2025-03-10T11:30:00Z'), tagSlugs: ['sql', 'performance'] },
    { id: 'skill_4', title: 'Git Commit Message Writer', description: 'Generates clear, conventional commit messages from diffs.', content: '# Git Commit Message Writer\n\nYou write precise git commit messages following Conventional Commits.\n\n## Rules\n1. **Format**: `<type>(<scope>): <description>`\n2. **Body**: Explain *why*, not *what*\n3. **Breaking changes**: Add `BREAKING CHANGE:` footer\n4. **Multiple changes**: Suggest splitting', targetTool: TargetTool.CLAUDE, isPublic: true, version: 4, likesCount: 148, savesCount: 79, forksCount: 25, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2024-12-01T08:00:00Z'), updatedAt: new Date('2025-06-14T10:00:00Z'), tagSlugs: ['git', 'documentation'] },
    { id: 'skill_5', title: 'API Documentation Generator', description: 'Creates OpenAPI-style documentation from route handler code.', content: '# API Documentation Generator\n\nYou generate clear, complete API documentation from source code.\n\n## Output Structure\n- **Method & Path**\n- **Auth**: Required or public\n- **Parameters**: Path params, query params\n- **Request Body**: JSON schema\n- **Response**: Success shape with example\n- **Errors**: Possible error codes', targetTool: TargetTool.WINDSURF, isPublic: false, version: 1, likesCount: 12, savesCount: 8, forksCount: 0, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-04-05T14:20:00Z'), updatedAt: new Date('2025-04-05T14:20:00Z'), tagSlugs: ['api', 'documentation'] },
    { id: 'skill_6', title: 'Prisma Schema Designer', description: 'Designs Prisma schemas from requirements with proper relations and indexes.', content: '# Prisma Schema Designer\n\nYou are a database architect specializing in Prisma ORM.\n\n## Principles\n1. **Naming** — PascalCase models, camelCase fields\n2. **Relations** — Always define both sides\n3. **Indexes** — Add for WHERE and ORDER BY columns\n4. **Soft deletes** — Include deletedAt\n5. **Timestamps** — createdAt and updatedAt on every model', targetTool: TargetTool.CURSOR, isPublic: false, version: 2, likesCount: 34, savesCount: 19, forksCount: 5, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-02-28T16:45:00Z'), updatedAt: new Date('2025-05-15T09:30:00Z'), tagSlugs: ['prisma', 'architecture', 'sql'] },
    { id: 'skill_7', title: 'Test Case Generator', description: 'Generates comprehensive test suites from function implementations.', content: '# Test Case Generator\n\nYou write comprehensive test suites.\n\n## Process\n1. Read the code\n2. Identify test categories: happy path, edge cases, error cases, integration\n3. Write tests with one assertion per test\n4. Use descriptive test names\n5. Use factories for test data', targetTool: TargetTool.COPILOT, isPublic: false, version: 2, likesCount: 42, savesCount: 28, forksCount: 3, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-03-22T13:00:00Z'), updatedAt: new Date('2025-05-20T11:15:00Z'), tagSlugs: ['testing', 'typescript'] },
    { id: 'skill_8', title: 'Next.js Route Handler Builder', description: 'Scaffolds type-safe Next.js App Router API route handlers with validation.', content: '# Next.js Route Handler Builder\n\nYou build Next.js App Router route handlers.\n\n## Structure\n1. Zod schemas for request validation\n2. Handler functions for each HTTP method\n3. Proper error handling with consistent response shape\n4. Auth checks using the auth helper', targetTool: TargetTool.CLAUDE, isPublic: false, version: 1, likesCount: 18, savesCount: 11, forksCount: 2, authorId: 'user_mock_current', forkedFromId: null, createdAt: new Date('2025-05-01T15:30:00Z'), updatedAt: new Date('2025-05-01T15:30:00Z'), tagSlugs: ['nextjs', 'api', 'typescript'] },
    { id: 'skill_9', title: 'Accessibility Audit Checklist', description: 'Audits web UIs against WCAG 2.1 AA with concrete fix suggestions.', content: '# Accessibility Audit Checklist\n\nYou are a web accessibility expert. Audit against WCAG 2.1 Level AA.\n\n## Categories\n1. **Perceivable** — alt text, contrast\n2. **Operable** — keyboard accessible, focus order\n3. **Understandable** — form labels, error messages\n4. **Robust** — valid HTML, ARIA roles', targetTool: TargetTool.CLAUDE, isPublic: true, version: 3, likesCount: 95, savesCount: 52, forksCount: 14, authorId: 'user_mock_4', forkedFromId: null, createdAt: new Date('2025-01-08T09:00:00Z'), updatedAt: new Date('2025-06-01T12:00:00Z'), tagSlugs: ['accessibility', 'code-review'] },
    { id: 'skill_10', title: 'DevOps Pipeline Reviewer', description: 'Reviews CI/CD configs for security, speed, and reliability issues.', content: '# DevOps Pipeline Reviewer\n\nYou review CI/CD pipeline configurations.\n\n## Review Areas\n1. **Security** — Secrets in env vars, pinned action versions\n2. **Speed** — Proper caching, parallel jobs\n3. **Reliability** — Retry logic, timeout limits\n4. **Cost** — Right-sized runners', targetTool: TargetTool.WINDSURF, isPublic: true, version: 1, likesCount: 38, savesCount: 21, forksCount: 4, authorId: 'user_mock_3', forkedFromId: null, createdAt: new Date('2025-04-12T10:30:00Z'), updatedAt: new Date('2025-04-12T10:30:00Z'), tagSlugs: ['devops', 'security', 'code-review'] },
    { id: 'skill_11', title: 'TypeScript Type Wizard', description: 'Solves complex TypeScript type challenges and explains advanced type patterns.', content: '# TypeScript Type Wizard\n\nYou are a TypeScript type system expert.\n\n## Capabilities\n- Conditional types, mapped types, template literal types\n- Infer keyword patterns\n- Discriminated unions and exhaustive checking\n- Generic constraints and variance', targetTool: TargetTool.CURSOR, isPublic: true, version: 2, likesCount: 112, savesCount: 64, forksCount: 18, authorId: 'user_mock_2', forkedFromId: null, createdAt: new Date('2024-11-20T14:00:00Z'), updatedAt: new Date('2025-05-22T08:45:00Z'), tagSlugs: ['typescript'] },
    { id: 'skill_12', title: 'Performance Profiler', description: 'Identifies React rendering bottlenecks and suggests optimization strategies.', content: '# Performance Profiler\n\nYou diagnose and fix React performance issues.\n\n## Common Issues\n1. **Unnecessary re-renders**\n2. **Large lists** without virtualization\n3. **Bundle size** — heavy imports\n4. **State location** — state too high in tree\n5. **Effect chains** — useEffect waterfalls', targetTool: TargetTool.CONTINUE, isPublic: true, version: 1, likesCount: 67, savesCount: 38, forksCount: 9, authorId: 'user_mock_2', forkedFromId: null, createdAt: new Date('2025-03-01T11:00:00Z'), updatedAt: new Date('2025-03-01T11:00:00Z'), tagSlugs: ['react', 'performance'] },
    { id: 'skill_13', title: 'Security Code Scanner', description: 'Scans code for OWASP Top 10 vulnerabilities with fix recommendations.', content: '# Security Code Scanner\n\nYou scan application code for security vulnerabilities.\n\n## Scan Categories\n1. **Injection** — SQL injection, command injection\n2. **Broken Auth** — Hardcoded credentials\n3. **Sensitive Data Exposure** — Secrets in source\n4. **XSS** — Unescaped user input\n5. **CSRF** — Missing CSRF tokens', targetTool: TargetTool.CLAUDE, isPublic: true, version: 4, likesCount: 134, savesCount: 71, forksCount: 19, authorId: 'user_mock_3', forkedFromId: null, createdAt: new Date('2024-10-15T08:30:00Z'), updatedAt: new Date('2025-06-10T16:00:00Z'), tagSlugs: ['security', 'code-review'] },
    { id: 'skill_14', title: 'Refactoring Companion', description: 'Suggests refactoring patterns to reduce complexity and improve readability.', content: '# Refactoring Companion\n\nYou help developers refactor code.\n\n## Patterns\n- Extract function\n- Replace conditional with polymorphism\n- Introduce parameter object\n- Replace magic numbers\n- Simplify boolean expressions\n- Remove dead code', targetTool: TargetTool.COPILOT, isPublic: true, version: 2, likesCount: 78, savesCount: 42, forksCount: 7, authorId: 'user_mock_4', forkedFromId: null, createdAt: new Date('2025-02-10T09:45:00Z'), updatedAt: new Date('2025-05-08T13:20:00Z'), tagSlugs: ['refactor', 'code-review'] },
    { id: 'skill_15', title: 'Debugging Detective', description: 'Systematic approach to tracking down and fixing bugs from error messages and logs.', content: '# Debugging Detective\n\nYou are a systematic debugger.\n\n## Method\n1. **Reproduce** — Clarify exact steps\n2. **Isolate** — Narrow the scope\n3. **Hypothesize** — Form 2-3 hypotheses\n4. **Verify** — Suggest specific checks\n5. **Fix** — Provide minimal fix\n6. **Prevent** — Suggest a test', targetTool: TargetTool.OTHER, isPublic: true, version: 1, likesCount: 53, savesCount: 29, forksCount: 6, authorId: 'user_mock_5', forkedFromId: null, createdAt: new Date('2025-04-20T16:00:00Z'), updatedAt: new Date('2025-04-20T16:00:00Z'), tagSlugs: ['debugging'] },
    { id: 'skill_16', title: 'Design System Token Generator', description: 'Generates design tokens from a brand color input.', content: '# Design System Token Generator\n\nYou generate a complete design token system from a single brand color.\n\n## Process\n1. Take the brand color as input\n2. Generate a full ramp (50-900)\n3. Create semantic aliases\n4. Add dark mode mappings\n5. Generate spacing and type scales', targetTool: TargetTool.CURSOR, isPublic: true, version: 1, likesCount: 41, savesCount: 25, forksCount: 3, authorId: 'user_mock_4', forkedFromId: null, createdAt: new Date('2025-05-10T10:15:00Z'), updatedAt: new Date('2025-05-10T10:15:00Z'), tagSlugs: ['design-system', 'accessibility'] },
    { id: 'skill_17', title: 'Architecture Decision Recorder', description: 'Writes Architecture Decision Records (ADRs) from technical discussions.', content: '# Architecture Decision Recorder\n\nYou create ADRs from technical discussions.\n\n## Template\n- **Title**: Short imperative phrase\n- **Status**: Proposed / Accepted / Deprecated\n- **Context**: Technical and business context\n- **Decision**: Clear statement\n- **Consequences**: What becomes easier/harder', targetTool: TargetTool.WINDSURF, isPublic: true, version: 1, likesCount: 29, savesCount: 18, forksCount: 2, authorId: 'user_mock_3', forkedFromId: null, createdAt: new Date('2025-05-25T14:30:00Z'), updatedAt: new Date('2025-05-25T14:30:00Z'), tagSlugs: ['architecture', 'documentation'] },
    { id: 'skill_18', title: 'AI Prompt Engineer', description: 'Improves and optimizes AI prompts for clarity, specificity, and reliability.', content: '# AI Prompt Engineer\n\nYou optimize AI prompts for clarity and reliability.\n\n## Dimensions\n1. **Clarity** — Remove ambiguity\n2. **Structure** — Add sections and steps\n3. **Constraints** — Add guardrails\n4. **Examples** — Add few-shot examples\n5. **Robustness** — Test edge cases', targetTool: TargetTool.CLAUDE, isPublic: true, version: 3, likesCount: 86, savesCount: 47, forksCount: 12, authorId: 'user_mock_2', forkedFromId: null, createdAt: new Date('2025-01-25T11:00:00Z'), updatedAt: new Date('2025-06-05T09:30:00Z'), tagSlugs: ['ai-prompts'] },
    { id: 'skill_19', title: 'Python Code Reviewer (Forked)', description: 'Forked version with added Django-specific review rules.', content: '# Python Code Reviewer (Django Edition)\n\nYou are an expert Python code reviewer with deep Django knowledge.\n\n## Django-Specific Checks\n1. **N+1 queries** — Flag missing select_related/prefetch_related\n2. **Fat models** — Business logic in models, not views\n3. **Security** — Raw SQL, unvalidated input\n4. **Migrations** — Data vs schema migrations', targetTool: TargetTool.CLAUDE, isPublic: true, version: 1, likesCount: 23, savesCount: 14, forksCount: 1, authorId: 'user_mock_2', forkedFromId: 'skill_1', createdAt: new Date('2025-04-01T13:00:00Z'), updatedAt: new Date('2025-04-01T13:00:00Z'), tagSlugs: ['python', 'code-review'] },
    { id: 'skill_20', title: 'React Component Architect (Vue Adapter)', description: 'Adapts the component architect skill for Vue 3 Composition API.', content: '# Vue 3 Component Architect\n\nYou are a senior Vue 3 component designer using Composition API.\n\n## Design Process\n1. **API first** — defineProps and defineEmits with TypeScript\n2. **Composables over mixins** — use* pattern\n3. **Accessibility** — WCAG compliance\n4. **Styling** — CSS variables, scoped styles\n5. **State** — ref/reactive locally, Pinia for shared', targetTool: TargetTool.CONTINUE, isPublic: true, version: 1, likesCount: 15, savesCount: 9, forksCount: 0, authorId: 'user_mock_5', forkedFromId: 'skill_2', createdAt: new Date('2025-05-15T08:45:00Z'), updatedAt: new Date('2025-05-15T08:45:00Z'), tagSlugs: ['architecture', 'design-system'] },
    { id: 'skill_21', title: 'SQL Query Optimizer (PostgreSQL)', description: 'Forked SQL optimizer with PostgreSQL-specific features.', content: '# SQL Query Optimizer (PostgreSQL)\n\nYou are a PostgreSQL performance expert.\n\n## PostgreSQL-Specific\n1. **CTEs** — Use MATERIALIZED hint when needed\n2. **Window functions** — Replace self-joins\n3. **Partial indexes** — For common filter patterns\n4. **JSONB** — GIN indexes for containment\n5. **EXPLAIN** — Use (ANALYZE, BUFFERS, FORMAT TEXT)', targetTool: TargetTool.COPILOT, isPublic: true, version: 1, likesCount: 31, savesCount: 17, forksCount: 2, authorId: 'user_mock_3', forkedFromId: 'skill_3', createdAt: new Date('2025-05-28T11:30:00Z'), updatedAt: new Date('2025-05-28T11:30:00Z'), tagSlugs: ['sql', 'performance'] },
  ]

  for (const { tagSlugs, ...skill } of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: { ...skill, tags: { deleteMany: {}, create: tagIds(...tagSlugs) } },
      create: { ...skill, tags: { create: tagIds(...tagSlugs) } },
    })
  }
  console.log(`  ✓ ${skills.length} skills with tag connections`)

  // ── Skill Versions ──
  const versions = [
    { id: 'ver_1_1', skillId: 'skill_1', version: 1, content: '# Python Code Reviewer\n\nYou review Python code for basic issues: naming, formatting, and obvious bugs.', changelog: 'Initial version with basic Python review checklist.', createdAt: new Date('2025-01-15T10:00:00Z') },
    { id: 'ver_1_2', skillId: 'skill_1', version: 2, content: '# Python Code Reviewer\n\nYou are an expert Python code reviewer. Analyze code for: Pythonic idioms, type safety, performance issues, and error handling.', changelog: 'Added type safety checks and structured output format.', createdAt: new Date('2025-03-20T14:00:00Z') },
    { id: 'ver_1_3', skillId: 'skill_1', version: 3, content: '# Python Code Reviewer\n\nYou are an expert Python code reviewer. Analyze thoroughly: Pythonic idioms, type safety, performance, error handling, and testing.', changelog: 'Added testing dimension and detailed output format.', createdAt: new Date('2025-06-08T14:30:00Z') },
    { id: 'ver_2_1', skillId: 'skill_2', version: 1, content: '# React Component Architect\n\nYou design React components. Focus on clean props, composition, and accessibility.', changelog: 'Initial version with basic component design guidelines.', createdAt: new Date('2025-02-20T09:15:00Z') },
    { id: 'ver_2_2', skillId: 'skill_2', version: 2, content: '# React Component Architect\n\nYou are a senior React component designer. Follow: API first, composition over configuration, accessibility, CSS variables, colocated state.', changelog: 'Expanded with compound component patterns and CSS variable theming.', createdAt: new Date('2025-05-30T16:00:00Z') },
    { id: 'ver_3_1', skillId: 'skill_3', version: 1, content: '# SQL Query Optimizer\n\nYou are a database performance expert. Analyze SQL queries for scan patterns, join issues, missing indexes.', changelog: 'Initial version.', createdAt: new Date('2025-03-10T11:30:00Z') },
    { id: 'ver_4_1', skillId: 'skill_4', version: 1, content: '# Git Commit Writer\n\nWrite commit messages: type: description. Keep under 72 chars.', changelog: 'Initial version with basic conventional commit format.', createdAt: new Date('2024-12-01T08:00:00Z') },
    { id: 'ver_4_2', skillId: 'skill_4', version: 2, content: '# Git Commit Writer\n\nWrite conventional commit messages. Format: type(scope): description.', changelog: 'Added scope support and expanded commit types.', createdAt: new Date('2025-01-20T10:00:00Z') },
    { id: 'ver_4_3', skillId: 'skill_4', version: 3, content: '# Git Commit Writer\n\nWrite conventional commit messages from diffs. Include breaking change support.', changelog: 'Added breaking change support and diff splitting suggestions.', createdAt: new Date('2025-04-10T12:00:00Z') },
    { id: 'ver_4_4', skillId: 'skill_4', version: 4, content: '# Git Commit Message Writer\n\nYou write precise git commit messages following the Conventional Commits specification.', changelog: 'Refined wording for clarity and added imperative mood rule.', createdAt: new Date('2025-06-14T10:00:00Z') },
    { id: 'ver_5_1', skillId: 'skill_5', version: 1, content: '# API Documentation Generator\n\nGenerate OpenAPI-style documentation from route handler code.', changelog: 'Initial version.', createdAt: new Date('2025-04-05T14:20:00Z') },
    { id: 'ver_6_1', skillId: 'skill_6', version: 1, content: '# Prisma Schema Designer\n\nDesign Prisma schemas from requirements. Use proper naming, relations, and indexes.', changelog: 'Initial version with basic schema design guidelines.', createdAt: new Date('2025-02-28T16:45:00Z') },
    { id: 'ver_6_2', skillId: 'skill_6', version: 2, content: '# Prisma Schema Designer\n\nYou are a database architect specializing in Prisma ORM. Follow: PascalCase models, bidirectional relations, composite indexes, soft deletes, timestamps, and Prisma enums.', changelog: 'Added soft delete pattern, enum guidance, and index recommendations.', createdAt: new Date('2025-05-15T09:30:00Z') },
    { id: 'ver_7_1', skillId: 'skill_7', version: 1, content: '# Test Case Generator\n\nGenerate test cases for functions. Cover happy path, edge cases, and error cases.', changelog: 'Initial version with basic test categories.', createdAt: new Date('2025-03-22T13:00:00Z') },
    { id: 'ver_7_2', skillId: 'skill_7', version: 2, content: '# Test Case Generator\n\nWrite comprehensive test suites. Process: read code, identify categories, write tests with one assertion per test, descriptive names, factories.', changelog: 'Added integration test category and test data factory pattern.', createdAt: new Date('2025-05-20T11:15:00Z') },
    { id: 'ver_8_1', skillId: 'skill_8', version: 1, content: '# Next.js Route Handler Builder\n\nBuild type-safe Next.js App Router route handlers with Zod validation, error handling, and auth checks.', changelog: 'Initial version.', createdAt: new Date('2025-05-01T15:30:00Z') },
  ]

  for (const v of versions) {
    await prisma.skillVersion.upsert({ where: { id: v.id }, update: v, create: v })
  }
  console.log(`  ✓ ${versions.length} skill versions`)

  // ── Collections ──
  const collections = [
    { id: 'col_1', name: 'Code Review Toolkit', description: 'My go-to skills for thorough code reviews across different languages and frameworks.', isPublic: true, authorId: 'user_mock_current', createdAt: new Date('2025-02-01T10:00:00Z'), updatedAt: new Date('2025-06-10T14:00:00Z'), skillIds: ['skill_1', 'skill_9', 'skill_13', 'skill_14'] },
    { id: 'col_2', name: 'Personal Workflow', description: 'Private collection of skills I use daily for development tasks.', isPublic: false, authorId: 'user_mock_current', createdAt: new Date('2025-03-15T09:30:00Z'), updatedAt: new Date('2025-06-08T11:00:00Z'), skillIds: ['skill_4', 'skill_6', 'skill_7', 'skill_8', 'skill_3'] },
    { id: 'col_3', name: 'Frontend Essentials', description: 'Essential skills for frontend developers — React, accessibility, performance, and design systems.', isPublic: true, authorId: 'user_mock_4', createdAt: new Date('2025-01-20T14:00:00Z'), updatedAt: new Date('2025-05-30T16:30:00Z'), skillIds: ['skill_2', 'skill_9', 'skill_12', 'skill_16'] },
    { id: 'col_4', name: 'Backend & Infrastructure', description: 'Skills for backend development, database design, and DevOps workflows.', isPublic: true, authorId: 'user_mock_3', createdAt: new Date('2025-02-10T11:15:00Z'), updatedAt: new Date('2025-06-01T13:45:00Z'), skillIds: ['skill_3', 'skill_6', 'skill_10', 'skill_21'] },
  ]

  for (const { skillIds, ...col } of collections) {
    await prisma.collection.upsert({
      where: { id: col.id },
      update: { ...col, skills: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) } },
      create: { ...col, skills: { create: skillIds.map((skillId) => ({ skillId })) } },
    })
  }
  console.log(`  ✓ ${collections.length} collections with skill connections`)

  // ── Likes and Saves (from mock isLiked/isSaved flags) ──
  const likeSaves = [
    { type: 'like' as const, userId: 'user_mock_current', skillId: 'skill_9' },
    { type: 'like' as const, userId: 'user_mock_current', skillId: 'skill_11' },
    { type: 'like' as const, userId: 'user_mock_current', skillId: 'skill_13' },
    { type: 'like' as const, userId: 'user_mock_current', skillId: 'skill_18' },
    { type: 'save' as const, userId: 'user_mock_current', skillId: 'skill_9' },
    { type: 'save' as const, userId: 'user_mock_current', skillId: 'skill_10' },
    { type: 'save' as const, userId: 'user_mock_current', skillId: 'skill_13' },
    { type: 'save' as const, userId: 'user_mock_current', skillId: 'skill_16' },
  ]

  for (const ls of likeSaves) {
    const key = { userId: ls.userId, skillId: ls.skillId }
    if (ls.type === 'like') {
      await prisma.skillLike.upsert({ where: { userId_skillId: key }, update: {}, create: key })
    } else {
      await prisma.skillSave.upsert({ where: { userId_skillId: key }, update: {}, create: key })
    }
  }
  console.log(`  ✓ ${likeSaves.length} likes and saves`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
