import { Breadcrumb } from '@/components/shared/breadcrumb'
import { NewCollectionForm } from './new-collection-form'

export default function NewCollectionPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'New collection' }]} />
      <h1 className="mb-6 text-xl font-semibold text-foreground">New collection</h1>
      <NewCollectionForm />
    </div>
  )
}
