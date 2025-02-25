import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { deleteWorkshop } from '@/lib/actions/workshop/deleteWorkshopAtcion';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';

vi.mock('server-only', () => ({}));

vi.mock('@/db', () => ({
  db: {
    transaction: vi.fn((callback) =>
      callback({
        delete: vi.fn(() => ({})),
      })
    ),
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  expirePath: vi.fn(),
}));

describe('deleteWorkshop Action', () => {
  const workshopId = 'workshop1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deleta workshop com sucesso', async () => {
    vi.spyOn(db, 'transaction').mockResolvedValue(undefined);
    await deleteWorkshop(workshopId);
    expect(db.transaction).toHaveBeenCalled();
    expect(expirePath).toHaveBeenCalledWith('/workshops');
    expect(redirect).toHaveBeenCalledWith('/workshops?deleted=true');
  });

  it('redireciona com deleteError quando ocorre erro na transação', async () => {
    vi.spyOn(db, 'transaction').mockRejectedValue(new Error('Database error'));
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await deleteWorkshop(workshopId);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao deletar workshop:',
      expect.any(Error)
    );
    expect(expirePath).toHaveBeenCalledWith('/workshops');
    expect(redirect).toHaveBeenCalledWith('/workshops?deleted=true');

    consoleErrorSpy.mockRestore();
  });
});
