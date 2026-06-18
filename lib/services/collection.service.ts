// TODO: Replace mock imports with Prisma calls in Step 11
export {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addSkillToCollection,
  removeSkillFromCollection,
  followCollection,
  unfollowCollection,
} from '@/lib/mock/collections.mock'

export type {
  CreateCollectionInput,
  UpdateCollectionInput,
} from '@/lib/mock/collections.mock'
