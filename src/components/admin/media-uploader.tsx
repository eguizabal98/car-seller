'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Upload, Image as ImageIcon, Video, Loader2, Star } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface MediaItem {
  id?: string
  url: string
  type: 'image' | 'video'
  is_primary?: boolean
  caption?: string
}

interface MediaUploaderProps {
  initialMedia?: MediaItem[]
  onChange: (media: MediaItem[]) => void
  vehicleId?: string
}

export function MediaUploader({ initialMedia = [], onChange, vehicleId }: MediaUploaderProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [isUploading, setIsUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    setMedia(initialMedia)
  }, [initialMedia])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newMediaItems: MediaItem[] = []

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = vehicleId ? `${vehicleId}/${fileName}` : `temp/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath)

        newMediaItems.push({
          url: publicUrl,
          type: 'image',
          is_primary: media.length === 0 && newMediaItems.length === 0 // Make first image primary if no media exists
        })
      }

      const updatedMedia = [...media, ...newMediaItems]
      setMedia(updatedMedia)
      onChange(updatedMedia)
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleAddVideo = () => {
    if (!videoUrl) return

    // Basic validation for YouTube/Vimeo links could go here
    const newMedia: MediaItem = {
      url: videoUrl,
      type: 'video',
      is_primary: false
    }

    const updatedMedia = [...media, newMedia]
    setMedia(updatedMedia)
    onChange(updatedMedia)
    setVideoUrl('')
    toast.success('Video added successfully')
  }

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = media.filter((_, i) => i !== index)
    
    // If we removed the primary image, make the first available image primary
    if (media[index].is_primary && updatedMedia.length > 0) {
      const firstImageIndex = updatedMedia.findIndex(m => m.type === 'image')
      if (firstImageIndex >= 0) {
        updatedMedia[firstImageIndex].is_primary = true
      }
    }
    
    setMedia(updatedMedia)
    onChange(updatedMedia)
  }

  const handleSetPrimary = (index: number) => {
    const updatedMedia = media.map((item, i) => ({
      ...item,
      is_primary: i === index
    }))
    setMedia(updatedMedia)
    onChange(updatedMedia)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Label>Photos & Videos</Label>
        
        <div className="flex gap-4 items-start flex-wrap">
          <div className="flex-1 min-w-[300px] space-y-4">
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <Button asChild variant="outline" disabled={isUploading}>
                <label htmlFor="image-upload" className="cursor-pointer">
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Upload Photos
                </label>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Video URL (YouTube/Vimeo)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button type="button" onClick={handleAddVideo} variant="secondary">
                <Video className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </div>
          </div>
        </div>

        {media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {media.map((item, index) => (
              <div key={index} className="relative group aspect-video bg-muted rounded-md overflow-hidden border">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt="Vehicle"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveMedia(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {item.type === 'image' && (
                    <Button
                      type="button"
                      variant={item.is_primary ? "default" : "secondary"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetPrimary(index)}
                      title="Set as primary"
                    >
                      <Star className={cn("h-4 w-4", item.is_primary && "fill-current")} />
                    </Button>
                  )}
                </div>
                
                {item.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Video className="h-3 w-3 mr-1" /> Video
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
