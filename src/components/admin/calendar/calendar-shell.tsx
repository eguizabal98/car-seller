'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarToolbar } from './calendar-toolbar';

export function CalendarShell() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = React.useState<'month' | 'day'>('month');

  // Ensure date is always defined for the toolbar
  const currentDate = date || new Date();

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
        <div className="flex-1 flex flex-col border rounded-md shadow-sm bg-background">
          <CalendarToolbar 
            date={currentDate} 
            onDateChange={(d) => setDate(d)} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex items-center justify-center h-full text-muted-foreground">
                {viewMode === 'month' ? (
                    <p>Month View for {format(currentDate, 'MMMM yyyy')}</p>
                ) : (
                    <p>Day View for {format(currentDate, 'MMMM d, yyyy')}</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
