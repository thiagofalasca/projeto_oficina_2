'use server';

import { db } from '@/db';
import { workshops } from '@/db/schema';
import { formatDateToISO } from '@/lib/utils';
import { workshopInput, workshopSchema } from '@/validations/workshop';
import { eq } from 'drizzle-orm';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWorkshopAccess } from './validateWorkshopAccessAction';

export const updateWorkshop = async (
  id: string,
  data: workshopInput
): Promise<ResultState<workshopInput>> => {
  const hasAccess = await validateWorkshopAccess(id, ['admin', 'superadmin']);
  if (!hasAccess) redirect('/workshops');

  const validatedFields = workshopSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      validationErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const workshopData = validatedFields.data;

  try {
    await db
      .update(workshops)
      .set({
        title: workshopData.title,
        description: workshopData.description,
        professorId: workshopData.professorId,
        key: workshopData.key,
        startDate: formatDateToISO(workshopData.startDate),
        endDate: formatDateToISO(workshopData.endDate),
        status: workshopData.status,
      })
      .where(eq(workshops.id, id));
  } catch (error) {
    console.error('Erro ao atualizar workshop:', error);
    return { success: false, message: 'Erro ao atualizar workshop.' };
  }
  expirePath('/workshops');
  redirect('/workshops?updated=true');
};
