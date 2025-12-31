'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { USER_ROLES, UserRole } from '@/lib/constants'

export type UpdateRoleResponse = {
  error?: string
  success?: boolean
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<UpdateRoleResponse> {
  const supabase = await createClient()

  // 1. Check if current user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 2. Check if current user is ADMIN
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || currentUserProfile.role !== USER_ROLES.ADMIN) {
    return { error: 'Only admins can update user roles' }
  }

  // 3. Update target user's role
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    return { error: 'Failed to update role' }
  }

  // 4. Revalidate
  revalidatePath('/admin/users')
  return { success: true }
}
