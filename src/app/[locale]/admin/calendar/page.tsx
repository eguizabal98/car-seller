import { CalendarShell } from '@/components/admin/calendar/calendar-shell'
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
  const t = await getTranslations({locale, namespace: 'Admin'});
 
  return {
    title: t('calendarTitle'),
    description: t('calendarDescription'),
  };
}

export default async function CalendarPage() {
  if (!await isFeatureEnabled('calendar')) {
    return notFound()
  }

  const t = await getTranslations('Admin')

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">{t('calendarTitle')}</h3>
        <p className="text-muted-foreground">
          {t('calendarDescription')}
        </p>
      </div>
      <div className="flex-1 min-h-0 border rounded-lg bg-background shadow-sm overflow-hidden">
        <CalendarShell />
      </div>
    </div>
  )
}
