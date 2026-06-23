import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getSkills, createSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'
import { createSkillSchema } from '@/lib/validations/skill'
import { invalidateSidebar, invalidateTags } from '@/lib/cache'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import type { SkillFilters } from '@/lib/services/skill.service'
import { TargetTool } from '@/types/skill'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const filters: SkillFilters = {}

    const tool = sp.get('targetTool')
    if (tool && Object.values(TargetTool).includes(tool as TargetTool)) {
      filters.targetTool = tool as TargetTool
    }
    const isPublic = sp.get('isPublic')
    if (isPublic !== null) filters.isPublic = isPublic === 'true'
    const tags = sp.get('tags')
    if (tags) filters.tags = tags.split(',')
    const search = sp.get('search')
    if (search) filters.search = search
    const sortBy = sp.get('sortBy') as SkillFilters['sortBy']
    if (sortBy) filters.sortBy = sortBy
    const page = sp.get('page')
    if (page) filters.page = parseInt(page, 10)
    const pageSize = sp.get('pageSize')
    if (pageSize) filters.pageSize = Math.min(parseInt(pageSize, 10), 100)

    const result = await getSkills(filters)
    return Response.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API skills]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`create-skill:${userId}`, 10, 60_000)) return rateLimitResponse()
    const body = await req.json()
    const validated = createSkillSchema.parse(body)
    const skill = await createSkill(validated)
    invalidateSidebar()
    invalidateTags()
    return Response.json(skill, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues }, { status: 400 })
    }
    console.error('[API skills]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
