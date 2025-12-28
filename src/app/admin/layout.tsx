import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

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

  // In a real app, check role:
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  // if (profile?.role !== 'admin') {
  //   redirect('/')
  // }

  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  )
}
