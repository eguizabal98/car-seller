'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingWithDetails } from './booking-event-card';
import { updateBookingStatus } from '@/app/admin/calendar/actions';
import { Database } from '@/types/supabase';

interface BookingDetailDialogProps {
  booking: BookingWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (bookingId: string, newStatus: Database['public']['Enums']['booking_status']) => void;
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  onStatusUpdate,
}: BookingDetailDialogProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!booking) return null;

  const handleStatusChange = async (status: Database['public']['Enums']['booking_status']) => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(booking.id, status);
      onStatusUpdate(booking.id, status);
      toast.success(`Booking marked as ${status}`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update booking status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            {format(new Date(booking.booking_date), 'MMMM d, yyyy')} at {booking.time_slot}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Vehicle Info */}
          <div className="flex gap-4 items-start">
            {booking.vehicle?.image_url && (
              <img
                src={booking.vehicle.image_url}
                alt={booking.vehicle.model}
                className="w-24 h-16 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="font-semibold">
                {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                ${booking.vehicle?.price?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground capitalize mt-1">
                Type: {booking.type.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{booking.profile?.full_name}</span>
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{booking.profile?.email}</span>
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{booking.profile?.phone_number || 'N/A'}</span>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Notes
              </h4>
              <p className="text-sm bg-muted p-2 rounded-md">{booking.notes}</p>
            </div>
          )}

          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Status:</span>
            <span className="text-sm font-medium capitalize px-2 py-0.5 rounded-full bg-secondary">
              {booking.status}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {booking.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdating}
              >
                Cancel Booking
              </Button>
              <Button
                onClick={() => handleStatusChange('confirmed')}
                disabled={isUpdating}
              >
                Confirm Booking
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button
                variant="outline"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
              >
                Mark Complete
              </Button>
            </>
          )}
          {(booking.status === 'cancelled' || booking.status === 'completed') && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
