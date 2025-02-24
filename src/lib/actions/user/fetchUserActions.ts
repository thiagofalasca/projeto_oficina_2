'use server';

import { db } from '@/db';
import { professors, students, users } from '@/db/schema';
import { ROLES, USERS_PER_PAGE } from '@/lib/constants';
import { and, count, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../auth/authActions';

const getUsersOrder = () => {
  return [
    sql`
      CASE
        WHEN ${users.role} = ${ROLES[2]} THEN 1
        WHEN ${users.role} = ${ROLES[1]} THEN 2
        WHEN ${users.role} = ${ROLES[0]} THEN 3
        ELSE 4
      END
    `,
    desc(users.createdAt),
  ];
};

const getUserConditions = (query: string, user: loggedUser) => {
  let condition = and(
    or(
      ilike(users.name, `%${query}%`),
      sql`${users.role}::text ILIKE ${'%' + query + '%'}`,
      ilike(users.email, `%${query}%`)
    ),
    ne(users.id, user.id)
  );

  if (user.role === 'admin') {
    condition = and(eq(users.role, 'user'), condition);
  }

  return condition;
};

export const fetchUsers = async (
  query: string,
  page: number
): Promise<User[]> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user') redirect('/workshops');
  const offset = (page - 1) * USERS_PER_PAGE;

  try {
    const baseQuery = db.select().from(users);
    const conditions = getUserConditions(query, user);

    return await baseQuery
      .limit(USERS_PER_PAGE)
      .offset(offset)
      .orderBy(...getUsersOrder())
      .where(conditions);
  } catch (error) {
    console.error('Erro ao buscar workshops:', error);
    throw new Error('Erro ao buscar workshops.');
  }
};

export const fetchUsersPages = async (query: string): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user') redirect('/workshops');

  try {
    const baseQuery = db.select({ count: count() }).from(users);
    const conditions = getUserConditions(query, user);

    const [result] = await baseQuery.where(conditions);
    return Math.ceil(result.count / USERS_PER_PAGE);
  } catch (error) {
    console.error(`Erro ao buscar páginas:`, error);
    throw new Error('Erro ao buscar páginas.');
  }
};

export const fetchUserById = async (
  id: string
): Promise<User | StudentUser | ProfessorUser> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    if (!result) throw new Error('Usuário não encontrado');

    if (user.role === 'user' && result.id !== user.id) redirect('/workshops');
    if (user.role === 'admin' && result.role !== 'user') redirect('/users');

    if (result.role === 'user') {
      const [studentData] = await db
        .select({
          ra: students.ra,
          courseId: students.courseId,
          currentPeriod: students.currentPeriod,
        })
        .from(students)
        .where(eq(students.userId, id));

      if (studentData) {
        return { ...result, ...studentData } as StudentUser;
      }
    }

    if (result.role === 'admin') {
      const [professorData] = await db
        .select({
          departmentId: professors.departmentId,
        })
        .from(professors)
        .where(eq(professors.userId, id));

      if (professorData) {
        return { ...result, ...professorData } as ProfessorUser;
      }
    }

    return result as User;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário.');
  }
};
