import type { Skill } from './skill'

export interface Collection {
  id: string
  name: string
  description: string
  isPublic: boolean
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface CollectionWithSkills extends Collection {
  skills: Skill[]
  skillsCount?: number
}

export interface CollectionSkillStatus {
  id: string
  name: string
  hasSkill: boolean
}
