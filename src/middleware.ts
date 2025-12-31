import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first
  const response = intlMiddleware(request);

  // 2. Pass the response to Supabase middleware to handle auth & cookies
  // We pass the response so Supabase can set cookies on it without destroying the next-intl rewrite.
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // Enable a comprehensive matcher to ensure everything is processed
    // However, we exclude internal Next.js paths and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
