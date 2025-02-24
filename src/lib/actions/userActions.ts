'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { departments, lower, professors, students, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatDateToISO } from '../utils';
import { adminInput, superAdminInput, userInput } from '../validations/user';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(lower(users.email), email.toLowerCase()),
    });
    return user ?? null;
  } catch (error) {
    console.error(`Erro ao buscar usuário por email: ${email}`, error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    return user ?? null;
  } catch (error) {
    console.error(`Erro ao buscar usuário por ID: ${id}`, error);
    return null;
  }
};

export const validateUser = async (
  email: string,
  cpf: string,
  ra?: string
): Promise<MessageState> => {
  try {
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return { success: false, message: 'Email já cadastrado' };
    }

    const existingCPF = await db.query.users.findFirst({
      where: eq(users.cpf, cpf),
    });
    if (existingCPF) {
      return { success: false, message: 'CPF já cadastrado' };
    }

    if (ra) {
      const existingRA = await db.query.students.findFirst({
        where: eq(students.ra, ra),
      });
      if (existingRA) {
        return { success: false, message: 'RA já cadastrado' };
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Erro ao validar usuário', error);
    return { success: false, message: 'Erro ao validar usuário' };
  }
};

export const insertUser = async (
  userData: userInput
): Promise<MessageState> => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
          hashedPassword,
          cpf: userData.cpf,
          phoneNumber: userData.phoneNumber,
          birthDate: formatDateToISO(userData.birthDate),
          postalCode: userData.postalCode,
          state: userData.state,
          address: userData.address,
        })
        .returning({ id: users.id })
        .then((result) => result[0]);

      await tx.insert(students).values({
        userId: newUser.id,
        ra: userData.ra,
        courseId: userData.course,
        currentPeriod: Number(userData.period),
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { success: false, message: 'Erro ao criar usuário' };
  }
};

export const insertAdmin = async (
  userData: adminInput
): Promise<MessageState> => {
  const departmentId = await db.query.departments.findFirst({
    columns: {
      id: true,
    },
    where: eq(departments.name, userData.department),
  });
  if (!departmentId) {
    return { success: false, message: 'Departamento não encontrado.' };
  }

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
          hashedPassword,
          cpf: userData.cpf,
          phoneNumber: userData.phoneNumber,
          birthDate: formatDateToISO(userData.birthDate),
          postalCode: userData.postalCode,
          state: userData.state,
          address: userData.address,
          role: 'admin',
        })
        .returning({ id: users.id })
        .then((result) => result[0]);

      await tx.insert(professors).values({
        userId: newUser.id,
        departmentId: departmentId.id,
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    return { success: false, message: 'Erro ao criar administrador' };
  }
};

export const insertSuperAdmin = async (
  userData: superAdminInput
): Promise<MessageState> => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.insert(users).values({
      name: userData.name,
      email: userData.email,
      hashedPassword,
      cpf: userData.cpf,
      phoneNumber: userData.phoneNumber,
      birthDate: formatDateToISO(userData.birthDate),
      postalCode: userData.postalCode,
      state: userData.state,
      address: userData.address,
      role: 'superadmin',
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar super administrador:', error);
    return { success: false, message: 'Erro ao criar super administrador' };
  }
};

export const updateUserData = async (
  id: string,
  userData: userInput
): Promise<MessageState> => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          name: userData.name,
          email: userData.email,
          hashedPassword,
          cpf: userData.cpf,
          phoneNumber: userData.phoneNumber,
          birthDate: formatDateToISO(userData.birthDate),
          postalCode: userData.postalCode,
          state: userData.state,
          address: userData.address,
        })
        .where(eq(users.id, id));

      await tx
        .update(students)
        .set({
          ra: userData.ra,
          courseId: userData.course,
          currentPeriod: Number(userData.period),
        })
        .where(eq(students.userId, id));
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    return { success: false, message: 'Erro ao editar usuário' };
  }
};

export const updateAdminData = async (
  id: string,
  userData: adminInput
): Promise<MessageState> => {
  const departmentId = await db.query.departments.findFirst({
    columns: {
      id: true,
    },
    where: eq(departments.name, userData.department),
  });
  if (!departmentId) {
    return { success: false, message: 'Departamento não encontrado.' };
  }

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          name: userData.name,
          email: userData.email,
          hashedPassword,
          cpf: userData.cpf,
          phoneNumber: userData.phoneNumber,
          birthDate: formatDateToISO(userData.birthDate),
          postalCode: userData.postalCode,
          state: userData.state,
          address: userData.address,
          role: 'admin',
        })
        .where(eq(users.id, id));

      await tx
        .update(professors)
        .set({
          departmentId: departmentId.id,
        })
        .where(eq(professors.userId, id));
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao editar administrador:', error);
    return { success: false, message: 'Erro ao editar administrador' };
  }
};

export const updateSuperAdminData = async (
  id: string,
  userData: superAdminInput
): Promise<MessageState> => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await db
      .update(users)
      .set({
        name: userData.name,
        email: userData.email,
        hashedPassword,
        cpf: userData.cpf,
        phoneNumber: userData.phoneNumber,
        birthDate: formatDateToISO(userData.birthDate),
        postalCode: userData.postalCode,
        state: userData.state,
        address: userData.address,
        role: 'superadmin',
      })
      .where(eq(users.id, id));

    return { success: true };
  } catch (error) {
    console.error('Erro ao editar super administrador:', error);
    return { success: false, message: 'Erro ao editar super administrador' };
  }
};
