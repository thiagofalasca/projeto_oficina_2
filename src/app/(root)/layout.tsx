export const dynamic = 'force-dynamic';
import AppLogo from '@/components/AppLogo';
import MobileNav from '@/components/sidebar/MobileNav';
import SideNav from '@/components/sidebar/SideNav';
import { getCurrentUser } from '@/actions/auth/authActions';
import { getUserById } from '@/actions/userActions';
import { redirect } from 'next/navigation';

import React from 'react';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  const userData = await getUserById(user.id);
  if (!userData) redirect('/api/auth/sign-out');

  return (
    <main className="flex h-screen w-full font-inter">
      <SideNav user={user} />
      <div className="flex size-full flex-col">
        <div className="mobile-sidebar">
          <AppLogo type="mobile" />
          <MobileNav user={user} />
        </div>
        <div className="root-container">{children}</div>
      </div>
    </main>
  );
}
