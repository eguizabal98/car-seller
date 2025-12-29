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

  // First delete related media (though ON DELETE CASCADE might handle this if configured)
  // But let's be safe or if we want to clean up storage later
  await supabase.from('media').delete().eq('vehicle_id', id)

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
  const { media, ...vehicleData } = data

  const { error } = await supabase
    .from('vehicles')
    .update(vehicleData)
    .eq('id', id)

  if (error) {
    console.error('Update error:', error)
    throw new Error('Failed to update vehicle')
  }

  if (media) {
    // Get existing media IDs
    const { data: existingMedia } = await supabase
      .from('media')
      .select('id')
      .eq('vehicle_id', id)
    
    const existingIds = existingMedia?.map(m => m.id) || []
    const incomingIds = media.filter((m: any) => m.id).map((m: any) => m.id)
    
    // Delete removed items
    const toDelete = existingIds.filter(existingId => !incomingIds.includes(existingId))
    if (toDelete.length > 0) {
      await supabase.from('media').delete().in('id', toDelete)
    }

    // Update or Insert items
    for (const m of media) {
      if (m.id) {
        await supabase.from('media').update({
          is_primary: m.is_primary,
          caption: m.caption,
        }).eq('id', m.id)
      } else {
        await supabase.from('media').insert({
          vehicle_id: id,
          url: m.url,
          type: m.type,
          is_primary: m.is_primary,
          caption: m.caption
        })
      }
    }
  }

  revalidatePath('/admin/inventory')
  revalidatePath(`/admin/inventory/${id}`)
}

export async function createVehicle(data: any) {
  const supabase = await createClient()
  const { media, ...vehicleData } = data

  const { data: newVehicle, error } = await supabase
    .from('vehicles')
    .insert(vehicleData)
    .select()
    .single()

  if (error) {
    console.error('Create error:', error)
    throw new Error('Failed to create vehicle')
  }

  if (media && media.length > 0) {
    const mediaToInsert = media.map((m: any) => ({
      vehicle_id: newVehicle.id,
      url: m.url,
      type: m.type,
      is_primary: m.is_primary,
      caption: m.caption
    }))
    
    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaToInsert)
      
    if (mediaError) {
      console.error('Media insert error:', mediaError)
      // We don't throw here to avoid failing the whole creation if media fails, 
      // but maybe we should. User can retry adding media in edit mode.
    }
  }

  revalidatePath('/admin/inventory')
  return newVehicle
}
