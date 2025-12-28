'use client'

import { useComparisonStore } from '@/store/comparison-store'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { X, Check, Minus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function ComparePage() {
  const { cars, removeCar } = useComparisonStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (cars.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Compare Vehicles</h1>
        <p className="text-muted-foreground">You haven&apos;t selected any vehicles to compare yet.</p>
        <Button asChild>
          <Link href="/buy">Browse Inventory</Link>
        </Button>
      </div>
    )
  }

  const specs = [
    { label: 'Price', key: 'price', format: (v: number) => `$${v.toLocaleString()}` },
    { label: 'Year', key: 'year' },
    { label: 'Mileage', key: 'mileage', format: (v: number) => `${v.toLocaleString()} mi` },
    { label: 'Fuel Type', key: 'fuel_type', format: (v: string) => <span className="capitalize">{v.replace('_', ' ')}</span> },
    { label: 'Status', key: 'status', format: (v: string) => <span className="capitalize">{v}</span> },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Vehicle Comparison</h1>
      
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Feature</TableHead>
              {cars.map((car) => (
                <TableHead key={car.id} className="min-w-[200px]">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={car.image} 
                        alt={car.model} 
                        className="w-full aspect-video object-cover rounded-md"
                      />
                      <div>
                        <div className="font-bold text-lg">{car.make}</div>
                        <div className="text-muted-foreground">{car.model}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCar(car.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {specs.map((spec) => (
              <TableRow key={spec.key}>
                <TableCell className="font-medium">{spec.label}</TableCell>
                {cars.map((car) => (
                  <TableCell key={`${car.id}-${spec.key}`}>
                    {/* @ts-expect-error dynamic access */}
                    {spec.format ? spec.format(car[spec.key]) : car[spec.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
                <TableCell className="font-medium">Action</TableCell>
                {cars.map((car) => (
                    <TableCell key={`${car.id}-action`}>
                        <Button asChild className="w-full">
                            <Link href={`/car/${car.id}`}>View Details</Link>
                        </Button>
                    </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
