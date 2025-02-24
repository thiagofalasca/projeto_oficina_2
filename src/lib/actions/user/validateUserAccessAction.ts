'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Role, ROLES } from '@/lib/constants';
import { getCurrentUser } from '../auth/authActions';

export const validateUserAccess = async (
  userId: string,
  allowedRoles: Role[] = Object.values(ROLES)
): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    if (!allowedRoles.includes(user.role)) {
      return false;
    }

    if (user.role === 'superadmin') return true;

    if (user.role === 'admin') {
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      return targetUser.role === 'user';
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return targetUser.id === user.id;
  } catch (error) {
    console.error('Erro ao validar acesso ao usuário:', error);
    return false;
  }
};
