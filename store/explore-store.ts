import { create } from 'zustand'
import type { SkillFilters } from '@/lib/services/skill.service'

interface ExploreState {
  filters: SkillFilters
  setFilters: (filters: Partial<SkillFilters>) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: SkillFilters = {
  sortBy: 'latest',
  page: 1,
  pageSize: 12,
  isPublic: true,
}

export const useExploreStore = create<ExploreState>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
