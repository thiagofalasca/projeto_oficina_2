import 'server-only';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import { verificationTokens, PasswordResetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getVerificationTokenByToken = async (
  token: string
): Promise<Token | null> => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
    return verificationToken ?? null;
  } catch (error) {
    console.error(`Erro ao buscar token por token: ${token}`, error);
    return null;
  }
};

export const getVerificationTokenByEmail = async (
  email: string
): Promise<Token | null> => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });
    return verificationToken ?? null;
  } catch (error) {
    console.error(`Erro ao buscar token por token: ${email}`, error);
    return null;
  }
};

export const generateVerificationToken = async (
  email: string
): Promise<Token | null> => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, existingToken.identifier));
    }

    const verificationToken = await db
      .insert(verificationTokens)
      .values({ email, token, expires })
      .returning()
      .then((result) => result[0]);
    return verificationToken;
  } catch (error) {
    console.error('Erro ao gerar token de verificação: ', error);
    return null;
  }
};

export const getPasswordResetTokenByToken = async (
  token: string
): Promise<Token | null> => {
  try {
    const passwordResetToken = await db.query.PasswordResetTokens.findFirst({
      where: eq(PasswordResetTokens.token, token),
    });
    return passwordResetToken ?? null;
  } catch (error) {
    console.error(`Erro ao buscar token por token: ${token}`, error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (
  email: string
): Promise<Token | null> => {
  try {
    const passwordResetToken = await db.query.PasswordResetTokens.findFirst({
      where: eq(PasswordResetTokens.email, email),
    });
    return passwordResetToken ?? null;
  } catch (error) {
    console.error(`Erro ao buscar token por email: ${email}`, error);
    return null;
  }
};

export const generatePasswordResetToken = async (
  email: string
): Promise<Token | null> => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db
        .delete(PasswordResetTokens)
        .where(eq(PasswordResetTokens.identifier, existingToken.identifier));
    }

    const PasswordResetToken = await db
      .insert(PasswordResetTokens)
      .values({ email, token, expires })
      .returning()
      .then((result) => result[0]);
    return PasswordResetToken;
  } catch (error) {
    console.error('Erro ao gerar token de redefinição de senha: ', error);
    return null;
  }
};
