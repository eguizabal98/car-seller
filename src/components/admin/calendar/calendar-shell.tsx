'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarToolbar } from './calendar-toolbar';
import { MonthView } from './month-view';
import { DayView } from './day-view';
import { BookingWithDetails } from './booking-event-card';
import { useBookings } from './use-bookings';
import { BookingDetailDialog } from './booking-detail-dialog';

export function CalendarShell() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = React.useState<'month' | 'day'>('month');
  const [selectedBooking, setSelectedBooking] = React.useState<BookingWithDetails | null>(null);

  // Ensure date is always defined for the toolbar
  const currentDate = date || new Date();

  // Fetch bookings using the custom hook
  const { bookings, loading, setBookings } = useBookings(currentDate, viewMode);

  const handleBookingClick = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
  };

  const handleDayClick = (day: Date) => {
    setDate(day);
    setViewMode('day');
  };

  const handleStatusUpdate = (bookingId: string, newStatus: any) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
      <div className="flex gap-4 h-full">
        {/* Sidebar / Mini Calendar */}
        <div className="w-64 hidden md:flex flex-col gap-4 border-r pr-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col border rounded-md shadow-sm bg-background overflow-hidden relative">
          <CalendarToolbar 
            date={currentDate} 
            onDateChange={(d) => setDate(d)} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          
          <div className="flex-1 overflow-hidden relative">
             {loading && (
               <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
             )}

             {viewMode === 'month' ? (
                <MonthView 
                  currentDate={currentDate} 
                  bookings={bookings}
                  onBookingClick={handleBookingClick}
                  onDayClick={handleDayClick}
                />
             ) : (
                <DayView 
                  currentDate={currentDate} 
                  bookings={bookings}
                  onBookingClick={handleBookingClick}
                />
             )}
          </div>
        </div>
      </div>

      <BookingDetailDialog 
        booking={selectedBooking} 
        open={!!selectedBooking} 
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
