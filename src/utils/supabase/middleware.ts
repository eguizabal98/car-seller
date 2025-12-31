import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { USER_ROLES } from '@/lib/constants'

export async function updateSession(request: NextRequest, initialResponse?: NextResponse) {
  let response = initialResponse ?? NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          
          // If we didn't have an initial response, we might want to refresh it with the new request
          // But if we do (from next-intl), we must preserve it.
          if (!initialResponse) {
             response = NextResponse.next({
                request,
             })
          }
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect Admin Routes
  // Handle localized paths (e.g. /es/admin, /en/admin, or just /admin)
  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin') || pathname.match(/^\/[a-z]{2}\/admin/)

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      // Redirect to login (preserve locale?)
      // For now, simple redirect.
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== USER_ROLES.ADMIN && profile.role !== USER_ROLES.STAFF)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}
