import { z } from 'zod/v4'

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be under 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
  isPublic: z.boolean(),
})

export const updateCollectionSchema = createCollectionSchema.partial()

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>
export type UpdateCollectionSchema = z.infer<typeof updateCollectionSchema>
