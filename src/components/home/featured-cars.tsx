'use client'

import * as React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge' // Need to install badge? Or use div
import Link from 'next/link'
import { Fuel, Gauge, Calendar } from 'lucide-react'
import { Car, CarCard } from '@/components/inventory/car-card'

interface FeaturedCarsProps {
  cars: Car[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  if (!cars || cars.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Collection</h2>
            <p className="text-muted-foreground mt-2">Hand-picked premium vehicles for the discerning driver.</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/buy">View All Inventory &rarr;</Link>
          </Button>
        </div>

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
          <div className="flex justify-center mt-8 gap-2 md:hidden">
             {/* Mobile Navigation Dots or Buttons could go here if needed, 
                 but standard swipe is usually sufficient. 
                 Adding manual controls for accessibility. */}
          </div>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>

        <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
                <Link href="/buy">View All Inventory &rarr;</Link>
            </Button>
        </div>
      </div>
    </section>
  )
}
