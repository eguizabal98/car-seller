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

export async function deleteVehicle(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete vehicle')
  }

  revalidatePath('/admin/inventory')
}

export async function updateVehicle(id: string, data: any) {
  const supabase = await createClient()

  // Remove any undefined values to avoid sending them to Supabase (though Supabase usually ignores them or handles nulls, better to be clean)
  // For simplicity, we pass data directly assuming it matches DB columns.
  
  const { error } = await supabase
    .from('vehicles')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Update error:', error)
    throw new Error('Failed to update vehicle')
  }

  revalidatePath('/admin/inventory')
  revalidatePath(`/admin/inventory/${id}`)
}
