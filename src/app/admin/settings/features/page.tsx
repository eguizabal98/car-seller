import { getFeatureFlags } from '@/lib/features'
import { FeatureToggle } from './feature-toggle'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

export default async function FeatureFlagsPage() {
  const features = await getFeatureFlags()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Feature Flags</h3>
        <p className="text-muted-foreground">
          Manage the availability of features across the application.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4">
        {features.map((feature) => (
          <FeatureToggle key={feature.key} feature={feature} />
        ))}
      </div>
    </div>
  )
}
