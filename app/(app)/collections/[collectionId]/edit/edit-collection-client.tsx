'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Globe, Lock } from 'lucide-react'
import { updateCollectionSchema, type UpdateCollectionSchema } from '@/lib/validations/collection'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { cn } from '@/lib/utils'
import type { CollectionWithSkills } from '@/types/collection'

interface EditCollectionClientProps {
  collection: CollectionWithSkills
}

export function EditCollectionClient({ collection }: EditCollectionClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateCollectionSchema>({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
    },
  })

  const watchedIsPublic = watch('isPublic')

  const onSubmit = async (data: UpdateCollectionSchema) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Collection updated')
      router.push(`/collections/${collection.id}`)
    } catch {
      toast.error('Failed to update collection')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: collection.name, href: `/collections/${collection.id}` },
          { label: 'Edit' },
        ]}
      />
      <h1 className="mb-6 text-xl font-semibold text-foreground">Edit collection</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Name</label>
          <Input {...register('name')} placeholder="e.g. Frontend Toolkit" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
          <Textarea {...register('description')} placeholder="What is this collection for?" rows={3} />
          {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue('isPublic', true)}
              className={cn(
                'flex items-start gap-3 rounded-md border-2 p-4 text-left transition-colors',
                watchedIsPublic ? 'border-ring bg-accent' : 'border-border hover:border-border/80'
              )}
            >
              <Globe size={18} className={cn('mt-0.5 shrink-0', watchedIsPublic ? 'text-foreground' : 'text-muted-foreground')} />
              <div>
                <div className={cn('mb-0.5 text-sm font-medium', watchedIsPublic ? 'text-foreground' : 'text-muted-foreground')}>Public</div>
                <div className="text-xs leading-snug text-muted-foreground">Anyone can see this collection</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setValue('isPublic', false)}
              className={cn(
                'flex items-start gap-3 rounded-md border-2 p-4 text-left transition-colors',
                !watchedIsPublic ? 'border-ring bg-accent' : 'border-border hover:border-border/80'
              )}
            >
              <Lock size={18} className={cn('mt-0.5 shrink-0', !watchedIsPublic ? 'text-foreground' : 'text-muted-foreground')} />
              <div>
                <div className={cn('mb-0.5 text-sm font-medium', !watchedIsPublic ? 'text-foreground' : 'text-muted-foreground')}>Private</div>
                <div className="text-xs leading-snug text-muted-foreground">Only visible to you</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
