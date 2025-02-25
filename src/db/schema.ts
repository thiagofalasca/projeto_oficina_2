import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  AnyPgColumn,
  uniqueIndex,
  date,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations, sql, SQL } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';
import { ROLES, workshopStatus } from '@/lib/constants';

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

const id = text('id')
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());
const createdAt = timestamp('created_at').notNull().defaultNow();
const updatedAt = timestamp('updated_at')
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const role_enum = pgEnum('role', ROLES);

export const workshop_status_enum = pgEnum('workshop_status', workshopStatus);

export const users = pgTable(
  'users',
  {
    id,
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    hashedPassword: text('password').notNull(),
    cpf: text('cpf').notNull().unique(),
    phoneNumber: text('phone').notNull(),
    birthDate: date('birth_date').notNull(),
    postalCode: text('postal_code').notNull(),
    state: text('state').notNull(),
    address: text('address').notNull(),
    role: role_enum('role').notNull().default('user'),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('emailUniqueIndex').on(lower(table.email))]
);

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier')
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  ]
);

export const PasswordResetTokens = pgTable(
  'passwordResetToken',
  {
    identifier: text('identifier')
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (passwordResetToken) => [
    primaryKey({
      columns: [passwordResetToken.email, passwordResetToken.token],
    }),
  ]
);

export const departments = pgTable('departments', {
  id,
  name: text('name').notNull(),
  createdAt,
});

export const professors = pgTable('professors', {
  id,
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  departmentId: text('department_id')
    .notNull()
    .references(() => departments.id, {
      onDelete: 'cascade',
      onUpdate: 'restrict',
    }),
  createdAt,
});

export const students = pgTable('students', {
  id,
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ra: text('ra').notNull().unique(),
  courseId: text('course_id').notNull(),
  currentPeriod: integer('current_period').notNull(),
  createdAt,
});

export const workshops = pgTable('workshops', {
  id,
  title: text('title').notNull(),
  description: text('description'),
  professorId: text('professor_id')
    .notNull()
    .references(() => professors.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  key: text('key'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: workshop_status_enum('status').notNull(),
  createdAt,
  updatedAt,
});

export const workshopEnrollments = pgTable(
  'workshop_enrollments',
  {
    id,
    workshopId: text('workshop_id')
      .notNull()
      .references(() => workshops.id, { onDelete: 'cascade' }),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('workshop_student_unique').on(
      table.workshopId,
      table.studentId
    ),
  ]
);

export const certificates = pgTable('certificates', {
  id,
  workshopEnrollmentId: text('workshop_enrollment_id')
    .notNull()
    .unique()
    .references(() => workshopEnrollments.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  certificateNumber: text('certificate_number').notNull().unique(),
  issuedDate: date('issued_date').notNull(),
  signedBy: text('signed_by')
    .notNull()
    .references(() => professors.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const usersRelations = relations(users, ({ one }) => ({
  professor: one(professors, {
    fields: [users.id],
    references: [professors.userId],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
}));

export const professorsRelations = relations(professors, ({ one, many }) => ({
  user: one(users, {
    fields: [professors.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [professors.departmentId],
    references: [departments.id],
  }),
  workshops: many(workshops),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  workshopEnrollments: many(workshopEnrollments),
}));

export const workshopsRelations = relations(workshops, ({ one, many }) => ({
  professor: one(professors, {
    fields: [workshops.professorId],
    references: [professors.id],
  }),
  enrollments: many(workshopEnrollments),
}));

export const workshopEnrollmentsRelations = relations(
  workshopEnrollments,
  ({ one }) => ({
    student: one(students, {
      fields: [workshopEnrollments.studentId],
      references: [students.id],
    }),
    workshop: one(workshops, {
      fields: [workshopEnrollments.workshopId],
      references: [workshops.id],
    }),
    certificate: one(certificates, {
      fields: [workshopEnrollments.id],
      references: [certificates.workshopEnrollmentId],
    }),
  })
);

export const certificatesRelations = relations(certificates, ({ one }) => ({
  workshopEnrollment: one(workshopEnrollments, {
    fields: [certificates.workshopEnrollmentId],
    references: [workshopEnrollments.id],
  }),
  signedBy: one(professors, {
    fields: [certificates.signedBy],
    references: [professors.id],
  }),
}));
