import { getTags } from '@/lib/services/tag.service'
import { NewSkillClient } from './new-skill-client'

export default async function NewSkillPage() {
  const tags = await getTags()
  return <NewSkillClient availableTags={tags} />
}
