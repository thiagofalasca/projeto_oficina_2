'use server';

import { db } from '@/db';
import { students, users } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

const getBaseQuery = () => {
  return db
    .select({
      id: students.id,
      name: users.name,
      ra: students.ra,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .limit(1);
};

export const getStudentByUserId = async (
  userId: string
): Promise<Student | null> => {
  const [student] = await getBaseQuery().where(eq(students.userId, userId));

  return student ?? null;
};

export const getStudentByIdentifier = async (
  identifier: string
): Promise<Student | null> => {
  const [student] = await getBaseQuery().where(
    or(eq(students.ra, identifier), ilike(users.email, identifier))
  );

  return student ?? null;
};
