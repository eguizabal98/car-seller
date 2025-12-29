'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, User, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { USER_ROLES, type UserRole } from '@/lib/constants'
import { useFeature } from '@/providers/feature-flag-provider'

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const buyEnabled = useFeature('buy')
  const sellEnabled = useFeature('sell')
  const financeEnabled = useFeature('finance')
  const aboutEnabled = useFeature('about')

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setRole(profile.role as UserRole)
        }
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            setRole(profile.role as UserRole)
          }
        } else {
          setRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-6 mt-8">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Car className="h-6 w-6" />
                <span>CarSeller</span>
              </Link>
              <div className="flex flex-col gap-4">
                {buyEnabled && (
                  <Link href="/buy" className="text-lg font-medium text-muted-foreground hover:text-foreground py-2">
                    Buy
                  </Link>
                )}
                {sellEnabled && (
                  <Link href="/sell" className="text-lg font-medium text-muted-foreground hover:text-foreground py-2">
                    Sell
                  </Link>
                )}
                {financeEnabled && (
                  <Link href="/finance" className="text-lg font-medium text-muted-foreground hover:text-foreground py-2">
                    Finance
                  </Link>
                )}
                {aboutEnabled && (
                  <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-foreground py-2">
                    About
                  </Link>
                )}
              </div>
              
              {/* Mobile User Actions */}
              <div className="mt-auto border-t pt-6">
                 {user ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.user_metadata.avatar_url} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.user_metadata.full_name || 'User'}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                    {(role === USER_ROLES.ADMIN || role === USER_ROLES.STAFF) && (
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/admin/inventory">Admin Panel</Link>
                      </Button>
                    )}
                    <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/profile">Profile</Link>
                    </Button>
                    <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
                        Log out
                    </Button>
                    </div>
                 ) : (
                    <Button asChild className="w-full">
                        <Link href="/login">Sign In</Link>
                    </Button>
                 )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">CarSeller</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {buyEnabled && (
            <Link href="/buy" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Buy
            </Link>
          )}
          {sellEnabled && (
            <Link href="/sell" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Sell
            </Link>
          )}
          {financeEnabled && (
            <Link href="/finance" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Finance
            </Link>
          )}
          {aboutEnabled && (
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile Search Trigger */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
                <Link href="/buy">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Search</span>
                </Link>
            </Button>
            
            {/* Desktop Search Input */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cars..."
                className="h-9 w-full rounded-md border border-input bg-background pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata.full_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(role === USER_ROLES.ADMIN || role === USER_ROLES.STAFF) && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/inventory">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
