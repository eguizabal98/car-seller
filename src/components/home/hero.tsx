import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20sport%20car%20dark%20studio%20lighting%20side%20profile%20elegant%204k&image_size=landscape_16_9")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container flex h-full flex-col justify-center items-center text-center text-white space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Find Your Dream Machine
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
          Experience the finest selection of premium pre-owned vehicles with our immersive digital showroom.
        </p>
        
        {/* Search Entry Point */}
        <div className="w-full max-w-2xl flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <Input 
            type="text" 
            placeholder="Search by make, model, or lifestyle (e.g., 'Track-ready')" 
            className="bg-transparent border-none text-white placeholder:text-gray-400 focus-visible:ring-0 text-lg h-12"
          />
          <Button size="lg" className="px-8 h-12">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
            <Link href="/buy">Browse Inventory</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/sell">Sell Your Car</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
