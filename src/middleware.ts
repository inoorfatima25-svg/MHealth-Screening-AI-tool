import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Gates every /admin page and /api/admin route behind HTTP Basic Auth.
 *
 * The admin panel shows participant mental-health responses (PHQ-9/GAD-7
 * answers, safety flags, contact details) and previously had no auth at
 * all — see the comment that used to live in src/app/admin/layout.tsx.
 * This is the minimum fix before the link is shared with anyone.
 *
 * Set ADMIN_PASSWORD in your environment (Vercel → Project → Settings →
 * Environment Variables, or .env.local for local dev). Username is fixed
 * as "admin"; only the password is checked.
 *
 * If ADMIN_PASSWORD is not set, the admin panel is blocked entirely rather
 * than left open — a missing password must never fail open.
 */
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  const unauthorized = () =>
    new NextResponse('Authentication required.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' },
    });

  if (!password) {
    // Fail closed: no configured password means no admin access, not open access.
    return new NextResponse(
      'Admin panel is not configured. Set ADMIN_PASSWORD in your environment.',
      { status: 503 }
    );
  }

  const header = req.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return unauthorized();

  const decoded = atob(header.slice('Basic '.length));
  const separatorIndex = decoded.indexOf(':');
  const suppliedPassword = separatorIndex === -1 ? '' : decoded.slice(separatorIndex + 1);

  if (suppliedPassword !== password) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
