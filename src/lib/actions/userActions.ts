'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { lower, students, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatDateToISO } from '../utils';
import { signUpInput } from '../validations/auth';

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
  ra: string
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

    const existingRA = await db.query.students.findFirst({
      where: eq(students.ra, ra),
    });
    if (existingRA) {
      return { success: false, message: 'RA já cadastrado' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao validar usuário', error);
    return { success: false, message: 'Erro ao validar usuário' };
  }
};

export const createUser = async (
  userData: signUpInput
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
