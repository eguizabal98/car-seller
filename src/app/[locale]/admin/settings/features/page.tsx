import { getFeatureFlags } from '@/lib/features'
import { FeatureToggle } from './feature-toggle'
import { Separator } from '@/components/ui/separator'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function FeatureFlagsPage() {
  const features = await getFeatureFlags()
  const t = await getTranslations('Admin')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">{t('featureFlags')}</h3>
        <p className="text-muted-foreground">
          {t('featureFlagsDescription')}
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
