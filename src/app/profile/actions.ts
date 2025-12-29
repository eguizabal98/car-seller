'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return { ...profile, email: user.email }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const fullName = formData.get('fullName') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl = null

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return { message: 'Failed to upload avatar', type: 'error' }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    avatarUrl = publicUrl
  }

  const updates: any = {
    full_name: fullName,
    phone_number: phoneNumber,
  }

  if (avatarUrl) {
    updates.avatar_url = avatarUrl
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { message: 'Failed to update profile', type: 'error' }
  }

  revalidatePath('/profile')
  revalidatePath('/', 'layout') // Update navbar avatar
  return { message: 'Profile updated successfully', type: 'success' }
}
