'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { SkillWithRelations } from '@/types/skill'
import { getSkillsAction } from '@/lib/actions/skill.actions'
import type { SkillFilters } from '@/lib/services/skill.service'
import type { PaginatedResponse } from '@/types/api'

interface UseSkillsReturn {
  skills: SkillWithRelations[]
  loading: boolean
  fetching: boolean
  loadingMore: boolean
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

export function useSkills(
  filters: SkillFilters,
  initialData?: PaginatedResponse<SkillWithRelations>
): UseSkillsReturn {
  const [skills, setSkills] = useState<SkillWithRelations[]>(initialData?.data ?? [])
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(initialData?.hasMore ?? false)
  const [total, setTotal] = useState(initialData?.total ?? 0)
  const [loading, setLoading] = useState(!initialData)
  const [fetching, setFetching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const pageRef = useRef(1)
  const serialized = serializeFilters(filters)
  const initialSerialized = useRef(initialData ? serialized : null)

  useEffect(() => {
    if (initialSerialized.current && serialized === initialSerialized.current) {
      initialSerialized.current = null
      return
    }
    initialSerialized.current = null

    let cancelled = false
    pageRef.current = 1
    setFetching(true)

    async function fetchData() {
      try {
        const result = await getSkillsAction({ ...filters, page: 1 })
        if (cancelled) return
        setSkills(result.data)
        setTotal(result.total)
        setHasMore(result.hasMore)
        setError(null)
      } catch {
        if (!cancelled) setError('Failed to load skills')
      } finally {
        if (!cancelled) {
          setFetching(false)
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [serialized]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    const nextPage = pageRef.current + 1
    setLoadingMore(true)
    try {
      const result = await getSkillsAction({ ...filters, page: nextPage })
      setSkills((prev) => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setTotal(result.total)
      pageRef.current = nextPage
      setError(null)
    } catch {
      setError('Failed to load more skills')
    } finally {
      setLoadingMore(false)
    }
  }, [filters])

  return { skills, loading, fetching, loadingMore, error, hasMore, loadMore, total }
}
