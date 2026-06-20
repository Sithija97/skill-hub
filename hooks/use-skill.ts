'use client'

import { useState, useEffect } from 'react'
import type { SkillWithRelations } from '@/types/skill'
import { getSkillByIdAction } from '@/lib/actions/skill.actions'

interface UseSkillReturn {
  skill: SkillWithRelations | null
  loading: boolean
  error: string | null
}

export function useSkill(skillId: string): UseSkillReturn {
  const [skill, setSkill] = useState<SkillWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const data = await getSkillByIdAction(skillId)
        if (cancelled) return
        setSkill(data)
        setError(data ? null : 'Skill not found')
      } catch {
        if (!cancelled) setError('Failed to load skill')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [skillId])

  return { skill, loading, error }
}
