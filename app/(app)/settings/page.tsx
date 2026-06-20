import { redirect } from 'next/navigation'
import { getCurrentDbUser } from '@/lib/auth'
import { SettingsForm } from '@/components/settings/settings-form'

export default async function SettingsPage() {
  const user = await getCurrentDbUser()
  if (!user) redirect('/sign-in')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <SettingsForm
        initialData={{
          displayName: user.displayName,
          username: user.username,
          bio: user.bio ?? '',
        }}
      />
    </div>
  )
}
