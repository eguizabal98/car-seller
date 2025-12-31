import { VehicleForm } from '@/components/admin/vehicle-form'
import { useTranslations } from 'next-intl'

export default function NewVehiclePage() {
  const t = useTranslations('Admin')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addVehicle')}</h1>
        <p className="text-muted-foreground">{t('addVehicleDesc')}</p>
      </div>
      <VehicleForm />
    </div>
  )
}
