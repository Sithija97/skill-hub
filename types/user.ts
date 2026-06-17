export interface User {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  skillsCount: number
  followersCount: number
}
