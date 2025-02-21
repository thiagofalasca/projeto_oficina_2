'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { PasswordResetTokens, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { newPasswordInput, newPasswordSchema } from '@/validations/auth';
import { getPasswordResetTokenByToken } from '../tokenAction';
import { getUserByEmail } from '../userActions';

interface NewPasswordProps {
  passwordData: {
    password: string;
    confirmPassword: string;
  };
  token?: string | null;
}

export const newPasswordAction = async ({
  passwordData,
  token,
}: NewPasswordProps): Promise<ResultState<newPasswordInput>> => {
  if (!token) return { success: false, message: 'Faltando token' };

  const validatedFields = newPasswordSchema.safeParse(passwordData);
  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { success: false, message: 'Token inválido' };
  }

  const hasExpired = new Date() > new Date(existingToken.expires);
  if (hasExpired) {
    return { success: false, message: 'Token expirado!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { success: false, message: 'Email não encontrado!' };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ hashedPassword })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(PasswordResetTokens)
        .where(eq(PasswordResetTokens.identifier, existingToken.identifier));
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha: ', error);
    return { success: false, message: 'Erro ao redefinir senha' };
  }
};
