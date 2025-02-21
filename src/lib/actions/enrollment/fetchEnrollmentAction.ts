'use server';

import { db } from '@/db';
import { students, users, workshopEnrollments } from '@/db/schema';
import { ENROLLMENTS_PER_PAGE } from '@/lib/constants';
import { count, eq } from 'drizzle-orm';
import { getCurrentUser } from '../auth/authActions';
import { redirect } from 'next/navigation';

export const fetchEnrollments = async (
  workshopId: string,
  page: number
): Promise<Enrollment[]> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  const offset = (page - 1) * ENROLLMENTS_PER_PAGE;

  try {
    return await db
      .select({
        id: students.id,
        name: users.name,
        email: users.email,
        ra: students.ra,
      })
      .from(workshopEnrollments)
      .innerJoin(students, eq(workshopEnrollments.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(workshopEnrollments.workshopId, workshopId))
      .orderBy(users.name)
      .limit(ENROLLMENTS_PER_PAGE)
      .offset(offset);
  } catch (error) {
    console.error('Erro ao buscar matrículas:', error);
    throw new Error('Erro ao buscar matrículas');
  }
};

export const fetchEnrollmentPages = async (
  workshopId: string
): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    const result = await db
      .select({ count: count() })
      .from(workshopEnrollments)
      .where(eq(workshopEnrollments.workshopId, workshopId));

    return Math.ceil(result.length / ENROLLMENTS_PER_PAGE);
  } catch (error) {
    console.error('Erro ao buscar páginas de matrículas:', error);
    throw new Error('Erro ao buscar páginas de matrículas');
  }
};
