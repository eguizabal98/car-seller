import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Fuel, Gauge, Calendar, Cog, User, Settings2 } from 'lucide-react'

export interface VehicleSpecs {
  mileage: number
  year: number
  fuel_type: string
  transmission: string
  body_type: string
  owners: number
  horsepower?: number
}

export function SpecsGrid({ specs }: { specs: VehicleSpecs }) {
  const items = [
    {
      label: 'Mileage',
      value: `${specs.mileage.toLocaleString()} mi`,
      icon: Gauge,
    },
    {
      label: 'Year',
      value: specs.year.toString(),
      icon: Calendar,
    },
    {
      label: 'Fuel Type',
      value: specs.fuel_type.replace('_', ' '),
      icon: Fuel,
    },
    {
      label: 'Transmission',
      value: specs.transmission.replace('_', ' '),
      icon: Cog,
    },
    {
      label: 'Body Type',
      value: specs.body_type,
      icon: Settings2,
    },
    {
      label: 'Owners',
      value: specs.owners.toString(),
      icon: User,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-none shadow-sm bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <item.icon className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
              <p className="font-medium capitalize">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
