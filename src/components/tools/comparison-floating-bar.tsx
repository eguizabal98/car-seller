'use client'

import { useComparisonStore } from '@/store/comparison-store'
import { Button } from '@/components/ui/button'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function ComparisonFloatingBar() {
  const { cars, removeCar, clear } = useComparisonStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true)
  }, [])

  if (!mounted || cars.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <span className="font-semibold whitespace-nowrap">Compare ({cars.length}/3):</span>
          {cars.map((car) => (
            <div key={car.id} className="relative flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md min-w-[150px]">
              <span className="text-sm truncate max-w-[120px]">{car.make} {car.model}</span>
              <button
                onClick={() => removeCar(car.id)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="ghost" onClick={clear}>Clear All</Button>
          <Button asChild>
            <Link href="/compare">
              Compare Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
