'use client'

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { useForm, useController, Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { Globe, Lock, X } from 'lucide-react'
import type { CreateSkillInput } from '@/lib/services/skill.service'
import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { createSkillSchema } from '@/lib/validations/skill'
import type { Tag } from '@/types/skill'
import { useShallow } from 'zustand/react/shallow'
import { useEditorStore } from '@/store/editor-store'
import { markdownComponents } from '@/components/shared/markdown-components'
import { rehypeMermaid } from '@/lib/rehype-mermaid'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 rounded-md border border-border bg-background">
      <div className="flex flex-1 flex-col border-r border-border p-4">
        <div className="mb-3 h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex-1 p-4">
        <div className="mb-3 h-4 w-2/5 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mb-2 h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  ),
})

// Hoisted to module scope: a fresh object identity on every keystroke would
// defeat MDEditor's internal memoization of the preview subtree.
const previewOptions = {
  components: markdownComponents,
  // Runs before @uiw's built-in rehype-prism-plus, so mermaid fences are
  // extracted to plain text before that highlighter tokenizes them.
  rehypePlugins: [rehypeMermaid],
}

const ContentEditor = memo(function ContentEditor({
  control,
  theme,
}: {
  control: Control<CreateSkillInput>
  theme: string | undefined
}) {
  const { field } = useController({ name: 'content', control })

  return (
    <div data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
      <MDEditor
        value={field.value}
        onChange={(val) => field.onChange(val ?? '')}
        height={400}
        preview="live"
        previewOptions={previewOptions}
      />
    </div>
  )
})

interface SkillFormProps {
  initialData?: Partial<CreateSkillInput>
  skillId?: string
  onSubmit: (data: CreateSkillInput) => Promise<void>
  isSubmitting: boolean
  availableTags?: Tag[]
}

export function SkillForm({ initialData, skillId, onSubmit, isSubmitting, availableTags = [] }: SkillFormProps) {
  const { resolvedTheme } = useTheme()
  const { setDraft, resetDraft } = useEditorStore(useShallow((s) => ({ setDraft: s.setDraft, resetDraft: s.resetDraft })))
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSkillInput>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      content: initialData?.content ?? '',
      targetTool: initialData?.targetTool ?? TargetTool.CLAUDE,
      isPublic: initialData?.isPublic ?? false,
      tags: initialData?.tags ?? [],
    },
  })

  const watchedTags = watch('tags')

  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      clearTimeout(draftTimerRef.current)
      draftTimerRef.current = setTimeout(() => {
        setDraft(values as Partial<CreateSkillInput>)
      }, 300)
    })
    return () => {
      unsubscribe()
      clearTimeout(draftTimerRef.current)
    }
  }, [watch, setDraft])

  const handleFormSubmit = async (data: CreateSkillInput) => {
    await onSubmit(data)
    resetDraft()
  }

  const currentTags = useMemo(() => watchedTags ?? [], [watchedTags])

  const addTag = useCallback(
    (tag: string) => {
      const normalized = tag.trim().toLowerCase()
      if (!normalized || currentTags.includes(normalized) || currentTags.length >= 10) return
      setValue('tags', [...currentTags, normalized], { shouldValidate: true })
      setTagInput('')
    },
    [currentTags, setValue]
  )

  const removeTag = useCallback(
    (tag: string) => {
      setValue('tags', currentTags.filter((t) => t !== tag), { shouldValidate: true })
    },
    [currentTags, setValue]
  )

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const suggestedTags = availableTags.filter(
    (t) => !currentTags.includes(t.slug)
  ).slice(0, 8)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">Title</label>
        <Input {...register('title')} placeholder="e.g. Python code reviewer" />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
        <Textarea
          {...register('description')}
          placeholder="What does this skill do? When should it be used?"
          rows={3}
        />
        {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* Target Tool */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">Target tool</label>
        <Controller
          name="targetTool"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(TARGET_TOOLS).map(([key, config]) => {
                const isSelected = field.value === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => field.onChange(key)}
                    className={cn(
                      'flex items-center gap-2 rounded-md border-2 p-3 text-left transition-colors',
                      isSelected
                        ? 'border-ring bg-accent'
                        : 'border-border hover:border-border/80'
                    )}
                  >
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: isSelected ? config.brandText : 'var(--color-border-strong)' }}
                    />
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {config.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.targetTool && <p className="mt-1 text-xs text-destructive">{errors.targetTool.message}</p>}
      </div>

      {/* Content Editor */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-foreground">Skill content</label>
        <p className="mb-2 text-xs text-muted-foreground">
          Write your skill in markdown. This is the actual prompt/instruction.
        </p>
        <ContentEditor control={control} theme={resolvedTheme} />
        {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">Tags</label>
        {currentTags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {currentTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-0.5 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 inline-flex cursor-pointer items-center rounded-full border-none bg-transparent p-0 opacity-60 hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder={currentTags.length >= 10 ? 'Max tags reached' : 'Type a tag and press Enter'}
          disabled={currentTags.length >= 10}
        />
        {suggestedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {suggestedTags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => addTag(tag.slug)}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
                >
                  {tag.name}
                </Badge>
              </button>
            ))}
          </div>
        )}
        {errors.tags && <p className="mt-1 text-xs text-destructive">{errors.tags.message}</p>}
      </div>

      {/* Visibility */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">Visibility</label>
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => field.onChange(true)}
                className={cn(
                  'flex items-start gap-3 rounded-md border-2 p-4 text-left transition-colors',
                  field.value
                    ? 'border-ring bg-accent'
                    : 'border-border hover:border-border/80'
                )}
              >
                <Globe size={18} className={cn('mt-0.5 shrink-0', field.value ? 'text-foreground' : 'text-muted-foreground')} />
                <div>
                  <div className={cn('mb-0.5 text-sm font-medium', field.value ? 'text-foreground' : 'text-muted-foreground')}>
                    Public
                  </div>
                  <div className="text-xs leading-snug text-muted-foreground">
                    Anyone can discover and fork this skill
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => field.onChange(false)}
                className={cn(
                  'flex items-start gap-3 rounded-md border-2 p-4 text-left transition-colors',
                  !field.value
                    ? 'border-ring bg-accent'
                    : 'border-border hover:border-border/80'
                )}
              >
                <Lock size={18} className={cn('mt-0.5 shrink-0', !field.value ? 'text-foreground' : 'text-muted-foreground')} />
                <div>
                  <div className={cn('mb-0.5 text-sm font-medium', !field.value ? 'text-foreground' : 'text-muted-foreground')}>
                    Private
                  </div>
                  <div className="text-xs leading-snug text-muted-foreground">
                    Only visible to you
                  </div>
                </div>
              </button>
            </div>
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : skillId ? 'Update skill' : 'Create skill'}
        </Button>
      </div>
    </form>
  )
}
