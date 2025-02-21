'use server';

import { auth } from '@/auth';
import { Role } from '../../constants';
import { cache } from 'react';

interface Session {
  user: loggedUser | undefined;
}

export const getCurrentUser = cache(
  async (): Promise<loggedUser | undefined> => {
    const session = (await auth()) as Session;
    return session?.user;
  }
);

export const getCurrentRole = cache(async (): Promise<Role | undefined> => {
  const session = await auth();
  return session?.user?.role;
});
