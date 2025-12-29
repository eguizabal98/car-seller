import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { BookingWithDetails } from '@/components/admin/calendar/booking-event-card';

export function useBookings(date: Date, viewMode: 'month' | 'day') {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const supabase = createClient();
      
      // Determine date range
      const start = new Date(date);
      const end = new Date(date);
      
      if (viewMode === 'month') {
        start.setDate(1); // Start of month
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // End of month
      } else {
        // For day view, we just need that specific day
        // But to be safe with timezones, let's fetch the whole day range 00:00 to 23:59
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      }

      // Format as YYYY-MM-DD for comparison
      // Supabase date comparison works on string dates for 'date' column types, 
      // but 'bookings.booking_date' is likely a 'date' or 'timestamp'
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(*),
          profile:profiles(*)
        `)
        .gte('booking_date', start.toISOString().split('T')[0])
        .lte('booking_date', end.toISOString().split('T')[0]);

      if (!error && data) {
        setBookings(data as BookingWithDetails[]);
      }
      
      setLoading(false);
    }

    fetchBookings();
  }, [date, viewMode]);

  return { bookings, loading, setBookings };
}
