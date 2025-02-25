'use server';

import { db } from '@/db';
import {
  professors,
  students,
  users,
  workshopEnrollments,
  workshops,
} from '@/db/schema';
import { WORKSHOPS_PER_PAGE, workshopStatus } from '@/lib/constants';
import { and, count, desc, eq, ilike, notExists, or, sql } from 'drizzle-orm';
import { getCurrentUser } from '../auth/authActions';
import { redirect } from 'next/navigation';
import { validateWorkshopAccess } from './validateWorkshopAccessAction';

const getWorkshopsOrder = () => {
  return [
    sql`
      CASE
        WHEN ${workshops.status} = ${workshopStatus[0]} THEN 1
        WHEN ${workshops.status} = ${workshopStatus[1]} THEN 2
        WHEN ${workshops.status} = ${workshopStatus[2]} THEN 3
        WHEN ${workshops.status} = ${workshopStatus[3]} THEN 4
        ELSE 5
      END
    `,
    desc(workshops.createdAt),
  ];
};

const getEnrollmentCheckQuery = (userId: string) => {
  return db
    .select()
    .from(workshopEnrollments)
    .innerJoin(students, eq(workshopEnrollments.studentId, students.id))
    .where(
      and(
        eq(workshopEnrollments.workshopId, workshops.id),
        eq(students.userId, userId)
      )
    );
};

const getWorkshopQuery = () => {
  return db
    .select({
      id: workshops.id,
      title: workshops.title,
      description: workshops.description,
      startDate: workshops.startDate,
      endDate: workshops.endDate,
      status: workshops.status,
      key: workshops.key,
      professor: {
        id: professors.id,
        name: users.name,
        email: users.email,
      },
      enrollmentsCount:
        sql<number>`(SELECT COUNT(*) FROM ${workshopEnrollments} we WHERE we.workshop_id = ${workshops.id})`.mapWith(
          Number
        ),
    })
    .from(workshops)
    .innerJoin(professors, eq(workshops.professorId, professors.id))
    .innerJoin(users, eq(professors.userId, users.id))
    .groupBy(workshops.id, professors.id, users.name, users.email);
};

const getWorkshopPagesQuery = () => {
  return db
    .select({ count: count() })
    .from(workshops)
    .innerJoin(professors, eq(workshops.professorId, professors.id))
    .innerJoin(users, eq(professors.userId, users.id));
};

const getWorkshopConditions = (query: string, user: loggedUser) => {
  let condition = or(
    ilike(workshops.title, `%${query}%`),
    sql`${workshops.status}::text ILIKE ${'%' + query + '%'}`,
    ilike(users.name, `%${query}%`)
  );

  if (user.role === 'admin') {
    condition = and(eq(users.id, user.id), condition);
  } else if (user.role === 'user') {
    condition = and(eq(students.userId, user.id), condition);
  }

  return condition;
};

export const fetchWorkshops = async (
  query: string,
  page: number
): Promise<Workshop[]> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  const offset = (page - 1) * WORKSHOPS_PER_PAGE;

  try {
    const baseQuery = getWorkshopQuery();

    if (user.role === 'user') {
      baseQuery
        .leftJoin(
          workshopEnrollments,
          eq(workshops.id, workshopEnrollments.workshopId)
        )
        .innerJoin(students, eq(workshopEnrollments.studentId, students.id));
    }

    const conditions = getWorkshopConditions(query, user);

    return await baseQuery
      .limit(WORKSHOPS_PER_PAGE)
      .offset(offset)
      .orderBy(...getWorkshopsOrder())
      .where(conditions);
  } catch (error) {
    console.error('Erro ao buscar workshops:', error);
    throw new Error('Erro ao buscar workshops.');
  }
};

export const fetchWorkshopsPages = async (query: string): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    const baseQuery = getWorkshopPagesQuery();

    if (user.role === 'user') {
      baseQuery
        .leftJoin(
          workshopEnrollments,
          eq(workshops.id, workshopEnrollments.workshopId)
        )
        .innerJoin(students, eq(workshopEnrollments.studentId, students.id));
    }

    const conditions = getWorkshopConditions(query, user);

    const [result] = await baseQuery.where(conditions);
    return Math.ceil(result.count / WORKSHOPS_PER_PAGE);
  } catch (error) {
    console.error(`Erro ao buscar páginas:`, error);
    throw new Error('Erro ao buscar páginas.');
  }
};

export const fetchAvailableWorkshops = async (
  query: string,
  page: number
): Promise<Workshop[]> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  const offset = (page - 1) * WORKSHOPS_PER_PAGE;

  try {
    const enrollmentCheckQuery = getEnrollmentCheckQuery(user.id);

    return await getWorkshopQuery()
      .limit(WORKSHOPS_PER_PAGE)
      .offset(offset)
      .where(
        and(
          eq(workshops.status, workshopStatus[0]),
          ilike(workshops.title, `%${query}%`),
          ilike(users.name, `%${query}%`),
          notExists(enrollmentCheckQuery)
        )
      )
      .orderBy(desc(workshops.createdAt));
  } catch (error) {
    console.error('Erro ao buscar workshops:', error);
    throw new Error('Erro ao buscar workshops.');
  }
};

export const fetchAvailableWorkshopsPages = async (
  query: string
): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  try {
    const enrollmentCheckQuery = getEnrollmentCheckQuery(user.id);

    const [result] = await getWorkshopPagesQuery().where(
      and(
        eq(workshops.status, workshopStatus[0]),
        ilike(workshops.title, `%${query}%`),
        ilike(users.name, `%${query}%`),
        notExists(enrollmentCheckQuery)
      )
    );

    return Math.ceil(result.count / WORKSHOPS_PER_PAGE);
  } catch (error) {
    console.error('Erro ao buscar total de páginas:', error);
    throw new Error('Erro ao buscar total de páginas');
  }
};

export const fetchWorkshopById = async (
  id: string
): Promise<Workshop | null> => {
  let result: Workshop | null = null;
  try {
    [result] = await getWorkshopQuery().where(eq(workshops.id, id));
    if (!result) return null;
  } catch (error) {
    console.error('Erro ao buscar workshop:', error);
    throw new Error('Erro ao buscar workshop.');
  }

  const hasAccess = await validateWorkshopAccess(result.id);
  if (!hasAccess) redirect('/workshops');

  return result;
};
