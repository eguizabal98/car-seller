'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/routing'
import { Fuel, Gauge, Calendar, Plus, Check } from 'lucide-react'
import { useComparisonStore } from '@/store/comparison-store'
import { toast } from 'sonner'
import { IMAGES } from '@/lib/constants'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  image: string
  status: string
}

export function CarCard({ car }: { car: Car }) {
  const tCommon = useTranslations('Common')
  const tStatus = useTranslations('Status')
  const { addCar, cars, removeCar } = useComparisonStore()
  const isSelected = cars.some((c) => c.id === car.id)

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSelected) {
      removeCar(car.id)
      toast.info(tCommon('removedFromCompare'))
    } else {
      if (cars.length >= 3) {
        toast.error(tCommon('maxCompareReached'))
        return
      }
      addCar(car)
      toast.success(tCommon('addedToCompare'))
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image
          src={car.image || IMAGES.PLACEHOLDER_CAR}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 z-10">
          <Badge variant={car.status === 'available' ? 'default' : 'secondary'} className="uppercase tracking-wider shadow-sm">
            {tStatus(car.status as any)}
          </Badge>
        </div>
        <Button
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            className="absolute top-2 left-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity opacity-100 shadow-sm"
            onClick={toggleCompare}
        >
            {isSelected ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {tCommon('compare')}
        </Button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{car.make}</p>
            <CardTitle className="text-xl">{car.model}</CardTitle>
          </div>
          <p className="font-bold text-lg text-primary">
            ${car.price.toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{car.fuel_type.replace('_', ' ')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/car/${car.id}`}>{tCommon('viewDetails')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
