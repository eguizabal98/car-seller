'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { Car, CarCard } from '@/components/inventory/car-card'
import { useTranslations } from 'next-intl'

interface FeaturedCarsProps {
  cars: Car[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  const t = useTranslations('Home')

  if (!cars || cars.length === 0) {
    return null
  }

  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cars.map((car) => (
            <CarouselItem key={car.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                 <CarCard car={car} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>

      <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full">
              <Link href="/buy">{t('viewAllInventory')} &rarr;</Link>
          </Button>
      </div>
    </>
  )
}
