import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { VehicleForm } from '@/components/admin/vehicle-form'
import { getTranslations } from 'next-intl/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: PageProps) {
  const { id } = await params
  const t = await getTranslations('Admin')
  const supabase = await createClient()

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*, media(*)')
    .eq('id', id)
    .single()

  if (error || !vehicle) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('editVehicle')}</h1>
        <p className="text-muted-foreground">{t('editVehicleDesc')}</p>
      </div>
      <div className="rounded-md border bg-card p-6">
        <VehicleForm vehicle={vehicle} />
      </div>
    </div>
  )
}
