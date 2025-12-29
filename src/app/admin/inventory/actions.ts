'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleVehicleFeatured(id: string, isFeatured: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('vehicles')
    .update({ is_featured: isFeatured })
    .eq('id', id)

  if (error) {
    throw new Error('Failed to update vehicle status')
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/') // Since homepage displays featured cars
}
