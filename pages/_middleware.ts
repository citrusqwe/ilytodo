import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/overview', req.url));
  }
  if (req.nextUrl.pathname === '/overview') {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
    });
    if (!token)
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }
}
