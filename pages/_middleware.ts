import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/overview', req.url));
  }
  if (req.nextUrl.pathname === '/overview') {
    const isTokenExist = !Object.keys(req.cookies).find((s) =>
      s.includes('session-token')
    );

    if (isTokenExist)
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }
}
