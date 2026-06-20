import { z } from 'zod/v4'

export const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be under 50 characters')
    .optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be under 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    ),
  bio: z
    .string()
    .max(300, 'Bio must be under 300 characters')
    .optional()
    .or(z.literal('')),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
