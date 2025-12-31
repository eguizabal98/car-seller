import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { USER_ROLES } from '@/lib/constants'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== USER_ROLES.ADMIN && profile.role !== USER_ROLES.STAFF)) {
    redirect('/')
  }

  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  )
}
