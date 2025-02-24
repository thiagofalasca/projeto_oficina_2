'use server';

import { db } from '@/db';
import {
  professors,
  students,
  users,
  workshopEnrollments,
  workshops,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';

import { getCurrentUser } from '../auth/authActions';
import { validateUserAccess } from './validateUserAccessAction';

export const deleteUser = async (id: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  if (id === user.id) {
    console.error('Você não pode deletar a si mesmo');
    redirect('/users?cannotDeleteYourselfError=true');
  }

  const hasAccess = await validateUserAccess(id, ['admin', 'superadmin']);
  if (!hasAccess) redirect('/workshops');

  const userToDelete = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { role: true },
  });

  if (!userToDelete) {
    console.error('Usuário não encontrado');
    redirect('/users');
  }

  if (userToDelete.role === 'admin') {
    const professor = await db.query.professors.findFirst({
      where: eq(professors.userId, id),
      columns: { id: true },
    });

    if (professor) {
      const hasWorkshops = await db.query.workshops.findFirst({
        where: eq(workshops.professorId, professor.id),
        columns: { id: true },
      });

      if (hasWorkshops) {
        console.error('Professor possui workshops e não pode ser excluído');
        redirect('/users?professorHasWorkshopsError=true');
      }
    }
  }

  if (userToDelete.role === 'user') {
    const student = await db.query.students.findFirst({
      where: eq(students.userId, id),
      columns: { id: true },
    });

    if (student) {
      const hasEnrollments = await db.query.workshopEnrollments.findFirst({
        where: eq(workshopEnrollments.studentId, student.id),
        columns: { id: true },
      });

      if (hasEnrollments) {
        console.error(
          'Usuário está inscrito em workshops e não pode ser excluído'
        );
        redirect('/users?userHasEnrollments=true');
      }
    }
  }

  try {
    await db.transaction(async (tx) => {
      if (userToDelete.role === 'admin') {
        await tx.delete(professors).where(eq(professors.userId, id));
      } else if (userToDelete.role === 'user') {
        await tx.delete(students).where(eq(students.userId, id));
      }

      await tx.delete(users).where(eq(users.id, id));
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    redirect('/users?deleteError=true');
  }

  expirePath('/users');
  redirect('/users');
};
