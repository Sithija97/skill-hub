import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getSkills, createSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'
import { createSkillSchema } from '@/lib/validations/skill'
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
    if (pageSize) filters.pageSize = parseInt(pageSize, 10)

    const result = await getSkills(filters)
    return Response.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthApi()
    const body = await req.json()
    const validated = createSkillSchema.parse(body)
    const skill = await createSkill(validated)
    return Response.json(skill, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
