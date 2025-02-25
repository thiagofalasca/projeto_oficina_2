'use server';

import {
  adminInput,
  adminSchema,
  superAdminInput,
  superAdminSchema,
  userInput,
  userSchema,
} from '@/lib/validations/user';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  insertAdmin,
  insertSuperAdmin,
  insertUser,
  validateUser,
} from '../userActions';
import { generateVerificationToken } from '../tokenAction';
import { sendVerificationEmail } from '@/lib/mail';
import { Role } from '../../constants';
import { getCurrentUser } from '../auth/authActions';

export const signUpAction = async (
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await createUser(data, 'user', true);
  return result;
};

export const addStudent = async (
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await createUser(data, 'user', false);
  return result;
};

export const addAdmin = async (
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await createUser(data, 'admin', false);
  return result;
};

export const addSuperAdmin = async (
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await createUser(data, 'superadmin', false);
  return result;
};

const createUser = async (
  data: UserFormData,
  role: Role,
  isSignUp: boolean
): Promise<ResultState<UserFormData>> => {
  if (role !== 'user') {
    const user = await getCurrentUser();
    if (!user) redirect('/api/auth/sign-out');
    if (user.role !== 'superadmin') redirect('/users');
  }

  let schema;
  if (role === 'admin') {
    schema = adminSchema;
  } else if (role === 'superadmin') {
    schema = superAdminSchema;
  } else {
    schema = userSchema;
  }

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const userData =
    role === 'user'
      ? (validatedFields.data as userInput)
      : role === 'admin'
        ? (validatedFields.data as adminInput)
        : (validatedFields.data as superAdminInput);

  const existingData = await validateUser(
    userData.email,
    userData.cpf,
    role === 'user' ? (userData as userInput).ra : undefined
  );
  if (!existingData.success) {
    return { success: false, message: existingData.message };
  }

  const createUserResult =
    role === 'admin'
      ? await insertAdmin(userData as adminInput)
      : role === 'superadmin'
        ? await insertSuperAdmin(userData as superAdminInput)
        : await insertUser(userData as userInput);

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
  if (isSignUp) {
    expirePath('/auth/sign-up/mail-sent');
    redirect('/auth/sign-up/mail-sent');
  }
  expirePath('/users');
  redirect('/users?created=true');
};
