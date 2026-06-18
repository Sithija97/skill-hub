import type { SkillVersion } from '@/types/skill'

export const MOCK_VERSIONS: SkillVersion[] = [
  // skill_1 — Python Code Reviewer (version 3, so 3 versions)
  {
    id: 'ver_1_1',
    skillId: 'skill_1',
    version: 1,
    content: '# Python Code Reviewer\n\nYou review Python code for basic issues: naming, formatting, and obvious bugs. Check PEP 8 compliance and suggest fixes.',
    changelog: 'Initial version with basic Python review checklist.',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'ver_1_2',
    skillId: 'skill_1',
    version: 2,
    content: '# Python Code Reviewer\n\nYou are an expert Python code reviewer. Analyze code for: Pythonic idioms, type safety, performance issues, and error handling. Output findings with severity, description, and fix.',
    changelog: 'Added type safety checks and structured output format with severity levels.',
    createdAt: '2025-03-20T14:00:00Z',
  },
  {
    id: 'ver_1_3',
    skillId: 'skill_1',
    version: 3,
    content: '# Python Code Reviewer\n\nYou are an expert Python code reviewer. When presented with Python code, analyze it thoroughly and provide feedback on: Pythonic idioms, type safety, performance, error handling, and testing. Output with file, severity, what, why, and fix.',
    changelog: 'Added testing dimension and detailed output format with file/line references.',
    createdAt: '2025-06-08T14:30:00Z',
  },

  // skill_2 — React Component Architect (version 2)
  {
    id: 'ver_2_1',
    skillId: 'skill_2',
    version: 1,
    content: '# React Component Architect\n\nYou design React components. Focus on clean props interfaces, composition patterns, and accessibility.',
    changelog: 'Initial version with basic component design guidelines.',
    createdAt: '2025-02-20T09:15:00Z',
  },
  {
    id: 'ver_2_2',
    skillId: 'skill_2',
    version: 2,
    content: '# React Component Architect\n\nYou are a senior React component designer. Follow: API first design, composition over configuration, full accessibility, CSS variable theming, and colocated state management.',
    changelog: 'Expanded with compound component patterns and CSS variable theming guidelines.',
    createdAt: '2025-05-30T16:00:00Z',
  },

  // skill_3 — SQL Query Optimizer (version 1)
  {
    id: 'ver_3_1',
    skillId: 'skill_3',
    version: 1,
    content: '# SQL Query Optimizer\n\nYou are a database performance expert. Analyze SQL queries for scan patterns, join issues, missing indexes, subquery problems, and pagination anti-patterns.',
    changelog: 'Initial version.',
    createdAt: '2025-03-10T11:30:00Z',
  },

  // skill_4 — Git Commit Message Writer (version 4)
  {
    id: 'ver_4_1',
    skillId: 'skill_4',
    version: 1,
    content: '# Git Commit Writer\n\nWrite commit messages in the format: type: description. Keep under 72 chars.',
    changelog: 'Initial version with basic conventional commit format.',
    createdAt: '2024-12-01T08:00:00Z',
  },
  {
    id: 'ver_4_2',
    skillId: 'skill_4',
    version: 2,
    content: '# Git Commit Writer\n\nWrite conventional commit messages. Format: type(scope): description. Support feat, fix, refactor, docs, test, chore types.',
    changelog: 'Added scope support and expanded commit types.',
    createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'ver_4_3',
    skillId: 'skill_4',
    version: 3,
    content: '# Git Commit Writer\n\nWrite conventional commit messages from diffs. Include breaking change support, body for non-obvious changes, and suggest splitting unrelated diffs.',
    changelog: 'Added breaking change support and diff splitting suggestions.',
    createdAt: '2025-04-10T12:00:00Z',
  },
  {
    id: 'ver_4_4',
    skillId: 'skill_4',
    version: 4,
    content: '# Git Commit Message Writer\n\nYou write precise git commit messages following the Conventional Commits specification. Rules for format, body, breaking changes, and multiple changes. Keep it short.',
    changelog: 'Refined wording for clarity and added imperative mood rule.',
    createdAt: '2025-06-14T10:00:00Z',
  },

  // skill_5 — API Documentation Generator (version 1)
  {
    id: 'ver_5_1',
    skillId: 'skill_5',
    version: 1,
    content: '# API Documentation Generator\n\nGenerate OpenAPI-style documentation from route handler code. Document method, path, auth, params, body, response, and errors.',
    changelog: 'Initial version.',
    createdAt: '2025-04-05T14:20:00Z',
  },

  // skill_6 — Prisma Schema Designer (version 2)
  {
    id: 'ver_6_1',
    skillId: 'skill_6',
    version: 1,
    content: '# Prisma Schema Designer\n\nDesign Prisma schemas from requirements. Use proper naming, relations, and indexes.',
    changelog: 'Initial version with basic schema design guidelines.',
    createdAt: '2025-02-28T16:45:00Z',
  },
  {
    id: 'ver_6_2',
    skillId: 'skill_6',
    version: 2,
    content: '# Prisma Schema Designer\n\nYou are a database architect specializing in Prisma ORM. Follow: PascalCase models, bidirectional relations, composite indexes, soft deletes, timestamps, and Prisma enums.',
    changelog: 'Added soft delete pattern, enum guidance, and index recommendations.',
    createdAt: '2025-05-15T09:30:00Z',
  },

  // skill_7 — Test Case Generator (version 2)
  {
    id: 'ver_7_1',
    skillId: 'skill_7',
    version: 1,
    content: '# Test Case Generator\n\nGenerate test cases for functions. Cover happy path, edge cases, and error cases.',
    changelog: 'Initial version with basic test categories.',
    createdAt: '2025-03-22T13:00:00Z',
  },
  {
    id: 'ver_7_2',
    skillId: 'skill_7',
    version: 2,
    content: '# Test Case Generator\n\nWrite comprehensive test suites. Process: read code, identify categories (happy path, edge, error, integration), write tests with one assertion per test, descriptive names, test data factories.',
    changelog: 'Added integration test category and test data factory pattern.',
    createdAt: '2025-05-20T11:15:00Z',
  },

  // skill_8 — Next.js Route Handler Builder (version 1)
  {
    id: 'ver_8_1',
    skillId: 'skill_8',
    version: 1,
    content: '# Next.js Route Handler Builder\n\nBuild type-safe Next.js App Router route handlers with Zod validation, proper error handling, and auth checks.',
    changelog: 'Initial version.',
    createdAt: '2025-05-01T15:30:00Z',
  },
]
