import type { User } from '@/types/user'

export const MOCK_CURRENT_USER_ID = 'user_mock_current'

export const MOCK_USERS: User[] = [
  {
    id: MOCK_CURRENT_USER_ID,
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Full-stack developer. Building tools that help developers ship faster.',
    avatarUrl: null,
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2025-06-10T14:30:00Z',
  },
  {
    id: 'user_mock_2',
    username: 'sarahcodes',
    displayName: 'Sarah Chen',
    bio: 'Senior engineer at a fintech startup. Python and TypeScript enthusiast.',
    avatarUrl: null,
    createdAt: '2024-10-02T10:15:00Z',
    updatedAt: '2025-05-28T09:00:00Z',
  },
  {
    id: 'user_mock_3',
    username: 'devmarcus',
    displayName: 'Marcus Rivera',
    bio: 'DevOps engineer. Automating everything that can be automated.',
    avatarUrl: null,
    createdAt: '2024-11-18T16:45:00Z',
    updatedAt: '2025-06-01T11:20:00Z',
  },
  {
    id: 'user_mock_4',
    username: 'emmadev',
    displayName: 'Emma Larsson',
    bio: 'Frontend architect. Design systems and accessibility advocate.',
    avatarUrl: null,
    createdAt: '2024-08-20T12:00:00Z',
    updatedAt: '2025-06-05T18:10:00Z',
  },
  {
    id: 'user_mock_5',
    username: 'kaizhang',
    displayName: 'Kai Zhang',
    bio: null,
    avatarUrl: null,
    createdAt: '2025-01-10T07:30:00Z',
    updatedAt: '2025-06-12T15:45:00Z',
  },
]

export function getMockUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id)
}
