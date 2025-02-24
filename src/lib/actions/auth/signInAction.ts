'use server';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/actions/tokenAction';
import { signInInput, signInSchema } from '@/lib/validations/user';
import { getUserByEmail } from '../userActions';
import { sendVerificationEmail } from '@/lib/mail';

export const signInAction = async (
  data: signInInput
): Promise<ResultState<signInInput>> => {
  const validatedFields = signInSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email) {
    return { success: false, message: 'Credenciais inválidas' };
  } else if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    if (!verificationToken) {
      return { success: false, message: 'Erro ao gerar token' };
    }

    const emailResult = await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    if (!emailResult.success) {
      return {
        success: false,
        message: 'Erro ao enviar email de verificação',
      };
    }

    return {
      success: true,
      message: 'Email de confirmação de conta enviado!',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, message: 'Credenciais inválidas' };
        default:
          return { success: false, message: 'Erro ao realizar login' };
      }
    }
    throw error;
  }
};
