import type { CollectionWithSkills } from '@/types/collection'
import { MOCK_SKILLS } from './skills.mock'
import { MOCK_CURRENT_USER_ID } from './users.mock'

function skillsById(...ids: string[]) {
  return ids.map((id) => MOCK_SKILLS.find((s) => s.id === id)!).filter(Boolean)
}

export const MOCK_COLLECTIONS: CollectionWithSkills[] = [
  {
    id: 'col_1',
    name: 'Code Review Toolkit',
    description: 'My go-to skills for thorough code reviews across different languages and frameworks.',
    isPublic: true,
    authorId: MOCK_CURRENT_USER_ID,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-06-10T14:00:00Z',
    skills: skillsById('skill_1', 'skill_9', 'skill_13', 'skill_14'),
  },
  {
    id: 'col_2',
    name: 'Personal Workflow',
    description: 'Private collection of skills I use daily for development tasks.',
    isPublic: false,
    authorId: MOCK_CURRENT_USER_ID,
    createdAt: '2025-03-15T09:30:00Z',
    updatedAt: '2025-06-08T11:00:00Z',
    skills: skillsById('skill_4', 'skill_6', 'skill_7', 'skill_8', 'skill_3'),
  },
  {
    id: 'col_3',
    name: 'Frontend Essentials',
    description: 'Essential skills for frontend developers — React, accessibility, performance, and design systems.',
    isPublic: true,
    authorId: 'user_mock_4',
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-05-30T16:30:00Z',
    skills: skillsById('skill_2', 'skill_9', 'skill_12', 'skill_16'),
  },
  {
    id: 'col_4',
    name: 'Backend & Infrastructure',
    description: 'Skills for backend development, database design, and DevOps workflows.',
    isPublic: true,
    authorId: 'user_mock_3',
    createdAt: '2025-02-10T11:15:00Z',
    updatedAt: '2025-06-01T13:45:00Z',
    skills: skillsById('skill_3', 'skill_6', 'skill_10', 'skill_21'),
  },
]
