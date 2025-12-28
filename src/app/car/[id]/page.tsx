import { createClient } from '@/utils/supabase/server'
import { MediaGallery } from '@/components/car-details/media-gallery'
import { SpecsGrid } from '@/components/car-details/specs-grid'
import { DigitalLogbook } from '@/components/car-details/digital-logbook'
import { BookingModal } from '@/components/booking/booking-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, CalendarCheck, Share2, Heart } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'

// Define params type as a Promise
type Params = Promise<{ id: string }>

async function getCar(id: string) {
  const supabase = await createClient()
  const { data: car, error } = await supabase
    .from('vehicles')
    .select('*, media(*)')
    .eq('id', id)
    .single()

  if (error || !car) {
    return null
  }
  return car
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
  const primaryImage = car.media?.find((m: any) => m.is_primary) || car.media?.[0]
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

export default async function CarDetailsPage({ params }: { params: Params }) {
  const { id } = await params
  const car = await getCar(id)

  if (!car) {
    return notFound()
  }

  // Map fetched media to the format expected by MediaGallery
  // If no media is found, fallback to placeholder logic (optional, but good for MVP)
  let media = (car.media || []).map((m: any) => ({
    id: m.id,
    url: m.url,
    type: m.type === '360_view' ? 'image' : m.type, // Handle 360 view if component doesn't support it yet
    thumbnail: m.metadata?.thumbnail
  }))

  if (media.length === 0) {
     media = [
        {
          id: '1',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20front%20view%20studio%20lighting%204k&image_size=landscape_16_9',
          type: 'image' as const,
        },
        {
          id: '2',
          url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20interior%20leather%20seats%20dashboard%204k&image_size=landscape_16_9',
          type: 'image' as const,
        },
        {
            id: '3',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder video
            type: 'video_url' as const,
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
        }
     ]
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
            <h1 className="text-3xl md:text-4xl font-bold">{car.make} {car.model}</h1>
            <p className="text-muted-foreground mt-1 text-lg">{car.description || 'Premium Luxury Vehicle'}</p>
        </div>
        <div className="text-right">
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
        </div>

        {/* Right Column: CTA & Logbook */}
        <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Interested in this car?</h3>
                <div className="space-y-3">
                    <Button className="w-full h-12 text-lg" size="lg">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat with Sales
                    </Button>
                    <BookingModal vehicleId={car.id} vehicleTitle={`${car.make} ${car.model}`} />
                    <div className="grid grid-cols-2 gap-3 pt-2">
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
                <Separator className="my-6" />
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Need financing?</p>
                    <p className="font-semibold text-primary">Est. $3,450 / month</p>
                    <Button variant="link" className="h-auto p-0 text-xs">Calculate Payments</Button>
                </div>
            </div>

            <DigitalLogbook />
        </div>
      </div>
    </div>
  )
}
