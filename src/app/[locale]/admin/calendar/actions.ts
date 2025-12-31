'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

type BookingStatus = Database['public']['Enums']['booking_status'];

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    throw new Error('Failed to update booking status');
  }

  revalidatePath('/admin/calendar');
  revalidatePath('/admin/leads');
}
