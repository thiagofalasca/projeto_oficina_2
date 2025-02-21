'use server';

import { sendPasswordResetEmail } from '../../mail';
import { generatePasswordResetToken } from '@/actions/tokenAction';
import { resetInput, resetSchema } from '../../validations/auth';
import { getUserByEmail } from '../userActions';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';

export const resetAction = async (
  data: resetInput
): Promise<ResultState<resetInput>> => {
  const validatedFields = resetSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { success: false, message: 'Email não encontrado' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken) {
    return { success: false, message: 'Erro ao gerar token' };
  }

  const emailResult = await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  if (!emailResult.success) {
    return {
      success: false,
      message: 'Erro ao enviar email de redefinição de senha',
    };
  }

  expirePath('/auth/reset/mail-sent');
  redirect('/auth/reset/mail-sent');
};
