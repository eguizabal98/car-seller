import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isFeatureEnabled } from '@/lib/features';
import { CalendarShell } from '@/components/admin/calendar/calendar-shell';

export const metadata: Metadata = {
  title: 'Admin Calendar | Car Seller',
  description: 'Manage test drives and video walkthrough appointments',
};

export default async function AdminCalendarPage() {
  const isEnabled = await isFeatureEnabled('admin_calendar');

  if (!isEnabled) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
      </div>
      <CalendarShell />
    </div>
  );
}
