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
  updateAdminData,
  updateSuperAdminData,
  updateUserData,
} from '../userActions';
import { Role } from '../../constants';
import { getCurrentUser } from '../auth/authActions';

export const updateStudent = async (
  id: string,
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await updateUser(id, data, 'user');
  return result;
};

export const updateAdmin = async (
  id: string,
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await updateUser(id, data, 'admin');
  return result;
};

export const updateSuperAdmin = async (
  id: string,
  data: UserFormData
): Promise<ResultState<UserFormData>> => {
  const result = await updateUser(id, data, 'superadmin');
  return result;
};

const updateUser = async (
  id: string,
  data: UserFormData,
  role: Role
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

  const updateUserResult =
    role === 'admin'
      ? await updateAdminData(id, userData as adminInput)
      : role === 'superadmin'
        ? await updateSuperAdminData(id, userData as superAdminInput)
        : await updateUserData(id, userData as userInput);

  if (!updateUserResult.success) {
    return { success: false, message: updateUserResult.message };
  }

  expirePath('/users');
  redirect('/users?updated=true');
};
