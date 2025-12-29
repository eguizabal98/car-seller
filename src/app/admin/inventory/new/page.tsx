import { VehicleForm } from '@/components/admin/vehicle-form'

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Vehicle</h1>
        <p className="text-muted-foreground">Add a new vehicle to your inventory.</p>
      </div>
      <VehicleForm />
    </div>
  )
}
