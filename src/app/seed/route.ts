import { courses, departmentsName, workshopStatus } from '@/lib/constants';
import {
  departments,
  professors,
  students,
  users,
  workshopEnrollments,
  workshops,
} from '@/db/schema';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import { db } from '@/db';
import { formatDateToISO } from '@/lib/utils';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import { PgTransaction } from 'drizzle-orm/pg-core';
import * as schema from '@/db/schema';

type Transaction = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

const SEED_COUNT = {
  DEPARTMENTS: departmentsName.length,
  PROFESSORS: 6,
  STUDENTS: 15,
  WORKSHOPS: 8,
  ENROLLMENTS_MIN: 5,
  ENROLLMENTS_MAX: 10,
};

const formatCPF = (cpf: string) =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

const formatPhone = (phone: string) =>
  phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

const formatCEP = (cep: string) => cep.replace(/(\d{5})(\d{3})/, '$1-$2');

const createUser = async (
  userData: Partial<typeof users.$inferInsert>,
  tx: Transaction
) => {
  const birthDate = faker.date.past();
  const formattedBirthDate = formatDateToISO(
    birthDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  );

  const [user] = await tx
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      hashedPassword: await hash('123456', 10),
      cpf: formatCPF(faker.string.numeric(11)),
      phoneNumber: formatPhone(faker.string.numeric(11)),
      birthDate: formattedBirthDate,
      postalCode: formatCEP(faker.string.numeric(8)),
      state: 'PR',
      address: faker.location.streetAddress(),
      ...userData,
    })
    .returning({ id: users.id });

  return user;
};

const seedDepartments = async (tx: Transaction) =>
  Promise.all(
    departmentsName.map(async (name) => {
      const [department] = await tx
        .insert(departments)
        .values({ name })
        .returning({ id: departments.id });
      return department.id;
    })
  );

const seedSuperAdmin = (tx: Transaction) =>
  createUser(
    { name: 'admin', email: 'admin@admin.com', role: 'superadmin' },
    tx
  );

const seedStudents = (count: number, tx: Transaction) =>
  Promise.all(
    Array.from({ length: count }, async () => {
      const user = await createUser({ role: 'user' }, tx);
      const [student] = await tx
        .insert(students)
        .values({
          userId: user.id,
          ra: faker.string.numeric(7),
          courseId: faker.helpers.arrayElement(courses).id,
          currentPeriod: faker.number.int({ min: 1, max: 10 }),
        })
        .returning({ id: students.id });
      return student.id;
    })
  );

const seedProfessors = (
  count: number,
  departmentIds: string[],
  tx: Transaction
) =>
  Promise.all(
    Array.from({ length: count }, async () => {
      const user = await createUser({ role: 'admin' }, tx);
      const [professor] = await tx
        .insert(professors)
        .values({
          userId: user.id,
          departmentId: faker.helpers.arrayElement(departmentIds),
        })
        .returning({ id: professors.id });
      return professor.id;
    })
  );

const seedWorkshops = async (
  count: number,
  professorIds: string[],
  tx: Transaction
) =>
  Promise.all(
    Array.from({ length: count }, async () => {
      const startDate = formatDateToISO(
        faker.date.future().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );

      const endDate = formatDateToISO(
        faker.date.future().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );

      const [workshop] = await tx
        .insert(workshops)
        .values({
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(),
          professorId: faker.helpers.arrayElement(professorIds),
          key: faker.string.alphanumeric(6).toUpperCase(),
          startDate,
          endDate,
          status: faker.helpers.arrayElement(workshopStatus),
        })
        .returning({ id: workshops.id });

      return workshop.id;
    })
  );

const seedEnrollments = async (
  workshopIds: string[],
  studentIds: string[],
  tx: Transaction
) => {
  const shuffledStudents = faker.helpers.shuffle(studentIds);

  const enrollments = workshopIds.flatMap((workshopId) => {
    const randomCount = faker.number.int({
      min: SEED_COUNT.ENROLLMENTS_MIN,
      max: SEED_COUNT.ENROLLMENTS_MAX,
    });
    const selectedStudents = shuffledStudents.slice(0, randomCount);

    return selectedStudents.map((studentId) => ({
      workshopId,
      studentId,
    }));
  });

  return tx.insert(workshopEnrollments).values(enrollments);
};

export async function GET() {
  try {
    await db.transaction(async (tx) => {
      const departmentIds = await seedDepartments(tx);
      await seedSuperAdmin(tx);
      const professorIds = await seedProfessors(
        SEED_COUNT.PROFESSORS,
        departmentIds,
        tx
      );
      const studentIds = await seedStudents(SEED_COUNT.STUDENTS, tx);
      const workshopIds = await seedWorkshops(
        SEED_COUNT.WORKSHOPS,
        professorIds,
        tx
      );
      await seedEnrollments(workshopIds, studentIds, tx);
    });
    return Response.json({ message: 'Seed concluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    return Response.json({ error: 'Erro ao executar seed.' }, { status: 500 });
  }
}
