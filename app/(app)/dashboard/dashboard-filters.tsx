'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import type { SkillWithRelations } from '@/types/skill'
import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { SkillCard } from '@/components/skills/skill-card'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

type SortBy = 'latest' | 'popular' | 'forked'

const TOOL_FILTERS: { key: TargetTool | null; label: string }[] = [
  { key: null, label: 'All tools' },
  ...Object.entries(TARGET_TOOLS).map(([key, val]) => ({
    key: key as TargetTool,
    label: val.label,
  })),
]

interface DashboardFiltersProps {
  skills: SkillWithRelations[]
}

export function DashboardFilters({ skills }: DashboardFiltersProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [activeTool, setActiveTool] = useState<TargetTool | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('latest')

  const filteredSkills = useMemo(() => {
    let result = [...skills]

    if (activeTab === 'public') result = result.filter((s) => s.isPublic)
    else if (activeTab === 'private') result = result.filter((s) => !s.isPublic)
    else if (activeTab === 'forked') result = result.filter((s) => s.forkedFromId !== null)

    if (activeTool) result = result.filter((s) => s.targetTool === activeTool)

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.likesCount - a.likesCount)
        break
      case 'forked':
        result.sort((a, b) => b.forksCount - a.forksCount)
        break
      case 'latest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    }

    return result
  }, [skills, activeTab, activeTool, sortBy])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList variant="line">
        <TabsTrigger value="all">All skills</TabsTrigger>
        <TabsTrigger value="public">Public</TabsTrigger>
        <TabsTrigger value="private">Private</TabsTrigger>
        <TabsTrigger value="forked">Forked</TabsTrigger>
      </TabsList>

      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {/* Tool pills */}
        <div className="flex flex-wrap gap-1">
          {TOOL_FILTERS.map((tool) => {
            const isActive = activeTool === tool.key
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => setActiveTool(tool.key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-transparent bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}
              >
                {tool.label}
              </button>
            )
          })}
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortBy)}>
          <SelectTrigger size="sm" className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most liked</SelectItem>
            <SelectItem value="forked">Most forked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid for all tabs */}
      <TabsContent value={activeTab}>
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No skills found"
            description="No skills match your current filters. Try adjusting your filters or create a new skill."
            action={{ label: 'New skill', href: '/skills/new' }}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}
