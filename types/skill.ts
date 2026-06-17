import type { User } from './user'

export enum TargetTool {
  CLAUDE = 'CLAUDE',
  CURSOR = 'CURSOR',
  COPILOT = 'COPILOT',
  WINDSURF = 'WINDSURF',
  CONTINUE = 'CONTINUE',
  OTHER = 'OTHER',
}

export interface Skill {
  id: string
  title: string
  description: string
  content: string
  targetTool: TargetTool
  isPublic: boolean
  version: number
  likesCount: number
  savesCount: number
  forksCount: number
  createdAt: string
  updatedAt: string
  authorId: string
  forkedFromId: string | null
}

export interface SkillWithAuthor extends Skill {
  author: User
}

export interface SkillWithRelations extends SkillWithAuthor {
  tags: Tag[]
  versions: SkillVersion[]
  isLiked: boolean
  isSaved: boolean
}

export interface SkillVersion {
  id: string
  skillId: string
  version: number
  content: string
  changelog: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface SkillTag {
  skillId: string
  tagId: string
}
