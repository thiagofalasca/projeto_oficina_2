import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWorkshop } from '@/lib/actions/workshop/createWorkshopAction';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';
import { workshopStatus } from '@/lib/constants';
import { getCurrentUser } from '@/lib/actions/auth/authActions';

vi.mock('server-only', () => ({}));

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({})),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({})),
      })),
    })),
  },
}));

vi.mock('@/actions/auth/authActions', () => ({
  getCurrentUser: vi.fn(async () => ({ role: 'admin' })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  expirePath: vi.fn(),
}));

describe('createWorkshop Action', () => {
  const validWorkshopData = {
    professorId: 'prof-123',
    title: 'Workshop Teste',
    description: 'Descrição do workshop',
    startDate: '01/01/2022',
    endDate: '02/01/2022',
    status: workshopStatus[0],
    key: '123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar workshop com sucesso', async () => {
    vi.spyOn(db, 'insert').mockReturnValue({
      values: () => Promise.resolve(),
    } as any);

    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([{ id: 'prof-123' }]),
      }),
    } as any);

    await createWorkshop(validWorkshopData);

    expect(db.insert).toHaveBeenCalled();
    expect(expirePath).toHaveBeenCalledWith('/workshops');
    expect(redirect).toHaveBeenCalledWith('/workshops?created=true');
  });

  it('deve retornar erros de validação quando dados inválidos', async () => {
    const invalidData = {
      description: 'Falta title',
      professorId: 'prof-123',
      key: 'key-invalida',
    };

    const result = await createWorkshop(invalidData as any);
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('validationErrors');
  });

  it('deve tratar erro ao inserir workshop', async () => {
    vi.spyOn(db, 'insert').mockReturnValue({
      values: () => Promise.reject(new Error('DB Error')),
    } as any);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await createWorkshop(validWorkshopData);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao criar workshop:',
      expect.any(Error)
    );
    expect(expirePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: 'Erro ao criar workshop.',
    });

    consoleErrorSpy.mockRestore();
  });
});
