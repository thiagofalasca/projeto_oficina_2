import { redirect } from 'next/navigation';
import { getCurrentUser } from '../auth/authActions';
import {
  certificates,
  workshopEnrollments,
  students,
  workshops,
  professors,
  users,
} from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const fetchCertificates = async (): Promise<Certificate[]> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    const certificateList = await db
      .select({
        id: certificates.id,
        enrollmentId: certificates.workshopEnrollmentId,
        certificateNumber: certificates.certificateNumber,
        issuedDate: certificates.issuedDate,
        workshopName: workshops.title,
        startDate: workshops.startDate,
        endDate: workshops.endDate,
        signedBy: {
          name: users.name,
          id: users.id,
        },
      })
      .from(certificates)
      .innerJoin(
        workshopEnrollments,
        eq(certificates.workshopEnrollmentId, workshopEnrollments.id)
      )
      .innerJoin(workshops, eq(workshopEnrollments.workshopId, workshops.id))
      .innerJoin(students, eq(workshopEnrollments.studentId, students.id))
      .innerJoin(professors, eq(certificates.signedBy, professors.id))
      .innerJoin(users, eq(professors.userId, users.id))
      .where(eq(students.userId, user.id));

    return certificateList;
  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
    throw new Error('Erro ao buscar certificados');
  }
};
