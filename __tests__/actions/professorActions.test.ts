import { describe, it, expect, vi } from 'vitest';
import { db } from '@/db';
import { fetchProfessorOptions } from '@/actions/professorActions';
import { redirect } from 'next/navigation';

vi.mock('server-only', () => ({}));

vi.mock('@/actions/auth/authActions', () => ({
  getCurrentUser: vi.fn(async () => ({ role: 'admin' })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Professor Actions', () => {
  describe('fetchProfessorOptions', () => {
    it('retorna opções ordenadas de professores', async () => {
      const findManyMock = vi.fn().mockResolvedValue([
        { id: '2', user: { name: 'Professor 2' } },
        { id: '1', user: { name: 'Professor 1' } },
      ]);
      db.query.professors.findMany = findManyMock;

      const options = await fetchProfessorOptions();

      expect(options).toEqual([
        { value: '1', label: 'Professor 1' },
        { value: '2', label: 'Professor 2' },
      ]);
    });

    it('lança erro quando a consulta falha', async () => {
      db.query.professors.findMany = vi
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(fetchProfessorOptions()).rejects.toThrow(
        'Erro ao buscar professores'
      );
    });
  });
});
