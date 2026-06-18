'use client'

import { useState, useEffect, useCallback, useRef, useTransition } from 'react'
import type { SkillWithRelations } from '@/types/skill'
import { getSkills } from '@/lib/services/skill.service'
import type { SkillFilters } from '@/lib/services/skill.service'

interface UseSkillsReturn {
  skills: SkillWithRelations[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  total: number
}

function serializeFilters(filters: SkillFilters): string {
  return JSON.stringify({
    targetTool: filters.targetTool,
    isPublic: filters.isPublic,
    search: filters.search,
    sortBy: filters.sortBy,
    tags: filters.tags,
    pageSize: filters.pageSize,
  })
}

export function useSkills(filters: SkillFilters): UseSkillsReturn {
  const [skills, setSkills] = useState<SkillWithRelations[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [initialLoading, setInitialLoading] = useState(true)
  const pageRef = useRef(1)
  const serialized = serializeFilters(filters)

  useEffect(() => {
    let cancelled = false
    pageRef.current = 1

    async function fetch() {
      try {
        const result = await getSkills({ ...filters, page: 1 })
        if (cancelled) return
        startTransition(() => {
          setSkills(result.data)
          setTotal(result.total)
          setHasMore(result.hasMore)
          setError(null)
          setInitialLoading(false)
        })
      } catch {
        if (!cancelled) {
          startTransition(() => {
            setError('Failed to load skills')
            setInitialLoading(false)
          })
        }
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [serialized]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    const nextPage = pageRef.current + 1
    try {
      const result = await getSkills({ ...filters, page: nextPage })
      setSkills((prev) => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setTotal(result.total)
      pageRef.current = nextPage
      setError(null)
    } catch {
      setError('Failed to load more skills')
    }
  }, [filters])

  return { skills, loading: initialLoading || isPending, error, hasMore, loadMore, total }
}
