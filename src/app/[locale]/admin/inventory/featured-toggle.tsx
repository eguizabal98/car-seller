'use client'

import { Switch } from '@/components/ui/switch'
import { toggleVehicleFeatured } from './actions'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface FeaturedToggleProps {
  id: string
  initialIsFeatured: boolean
}

export function FeaturedToggle({ id, initialIsFeatured }: FeaturedToggleProps) {
  const [isPending, startTransition] = useTransition()
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured)

  const handleToggle = (checked: boolean) => {
    // Optimistic update
    setIsFeatured(checked)
    
    startTransition(async () => {
      try {
        await toggleVehicleFeatured(id, checked)
        toast.success(`Vehicle ${checked ? 'marked as featured' : 'removed from featured'}`)
      } catch (error) {
        // Revert on failure
        setIsFeatured(!checked)
        toast.error('Failed to update status')
        console.error(error)
      }
    })
  }

  return (
    <Switch 
      checked={isFeatured} 
      onCheckedChange={handleToggle} 
      disabled={isPending}
    />
  )
}
