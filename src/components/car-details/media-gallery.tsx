'use client'

import * as React from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Play, Expand, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video_url'
  thumbnail?: string
}

interface MediaGalleryProps {
  media: MediaItem[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const activeMedia = media[activeIndex]

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative overflow-hidden rounded-lg border bg-muted group">
        <AspectRatio ratio={16 / 9}>
          {activeMedia?.type === 'video_url' ? (
            <div className="relative h-full w-full">
              <iframe
                src={activeMedia.url.replace('watch?v=', 'embed/')}
                title="YouTube video player"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
             /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={activeMedia?.url || '/placeholder.svg'}
              alt="Vehicle View"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          )}
        </AspectRatio>
        
        {/* Navigation Arrows for Main Image (Mobile Friendly) */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
             <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-black/40 text-white hover:bg-black/60 border-none h-8 w-8 md:h-10 md:w-10"
                onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = activeIndex === 0 ? media.length - 1 : activeIndex - 1;
                    setActiveIndex(newIndex);
                }}
             >
                <ChevronLeft className="h-4 w-4" />
             </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
             <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-black/40 text-white hover:bg-black/60 border-none h-8 w-8 md:h-10 md:w-10"
                onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = activeIndex === media.length - 1 ? 0 : activeIndex + 1;
                    setActiveIndex(newIndex);
                }}
             >
                <ChevronRight className="h-4 w-4" />
             </Button>
        </div>

        {/* Lightbox Trigger (Only for images for now) */}
        {activeMedia?.type === 'image' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="secondary" className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white">
                <Expand className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full h-[90vh] p-0 border-none bg-black">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.url}
                alt="Full screen view"
                className="w-full h-full object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Thumbnails Carousel */}
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {media.map((item, index) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/4 md:basis-1/5 lg:basis-1/6">
              <button
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative block w-full overflow-hidden rounded-md border-2 transition-all",
                  activeIndex === index ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <AspectRatio ratio={4 / 3}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.type === 'video_url' ? (item.thumbnail || '/video-placeholder.png') : item.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {item.type === 'video_url' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-6 w-6 text-white fill-current" />
                    </div>
                  )}
                </AspectRatio>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  )
}
