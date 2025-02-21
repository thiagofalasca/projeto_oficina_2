'use server';

import { db } from '@/db';
import {
  professors,
  students,
  workshopEnrollments,
  workshops,
} from '@/db/schema';
import { and, count, eq } from 'drizzle-orm';
import { getCurrentUser } from '../auth/authActions';
import { redirect } from 'next/navigation';
import { Role, ROLES } from '@/lib/constants';

export const validateWorkshopAccess = async (
  workshopId: string,
  allowedRoles: Role[] = Object.values(ROLES)
): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    if (!allowedRoles.includes(user.role)) {
      return false;
    }

    if (user.role === 'superadmin') return true;

    if (user.role === 'admin') {
      const [owner] = await db
        .select({ id: professors.userId })
        .from(workshops)
        .innerJoin(professors, eq(workshops.professorId, professors.id))
        .where(eq(workshops.id, workshopId));
      return owner.id === user.id;
    }

    const [isEnrolled] = await db
      .select({ count: count() })
      .from(workshopEnrollments)
      .innerJoin(students, eq(workshopEnrollments.studentId, students.id))
      .where(
        and(
          eq(workshopEnrollments.workshopId, workshopId),
          eq(students.userId, user.id)
        )
      );

    return isEnrolled.count > 0;
  } catch (error) {
    console.error('Erro ao validar acesso ao workshop:', error);
    return false;
  }
};
