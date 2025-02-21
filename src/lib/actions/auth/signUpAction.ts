'use server';

import { signUpInput, signUpSchema } from '@/validations/auth';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createUser, validateUser } from '../userActions';
import { generateVerificationToken } from '../tokenAction';
import { sendVerificationEmail } from '@/lib/mail';

export const signUpAction = async (
  data: signUpInput
): Promise<ResultState<signUpInput>> => {
  const validatedFields = signUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const userData = validatedFields.data;

  const existingData = await validateUser(
    userData.email,
    userData.cpf,
    userData.ra
  );
  if (!existingData.success) {
    return { success: false, message: existingData.message };
  }

  const createUserResult = await createUser(userData);
  if (!createUserResult.success) {
    return { success: false, message: createUserResult.message };
  }

  const verificationToken = await generateVerificationToken(userData.email);
  if (!verificationToken) {
    return { success: false, message: 'Erro ao gerar token' };
  }

  const emailResult = await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );
  if (!emailResult.success) {
    return { success: false, message: 'Erro ao enviar email de verificação' };
  }

  expirePath('/auth/sign-up/mail-sent');
  redirect('/auth/sign-up/mail-sent');
};
