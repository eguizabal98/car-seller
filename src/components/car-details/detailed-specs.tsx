
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  Fuel, 
  Gauge, 
  Calendar, 
  Cog, 
  User, 
  Settings2, 
  Zap, 
  Maximize, 
  ShieldCheck,
  Car
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export interface ExtendedVehicleSpecs {
  mileage: number
  year: number
  fuel_type: string
  transmission: string
  body_type: string
  owners: number
  // Extended fields (optional for now)
  engine?: string
  drivetrain?: string
  exterior_color?: string
  interior_color?: string
  mpg?: string
  vin?: string
  stock_no?: string
  doors?: number
}

export function DetailedSpecs({ specs }: { specs: ExtendedVehicleSpecs }) {
  const categories = [
    {
      title: "Performance & Engineering",
      icon: Zap,
      items: [
        { label: 'Engine', value: specs.engine || '2.0L 4-Cylinder Turbo', icon: Settings2 },
        { label: 'Transmission', value: specs.transmission.replace('_', ' '), icon: Cog },
        { label: 'Drivetrain', value: specs.drivetrain || 'All-Wheel Drive', icon: Car },
        { label: 'Fuel Type', value: specs.fuel_type.replace('_', ' '), icon: Fuel },
        { label: 'MPG', value: specs.mpg || 'N/A', icon: Gauge },
      ]
    },
    {
      title: "Overview & History",
      icon: ShieldCheck,
      items: [
        { label: 'Mileage', value: `${specs.mileage.toLocaleString()} mi`, icon: Gauge },
        { label: 'Year', value: specs.year.toString(), icon: Calendar },
        { label: 'Owners', value: specs.owners.toString(), icon: User },
        { label: 'Stock #', value: specs.stock_no || `STK-${Math.floor(Math.random() * 10000)}`, icon: FileTextIcon },
        { label: 'VIN', value: specs.vin || 'N/A', icon: FileTextIcon },
      ]
    },
    {
      title: "Design & Dimensions",
      icon: Maximize,
      items: [
        { label: 'Body Style', value: specs.body_type, icon: Car },
        { label: 'Exterior', value: specs.exterior_color || 'Metallic Finish', icon: PaletteIcon },
        { label: 'Interior', value: specs.interior_color || 'Premium Leather', icon: ArmchairIcon },
        { label: 'Doors', value: specs.doors?.toString() || '4', icon: DoorOpenIcon },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {categories.map((category, index) => (
        <Card key={category.title} className="overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <category.icon className="h-5 w-5 text-primary" />
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Left Column */}
                <div className="grid grid-cols-1 divide-y">
                    {category.items.filter((_, i) => i % 2 === 0).map((item) => (
                        <div key={item.label} className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                            </div>
                            <span className="font-semibold text-right">{item.value}</span>
                        </div>
                    ))}
                </div>
                {/* Right Column */}
                <div className="grid grid-cols-1 divide-y border-t md:border-t-0">
                    {category.items.filter((_, i) => i % 2 !== 0).map((item) => (
                        <div key={item.label} className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                            </div>
                            <span className="font-semibold text-right">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Icons helper
function FileTextIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
}

function PaletteIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.087 0-.833.684-1.487 1.571-1.487H14.5c2.766 0 5-2.234 5-5s-2.234-5-5-5z"/></svg>
}

function ArmchairIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
}

function DoorOpenIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg>
}
