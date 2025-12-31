'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useTransition } from 'react'
import { toggleFeatureFlag } from '../actions'
import { toast } from 'sonner'
import type { FeatureFlag } from '@/lib/features'

export function FeatureToggle({ feature }: { feature: FeatureFlag }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      try {
        await toggleFeatureFlag(feature.key, checked)
        toast.success(`Feature "${feature.key}" ${checked ? 'enabled' : 'disabled'}`)
      } catch (error) {
        toast.error('Failed to update feature flag')
        console.error(error)
      }
    })
  }

  return (
    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 shadow-sm">
      <div className="space-y-0.5">
        <Label className="text-base font-medium capitalize">
          {feature.key}
        </Label>
        <p className="text-sm text-muted-foreground">
          {feature.description}
        </p>
      </div>
      <Switch
        checked={feature.is_enabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
    </div>
  )
}
