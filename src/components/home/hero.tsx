import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative min-h-[600px] lg:min-h-[80vh] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20sport%20car%20dark%20studio%20lighting%20side%20profile%20elegant%204k&image_size=landscape_16_9")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container flex flex-col justify-center items-center text-center text-white space-y-8 py-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          Find Your Dream Machine
        </h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md leading-relaxed">
          Experience the finest selection of premium pre-owned vehicles with our immersive digital showroom.
        </p>
        
        {/* Search Entry Point */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <Input 
            type="text" 
            placeholder="Search by make, model, or lifestyle..." 
            className="bg-transparent border-none text-white placeholder:text-gray-300 focus-visible:ring-0 text-lg h-12 w-full"
          />
          <Button size="lg" className="px-8 h-12 w-full sm:w-auto font-semibold">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
          <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black w-full sm:w-auto h-12 px-8 text-base">
            <Link href="/buy">Browse Inventory</Link>
          </Button>
          <Button asChild variant="default" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
            <Link href="/sell">Sell Your Car</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
