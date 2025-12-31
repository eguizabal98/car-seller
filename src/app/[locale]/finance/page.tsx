import { FinanceCalculator } from '@/components/tools/finance-calculator'
import { TradeInForm } from '@/components/tools/trade-in-form'
import { Separator } from '@/components/ui/separator'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { type Metadata, type ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({locale, namespace: 'Finance'});
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function FinancePage() {
  if (!await isFeatureEnabled('finance')) {
    return notFound()
  }

  const t = await getTranslations('Finance')

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h2 className="text-xl font-semibold mb-4">{t('paymentCalculator')}</h2>
            <p className="text-muted-foreground mb-6">
                {t('paymentCalculatorDesc')}
            </p>
            <FinanceCalculator vehiclePrice={50000} />
        </div>
        
        <div>
            <h2 className="text-xl font-semibold mb-4">{t('tradeInValuation')}</h2>
            <p className="text-muted-foreground mb-6">
                {t('tradeInValuationDesc')}
            </p>
            <TradeInForm />
        </div>
      </div>
    </div>
  )
}
