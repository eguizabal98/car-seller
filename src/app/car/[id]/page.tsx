import { createClient } from '@/utils/supabase/server'
import { MediaGallery } from '@/components/car-details/media-gallery'
import { SpecsGrid } from '@/components/car-details/specs-grid'
import { DigitalLogbook } from '@/components/car-details/digital-logbook'
import { BookingModal } from '@/components/booking/booking-modal'
import { FinanceCalculator } from '@/components/tools/finance-calculator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Share2, Heart } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { isFeatureEnabled } from '@/lib/features'
import { Database } from '@/types/supabase'

type VehicleWithMedia = Database['public']['Tables']['vehicles']['Row'] & {
  media: Database['public']['Tables']['media']['Row'][]
}

// Define params type as a Promise
type Params = Promise<{ id: string }>

async function getCar(id: string) {
  // MOCK DATA FOR TESTING
  if (id === 'test-car-id') {
    return {
      id: 'test-car-id',
      make: 'Test',
      model: 'Vehicle',
      year: 2024,
      price: 50000,
      mileage: 1000,
      fuel_type: 'Electric',
      transmission: 'Automatic',
      body_type: 'Sedan',
      status: 'available',
      description: 'This is a mock vehicle for testing purposes.',
      owners: 1,
      media: [],
    } as unknown as VehicleWithMedia
  }

  const supabase = await createClient()
  const { data: car, error } = await supabase
    .from('vehicles')
    .select('*, media(*)')
    .eq('id', id)
    .single()

  if (error || !car) {
    return null
  }
  return car as unknown as VehicleWithMedia
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const car = await getCar(id)

  if (!car) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const title = `${car.year} ${car.make} ${car.model} | High-End Car Marketplace`
  const description = car.description || `Explore this ${car.year} ${car.make} ${car.model}. Price: $${car.price.toLocaleString()}.`
  
  // Find primary image or use first one
  const primaryImage = car.media?.find((m) => m.is_primary) || car.media?.[0]
  const imageUrl = primaryImage?.url || `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${car.make} ${car.model} luxury car`)}&image_size=landscape_16_9`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        imageUrl,
        ...previousImages,
      ],
    },
  }
}

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video_url';
  thumbnail?: string;
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const financeEnabled = await isFeatureEnabled('finance')

  const { data: car, error } = await supabase
    .from('vehicles')
    .select('*, media(*)')
    .eq('id', id)
    .single()

  if (error || !car) {
    return notFound()
  }

  // Ensure media conforms to the expected type with optional thumbnail
  let media: MediaItem[] = (car.media as any[])?.map((item: any) => ({
    id: item.id,
    url: item.url,
    type: item.type === '360_view' ? 'image' : item.type,
    thumbnail: item.metadata?.thumbnail_url
  })) || [];

  if (media.length === 0) {
     media = [
        {
          id: '1',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20front%20view%20studio%20lighting%204k&image_size=landscape_16_9',
          type: 'image',
        },
        {
          id: '2',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20interior%20leather%20seats%20dashboard%204k&image_size=landscape_16_9',
          type: 'image',
        },
        {
          id: '3',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20rear%20view%20taillights%204k&image_size=landscape_16_9',
          type: 'image',
        },
        {
          id: '4',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20side%20profile%20wheels%204k&image_size=landscape_16_9',
          type: 'image',
        }
     ];
  }

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{car.year}</Badge>
                <Badge variant={car.status === 'available' ? 'default' : 'secondary'} className="uppercase">
                    {car.status}
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{car.make} {car.model}</h1>
            <p className="text-muted-foreground mt-1 text-lg">{car.description || 'Premium Luxury Vehicle'}</p>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-3xl font-bold text-primary">${car.price.toLocaleString()}</h2>
            <p className="text-sm text-muted-foreground">Excluding taxes & licensing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Details */}
        <div className="lg:col-span-2 space-y-8">
            <MediaGallery media={media} />
            
            <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Vehicle Specifications</h3>
                <SpecsGrid specs={{
                    mileage: car.mileage,
                    year: car.year,
                    fuel_type: car.fuel_type,
                    transmission: car.transmission,
                    body_type: car.body_type,
                    owners: car.owners || 1, // Fallback to 1 if column missing or null
                }} />
            </div>

            <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {car.description || "Experience the pinnacle of automotive engineering with this exceptional vehicle. Meticulously maintained and finished in a stunning color combination, it represents the perfect blend of performance and luxury. Features include premium leather upholstery, advanced navigation system, and a suite of driver assistance technologies."}
                </p>
            </div>

            <DigitalLogbook vehicleId={car.id} />
        </div>

        {/* Right Column: CTA & Logbook */}
        <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm sticky bottom-0 md:top-24 md:bottom-auto z-10 md:z-auto">
                <h3 className="text-lg font-semibold mb-4 hidden md:block">Interested in this car?</h3>
                <div className="space-y-3 flex flex-col md:block">
                    <Button className="w-full h-12 text-lg shadow-lg md:shadow-none" size="lg">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat with Sales
                    </Button>
                    <div className="hidden md:block">
                        <BookingModal vehicleId={car.id} vehicleTitle={`${car.make} ${car.model}`} />
                    </div>
                    {/* Mobile Only: Secondary Actions */}
                    <div className="md:hidden flex gap-2">
                        <BookingModal vehicleId={car.id} vehicleTitle={`${car.make} ${car.model}`} />
                         <Button variant="outline" className="flex-1">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 hidden md:grid">
                         <Button variant="ghost" className="w-full">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                        <Button variant="ghost" className="w-full">
                            <Heart className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>
                <div className="hidden md:block">
                     <Separator className="my-6" />
                    {/* Finance Calculator Integrated */}
                    {financeEnabled && <FinanceCalculator vehiclePrice={car.price} />}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
