'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateUserSchema, type UpdateUserSchema } from '@/lib/validations/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface SettingsFormProps {
  initialData: {
    displayName: string
    username: string
    bio: string
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: UpdateUserSchema) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/users/${initialData.username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 409) {
        setError('username', { message: 'Username already taken' })
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to update profile')
      }

      toast.success('Profile updated successfully')

      if (data.username !== initialData.username) {
        router.push('/settings')
        return
      }
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Display Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Display name
            </label>
            <Input {...register('displayName')} placeholder="Your display name" />
            {errors.displayName && (
              <p className="mt-1 text-xs text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Username
            </label>
            <Input {...register('username')} placeholder="your-username" />
            <p className="mt-1 text-xs text-muted-foreground">
              Your public profile URL will be skillhub.dev/{'{username}'}
            </p>
            {errors.username && (
              <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Bio
            </label>
            <Textarea
              {...register('bio')}
              placeholder="Tell others a little about yourself"
              rows={3}
              maxLength={300}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Max 300 characters
            </p>
            {errors.bio && (
              <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Profile photo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your profile photo is managed through your Clerk account settings.
            Click the user icon in the top navigation bar to update it.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
