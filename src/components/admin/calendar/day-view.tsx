'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import { BookingEventCard, BookingWithDetails } from './booking-event-card';

interface DayViewProps {
  currentDate: Date;
  bookings: BookingWithDetails[];
  onBookingClick?: (booking: BookingWithDetails) => void;
}

export function DayView({ currentDate, bookings, onBookingClick }: DayViewProps) {
  // Generate hours from 8 AM to 8 PM
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8, 9, ..., 20

  // Filter bookings for the current day
  const todaysBookings = bookings.filter((booking) =>
    isSameDay(new Date(booking.booking_date), currentDate)
  );

  return (
    <div className="flex flex-col h-full overflow-auto bg-background">
      {/* Header */}
      <div className="p-4 border-b text-center font-semibold sticky top-0 bg-background z-10">
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </div>

      <div className="flex-1 relative min-w-[600px]">
        {hours.map((hour) => {
          // Find bookings for this hour
          // Assuming time_slot is in "HH:mm" or "HH:mm:ss" 24h format
          // We check if the time_slot string starts with the hour (padded)
          const hourStr = hour.toString().padStart(2, '0');
          const hourBookings = todaysBookings.filter((booking) => {
             // Flexible matching: "09:00", "9:00", "09:30"
             const bookingHour = parseInt(booking.time_slot.split(':')[0], 10);
             return bookingHour === hour;
          });

          return (
            <div key={hour} className="flex border-b min-h-[100px] group">
              {/* Time Label */}
              <div className="w-20 p-4 border-r text-sm text-muted-foreground font-medium sticky left-0 bg-background">
                {format(new Date().setHours(hour, 0), 'h aa')}
              </div>

              {/* Events Area */}
              <div className="flex-1 p-2 flex flex-col gap-2 transition-colors group-hover:bg-muted/10">
                {hourBookings.map((booking) => (
                  <div key={booking.id} className="max-w-md">
                    <BookingEventCard
                      booking={booking}
                      onClick={onBookingClick}
                      variant="default"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
