import { createClient } from '@/utils/supabase/server'
import { FilterSidebar } from '@/components/inventory/filter-sidebar'
import { CarCard, Car } from '@/components/inventory/car-card'
import { Separator } from '@/components/ui/separator'

// Define the shape of searchParams (they can be string | string[] | undefined)
interface SearchParams {
  [key: string]: string | string[] | undefined
}

export const dynamic = 'force-dynamic'

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase.from('vehicles').select('*')

  // Apply filters
  if (params.make) {
    query = query.eq('make', params.make as string)
  }
  if (params.minPrice) {
    query = query.gte('price', params.minPrice as string)
  }
  if (params.maxPrice) {
    query = query.lte('price', params.maxPrice as string)
  }
  // Add more filters as needed

  const { data: vehicles, error } = await query

  if (error) {
    console.error('Error fetching vehicles:', error)
  }

  // Map Supabase data to Car interface (handling potential nulls or mismatches if necessary)
  const cars: Car[] = (vehicles || []).map((v) => ({
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    fuel_type: v.fuel_type,
    status: v.status,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20showroom%20side%20view%204k&image_size=landscape_4_3', // Placeholder until media table join
  }))

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Discover our curated collection of premium vehicles.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <FilterSidebar />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {cars.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No vehicles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
