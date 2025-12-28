'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FilterSidebarProps {
  makes: string[]
}

export function FilterSidebar({ makes }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 300000])
  const [selectedMake, setSelectedMake] = useState<string>('all')

  // Sync state with URL params on load
  useEffect(() => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const make = searchParams.get('make')

    if (minPrice && maxPrice) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)])
    }
    if (make) {
      setSelectedMake(make)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())
    
    if (selectedMake && selectedMake !== 'all') {
      params.set('make', selectedMake)
    } else {
      params.delete('make')
    }

    router.push(`/buy?${params.toString()}`)
  }

  const handleReset = () => {
    setPriceRange([0, 300000])
    setSelectedMake('all')
    router.push('/buy')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="price" className="w-full">
        <AccordionItem value="make">
          <AccordionTrigger>Make & Model</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Make</Label>
                <Select value={selectedMake} onValueChange={setSelectedMake}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Makes</SelectItem>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4 px-1">
              <Slider
                defaultValue={[0, 300000]}
                value={priceRange}
                max={500000}
                step={5000}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lifestyle">
          <AccordionTrigger>Lifestyle</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Button variant="outline" size="sm" className="mr-2 mb-2">Family-friendly</Button>
              <Button variant="outline" size="sm" className="mr-2 mb-2">Track-ready</Button>
              <Button variant="outline" size="sm" className="mr-2 mb-2">Eco-luxury</Button>
              <Button variant="outline" size="sm" className="mr-2 mb-2">Off-road</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}
