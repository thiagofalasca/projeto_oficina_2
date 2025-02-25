'use server';

import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';
import { validateWorkshopAccess } from './validateWorkshopAccessAction';
import { workshops, workshopEnrollments, certificates } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { formatDateToISO } from '@/lib/utils';

export const finishWorkshop = async (id: string): Promise<void> => {
  const hasAccess = await validateWorkshopAccess(id, ['admin', 'superadmin']);
  if (!hasAccess) redirect('/workshops');
  try {
    await db.transaction(async (tx) => {
      const workshopRecord = await tx
        .select({ title: workshops.title, professorId: workshops.professorId })
        .from(workshops)
        .where(eq(workshops.id, id))
        .then((res) => res[0]);
      if (!workshopRecord) throw new Error('Workshop não encontrado');

      await tx
        .update(workshops)
        .set({ status: 'Completo', updatedAt: new Date() })
        .where(eq(workshops.id, id));

      const enrollments = await tx
        .select()
        .from(workshopEnrollments)
        .where(eq(workshopEnrollments.workshopId, id));

      const now = new Date();
      for (const enrollment of enrollments) {
        const certificateNumber = uuidv4();
        await tx.insert(certificates).values({
          workshopEnrollmentId: enrollment.id,
          certificateNumber,
          issuedDate: formatDateToISO(
            now.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          ),
          signedBy: workshopRecord.professorId,
        });
      }
    });
  } catch (error) {
    console.error('Erro ao finalizar workshop:', error);
    redirect(`/workshops/${id}?finishError=true`);
  }
  expirePath('/workshops');
  redirect('/workshops?finished=true');
};
