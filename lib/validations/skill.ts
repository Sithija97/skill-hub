import { z } from 'zod/v4'
import { TargetTool } from '@/types/skill'

export const createSkillSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be under 500 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  targetTool: z.nativeEnum(TargetTool),
  isPublic: z.boolean(),
  tags: z
    .array(z.string())
    .max(5, 'Maximum 5 tags allowed'),
})

export const updateSkillSchema = createSkillSchema.partial()

export const skillFiltersSchema = z.object({
  targetTool: z.nativeEnum(TargetTool).optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['latest', 'popular', 'forked']).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
})

export type CreateSkillSchema = z.infer<typeof createSkillSchema>
export type UpdateSkillSchema = z.infer<typeof updateSkillSchema>
export type SkillFiltersSchema = z.infer<typeof skillFiltersSchema>
