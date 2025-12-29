import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Search } from 'lucide-react'
import Link from 'next/link'
import { FeaturedCars } from '@/components/home/featured-cars'
import { isFeatureEnabled } from '@/lib/features'
import { createClient } from '@/utils/supabase/server'
import { Car } from '@/components/inventory/car-card'

export default async function Home() {
  const buyEnabled = await isFeatureEnabled('buy')
  const sellEnabled = await isFeatureEnabled('sell')
  
  const supabase = await createClient()
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*, media(*)')
    .eq('is_featured', true)
    .eq('status', 'available')
    .limit(6)

  const featuredCars: Car[] = (vehicles || []).map((vehicle) => {
      // Find primary image
      const primaryMedia = vehicle.media?.find((m: any) => m.is_primary)
      const firstMedia = vehicle.media?.[0]
      const imageUrl = primaryMedia?.url || firstMedia?.url || ''
      
      return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuel_type: vehicle.fuel_type,
        status: vehicle.status,
        image: imageUrl
      }
  })

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
          
          <FeaturedCars cars={featuredCars} />
        </div>
      </section>
    </div>
  )
}
