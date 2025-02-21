'use server';

import { db } from '@/db';
import { getCurrentUser } from '@/actions/auth/authActions';
import { eq } from 'drizzle-orm';
import { professors } from '@/db/schema';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const fetchProfessorOptions = cache(
  async (): Promise<ProfessorOption[]> => {
    const user = await getCurrentUser();
    if (!user) redirect('/api/auth/sign-out');
    if (user.role === 'user') redirect('/workshops');

    try {
      const results = await db.query.professors.findMany({
        columns: { id: true },
        with: { user: { columns: { name: true } } },
      });

      return results
        .map((professor) => ({
          value: professor.id,
          label: professor.user.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      throw new Error('Erro ao buscar professores');
    }
  }
);

export const getCurrentProfessor = cache(async (): Promise<string | null> => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user' || user.role === 'superadmin')
    redirect('/workshops');

  try {
    const professor = await db.query.professors.findFirst({
      columns: { id: true },
      where: eq(professors.userId, user.id),
    });

    return professor?.id ?? null;
  } catch (error) {
    console.error('Erro ao buscar professor por userId:', error);
    throw new Error('Erro ao buscar professor por userId');
  }
});
