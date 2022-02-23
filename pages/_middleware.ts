import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  if (req.nextUrl.pathname === '/') {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
    });
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
  }
}
