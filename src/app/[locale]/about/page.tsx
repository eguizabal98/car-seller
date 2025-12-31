import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  if (!await isFeatureEnabled('about')) {
    return notFound();
  }

  const t = await getTranslations('About');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p>{t('comingSoon')}</p>
    </div>
  );
}
