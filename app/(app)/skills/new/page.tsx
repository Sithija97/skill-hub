import { getCachedTags } from '@/lib/cache'
import { NewSkillClient } from './new-skill-client'

export default async function NewSkillPage() {
  const tags = await getCachedTags()
  return <NewSkillClient availableTags={tags} />
}
