import * as React from 'react';
import { Car, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/types/supabase';

// We need a composite type for the booking because it includes joined data
export type BookingWithDetails = Database['public']['Tables']['bookings']['Row'] & {
  vehicle: Database['public']['Tables']['vehicles']['Row'] | null;
  profile: Database['public']['Tables']['profiles']['Row'] | null;
};

interface BookingEventCardProps {
  booking: BookingWithDetails;
  onClick?: (booking: BookingWithDetails) => void;
  variant?: 'compact' | 'default';
}

export function BookingEventCard({ booking, onClick, variant = 'default' }: BookingEventCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50',
    confirmed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50',
    cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
    completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
  };

  const Icon = booking.type === 'video_walkthrough' ? Video : Car;

  return (
    <div
      onClick={() => onClick?.(booking)}
      className={cn(
        'rounded-md border px-2 py-1 text-xs font-medium cursor-pointer transition-colors hover:opacity-80 truncate flex items-center gap-1.5',
        statusColors[booking.status] || 'bg-gray-100 text-gray-800',
        variant === 'compact' ? 'h-6' : 'h-auto min-h-[1.5rem]'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(booking);
        }
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">
        {booking.time_slot} - {booking.profile?.full_name || 'Unknown User'}
      </span>
    </div>
  );
}
