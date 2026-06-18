// TODO: Replace mock imports with Prisma calls in Step 11
export {
  getSkills,
  getSkillById,
  getSkillsByUser,
  createSkill,
  updateSkill,
  deleteSkill,
  forkSkill,
  likeSkill,
  unlikeSkill,
  saveSkill,
  unsaveSkill,
  getSkillVersions,
} from '@/lib/mock/skills.mock'

export type {
  SkillFilters,
  CreateSkillInput,
  UpdateSkillInput,
} from '@/lib/mock/skills.mock'
