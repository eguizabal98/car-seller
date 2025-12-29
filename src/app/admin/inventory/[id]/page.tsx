import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { VehicleForm } from '@/components/admin/vehicle-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !vehicle) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
        <p className="text-muted-foreground">Update vehicle details.</p>
      </div>
      <div className="rounded-md border bg-card p-6">
        <VehicleForm vehicle={vehicle} />
      </div>
    </div>
  )
}
