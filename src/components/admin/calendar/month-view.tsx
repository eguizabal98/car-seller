'use client';

import * as React from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { BookingEventCard, BookingWithDetails } from './booking-event-card';

interface MonthViewProps {
  currentDate: Date;
  bookings: BookingWithDetails[];
  onBookingClick?: (booking: BookingWithDetails) => void;
  onDayClick?: (date: Date) => void;
}

export function MonthView({
  currentDate,
  bookings,
  onBookingClick,
  onDayClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-[repeat(auto-fit,minmax(100px,1fr))] overflow-auto">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          const dayBookings = bookings.filter((booking) =>
            isSameDay(new Date(booking.booking_date), day)
          );

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                'group relative border-b border-r p-2 transition-colors hover:bg-muted/30 cursor-pointer min-h-[100px] flex flex-col gap-1',
                !isCurrentMonth && 'bg-muted/10 text-muted-foreground',
                isToday && 'bg-accent/10'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full',
                    isToday && 'bg-primary text-primary-foreground',
                    !isCurrentMonth && 'text-muted-foreground/50'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-[10px] text-muted-foreground font-medium md:hidden">
                    {dayBookings.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[120px]">
                {dayBookings.map((booking) => (
                  <div key={booking.id} onClick={(e) => e.stopPropagation()}>
                    <BookingEventCard
                      booking={booking}
                      onClick={onBookingClick}
                      variant="compact"
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
