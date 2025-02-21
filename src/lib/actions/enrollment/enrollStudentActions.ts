'use server';

import { getCurrentUser } from '../auth/authActions';
import { workshopEnrollments } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  IdentifierInput,
  IdentifierSchema,
  KeyInput,
  KeySchema,
} from '@/validations/workshop';
import { getStudentByIdentifier, getStudentByUserId } from '../studentActions';
import { validateWorkshopAccess } from '../workshop/validateWorkshopAccessAction';

const enrollStudentInWorkshop = async (
  workshopId: string,
  studentId: string
): Promise<MessageState> => {
  const [existingEnrollment] = await db
    .select()
    .from(workshopEnrollments)
    .where(
      sql`${workshopEnrollments.workshopId} = ${workshopId} AND
          ${workshopEnrollments.studentId} = ${studentId}`
    )
    .limit(1);

  if (existingEnrollment) {
    return { success: false, message: 'Estudante já matriculado' };
  }

  await db.insert(workshopEnrollments).values({
    workshopId,
    studentId,
  });

  return { success: true };
};

export const adminEnrollStudent = async (
  workshopId: string,
  data: IdentifierInput
): Promise<ResultState<IdentifierInput>> => {
  const hasAccess = await validateWorkshopAccess(workshopId, [
    'admin',
    'superadmin',
  ]);
  if (!hasAccess) redirect('/workshops');

  const validatedFields = IdentifierSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { identifier } = validatedFields.data;

  const student = await getStudentByIdentifier(identifier);
  if (!student) {
    return { success: false, message: 'Estudante não encontrado' };
  }

  try {
    const result = await enrollStudentInWorkshop(workshopId, student.id);
    if (!result.success) return result;
  } catch (error) {
    console.error('Erro ao adicionar estudante:', error);
    return { success: false, message: 'Erro ao adicionar estudante.' };
  }

  expirePath(`/workshops/${workshopId}`);
  redirect(`/workshops/${workshopId}?enrolled=true`);
};

export const selfEnrollStudent = async (
  workshop: Workshop,
  data: KeyInput
): Promise<ResultState<KeyInput>> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role !== 'user') redirect('/workshops');

  const validatedFields = KeySchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (workshop.key && workshop.key !== validatedFields.data.key) {
    return { success: false, message: 'Chave de acesso incorreta' };
  }

  const student = await getStudentByUserId(user.id);
  if (!student) {
    return { success: false, message: 'Estudante não encontrado' };
  }

  try {
    const result = await enrollStudentInWorkshop(workshop.id, student.id);
    if (!result.success) return result;
  } catch (error) {
    console.error('Erro ao realizar inscrição:', error);
    return { success: false, message: 'Erro ao realizar inscrição' };
  }

  expirePath(`/workshops/${workshop.id}`);
  redirect(`/workshops/${workshop.id}?enrolled=true`);
};
