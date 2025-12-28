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

// Mock Data
const FEATURED_CARS = [
  {
    id: 1,
    make: 'Porsche',
    model: '911 GT3',
    year: 2023,
    price: 245000,
    mileage: 1200,
    fuel: 'Petrol',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=porsche%20911%20gt3%20silver%20studio%20lighting%204k&image_size=landscape_4_3',
    status: 'Available',
  },
  {
    id: 2,
    make: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: 2022,
    price: 185000,
    mileage: 15000,
    fuel: 'Petrol',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mercedes%20g63%20amg%20black%20matte%20studio%20lighting%204k&image_size=landscape_4_3',
    status: 'Reserved',
  },
  {
    id: 3,
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    price: 145000,
    mileage: 500,
    fuel: 'Electric',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=audi%20rs%20etron%20gt%20grey%20studio%20lighting%204k&image_size=landscape_4_3',
    status: 'Available',
  },
  {
    id: 4,
    make: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    price: 95000,
    mileage: 8500,
    fuel: 'Petrol',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=bmw%20m4%20competition%20green%20studio%20lighting%204k&image_size=landscape_4_3',
    status: 'Available',
  },
]

export function FeaturedCars() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Collection</h2>
            <p className="text-muted-foreground mt-2">Hand-picked premium vehicles for the discerning driver.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/buy">View All Inventory &rarr;</Link>
          </Button>
        </div>

        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent>
            {FEATURED_CARS.map((car) => (
              <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[4/3] relative overflow-hidden">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={car.status === 'Available' ? 'default' : 'secondary'} className="uppercase tracking-wider">
                          {car.status}
                        </Badge>
                      </div>
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
                          <span>{car.fuel}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/car/${car.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
