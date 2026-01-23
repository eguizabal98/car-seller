'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Car, Users, Calendar, BarChart, Settings, LogOut, UserCog } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin')
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const items = [
    {
      title: t('inventory'),
      url: '/admin/inventory',
      icon: Car,
    },
    {
      title: t('leads'),
      url: '/admin/leads',
      icon: Users,
    },
    {
      title: t('calendar'),
      url: '/admin/calendar',
      icon: Calendar,
    },
    {
      title: t('analytics'),
      url: '/admin/analytics',
      icon: BarChart,
    },
    {
      title: t('users'),
      url: '/admin/users',
      icon: UserCog,
    },
    {
      title: t('acquisitions'),
      url: '/admin/acquisitions',
      icon: Car, // Or another icon like 'ShoppingBag' or 'CreditCard' if imported
    },
    {
      title: t('featureFlags'),
      url: '/admin/settings/features',
      icon: Settings,
    },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href="/admin/inventory" className="flex items-center gap-2 font-bold text-xl">
              <Car className="h-6 w-6 text-primary" />
              <span>{t('adminPanel')}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('management')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <LogOut className="h-4 w-4" />
                  <span>{t('signOut')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-6 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
