'use server';

import { workshopInput, workshopSchema } from '@/validations/workshop';
import { getCurrentUser } from '../auth/authActions';
import { formatDateToISO } from '@/lib/utils';
import { db } from '@/db';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { professors, workshops } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const createWorkshop = async (
  data: workshopInput
): Promise<ResultState<workshopInput>> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user') redirect('/workshops');

  if (user.role === 'admin') {
    const [professor] = await db
      .select({ id: professors.id })
      .from(professors)
      .where(eq(professors.userId, user.id));
    if (data.professorId !== professor.id) redirect('/workshops');
  }

  const validatedFields = workshopSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const workshopData = validatedFields.data;

  try {
    await db.insert(workshops).values({
      title: workshopData.title,
      description: workshopData.description,
      professorId: workshopData.professorId,
      key: workshopData.key,
      startDate: formatDateToISO(workshopData.startDate),
      endDate: formatDateToISO(workshopData.endDate),
      status: workshopData.status,
    });
  } catch (error) {
    console.error('Erro ao criar workshop:', error);
    return { success: false, message: 'Erro ao criar workshop.' };
  }
  expirePath('/workshops');
  redirect('/workshops?created=true');
};
