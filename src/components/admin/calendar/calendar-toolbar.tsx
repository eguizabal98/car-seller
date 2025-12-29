'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarToolbarProps {
  date: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'month' | 'day';
  onViewModeChange: (mode: 'month' | 'day') => void;
}

export function CalendarToolbar({
  date,
  onDateChange,
  viewMode,
  onViewModeChange,
}: CalendarToolbarProps) {
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    if (viewMode === 'month') {
      newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('prev')} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => navigate('next')} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
        <h2 className="text-lg font-semibold ml-2 min-w-[150px]">
          {format(date, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Select value={viewMode} onValueChange={(v) => onViewModeChange(v as 'month' | 'day')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Month View</span>
              </div>
            </SelectItem>
            <SelectItem value="day">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Day View</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
