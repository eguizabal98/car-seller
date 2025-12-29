import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Search } from 'lucide-react'
import Link from 'next/link'
import { FeaturedCars } from '@/components/home/featured-cars'
import { isFeatureEnabled } from '@/lib/features'
import { Database } from '@/types/supabase'

type VehicleWithMedia = Database['public']['Tables']['vehicles']['Row'] & {
  media: Database['public']['Tables']['media']['Row'][]
  image?: string // Add optional image property for compatibility with Car type
}

// Mock data for featured cars (replace with DB fetch later)
const MOCK_FEATURED_CARS: VehicleWithMedia[] = [
  {
    id: '1',
    make: 'Porsche',
    model: '911 GT3',
    year: 2023,
    price: 215000,
    mileage: 1200,
    fuel_type: 'petrol',
    transmission: 'automatic',
    body_type: 'Coupe',
    status: 'available',
    description: 'Track-ready performance.',
    features: ['Ceramic Brakes', 'Bucket Seats'],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vin: null,
    color: 'GT Silver',
    owners: 1,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Porsche%20911%20GT3%20silver%20track%20day%204k&image_size=landscape_16_9',
    media: [
        {
            id: 'm1',
            vehicle_id: '1',
            url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Porsche%20911%20GT3%20silver%20track%20day%204k&image_size=landscape_16_9',
            type: 'image',
            is_primary: true,
            caption: null,
            metadata: {},
            created_at: new Date().toISOString()
        }
    ]
  },
  {
    id: '2',
    make: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: 2022,
    price: 185000,
    mileage: 15000,
    fuel_type: 'petrol',
    transmission: 'automatic',
    body_type: 'SUV',
    status: 'available',
    description: 'Ultimate luxury SUV.',
    features: ['Massage Seats', 'Night Package'],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vin: null,
    color: 'Obsidian Black',
    owners: 1,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Mercedes%20G63%20AMG%20black%20matte%20urban%20setting%204k&image_size=landscape_16_9',
    media: [
        {
            id: 'm2',
            vehicle_id: '2',
            url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Mercedes%20G63%20AMG%20black%20matte%20urban%20setting%204k&image_size=landscape_16_9',
            type: 'image',
            is_primary: true,
            caption: null,
            metadata: {},
            created_at: new Date().toISOString()
        }
    ]
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 89000,
    mileage: 5000,
    fuel_type: 'electric',
    transmission: 'automatic',
    body_type: 'Sedan',
    status: 'available',
    description: 'Electric performance redefined.',
    features: ['FSD', 'Yoke Steering'],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vin: null,
    color: 'Red Multi-Coat',
    owners: 1,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Tesla%20Model%20S%20Plaid%20red%20highway%20driving%204k&image_size=landscape_16_9',
    media: [
        {
            id: 'm3',
            vehicle_id: '3',
            url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Tesla%20Model%20S%20Plaid%20red%20highway%20driving%204k&image_size=landscape_16_9',
            type: 'image',
            is_primary: true,
            caption: null,
            metadata: {},
            created_at: new Date().toISOString()
        }
    ]
  }
] as unknown as VehicleWithMedia[]

export default async function Home() {
  const buyEnabled = await isFeatureEnabled('buy')
  const sellEnabled = await isFeatureEnabled('sell')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-black text-white overflow-hidden">
        <div 
            className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20dealership%20showroom%20dark%20moody%20elegant%204k&image_size=landscape_16_9)' }}
        />
        <div className="container relative z-10 text-center space-y-6 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find Your Dream Car
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Experience the finest selection of premium pre-owned vehicles.
            Quality, transparency, and trust in every deal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {buyEnabled && (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/buy">
                  Browse Inventory <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {sellEnabled && (
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 border-white text-white" asChild>
                <Link href="/sell">
                  Sell Your Car
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Quality</h3>
              <p className="text-muted-foreground">Every vehicle undergoes a rigorous 150-point inspection to ensure premium quality.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
              <p className="text-muted-foreground">Transparent pricing based on real-time market data. No hidden fees.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Search</h3>
              <p className="text-muted-foreground">Advanced filters to help you find the exact make, model, and features you want.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Inventory Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Vehicles</h2>
              <p className="text-muted-foreground mt-2">Hand-picked selections just for you.</p>
            </div>
            {buyEnabled && (
              <Button variant="ghost" asChild>
                <Link href="/buy">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            )}
          </div>
          
          <FeaturedCars cars={MOCK_FEATURED_CARS as any[]} />
        </div>
      </section>
    </div>
  )
}
