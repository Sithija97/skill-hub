// TODO: Replace mock imports with Prisma calls in Step 11
import { MOCK_TAGS } from '@/lib/mock/data/tags.mock'
import type { Tag } from '@/types/skill'

export async function getTags(): Promise<Tag[]> {
  return MOCK_TAGS
}

export function getTagsSync(): Tag[] {
  return MOCK_TAGS
}
