import { signOut } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await signOut();
  return NextResponse.redirect(
    new URL('/auth/sign-in', process.env.NEXT_PUBLIC_APP_URL)
  );
}
