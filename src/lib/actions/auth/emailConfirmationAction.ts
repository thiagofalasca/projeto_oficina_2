'use server';

import { db } from '@/db';
import { getUserByEmail } from '../userActions';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getVerificationTokenByToken } from '../tokenAction';

export const emailConfirmation = async (
  token: string
): Promise<MessageState> => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken)
    return { success: false, message: 'Token não encontrado!' };

  const hasExpired = new Date() > new Date(existingToken.expires);
  if (hasExpired) return { success: false, message: 'Token expirado!' };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser)
    return { success: false, message: 'Email não encontrado!' };

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, existingToken.identifier));
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar email: ', error);
    return { success: false, message: 'Erro ao verificar email' };
  }
};
