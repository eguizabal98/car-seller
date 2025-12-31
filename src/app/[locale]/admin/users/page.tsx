import { createClient } from '@/utils/supabase/server'
import { UsersTable } from './users-table'
import { USER_ROLES, type UserRole } from '@/lib/constants'

export default async function UsersPage() {
  const supabase = await createClient()

  // Get current user role
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch current user's profile to get their role
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const currentUserRole = (currentUserProfile?.role as UserRole) || USER_ROLES.USER

  // Fetch all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return <div>Error loading users</div>
  }

  // Cast users to the expected type
  const formattedUsers = (users || []).map((u) => ({
    ...u,
    role: u.role as UserRole,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      </div>
      <UsersTable
        users={formattedUsers}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
