import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { getSkillById } from '@/lib/services/skill.service'
import { buttonVariants } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { VersionsList } from './versions-list'

export default async function SkillVersionsPage({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/dashboard')

  return (
    <div>
      {/* Breadcrumb + header — server-rendered */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: skill.title, href: `/skills/${skill.id}` },
          { label: 'Versions' },
        ]}
      />

      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/skills/${skill.id}`}
          className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
        >
          <IconArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="m-0 text-xl font-semibold text-foreground">Version history</h1>
          <p className="m-0 text-sm text-muted-foreground">{skill.title}</p>
        </div>
      </div>

      {/* Version list — client-rendered for expand/collapse + restore */}
      <VersionsList skillId={skill.id} versions={skill.versions} />
    </div>
  )
}
