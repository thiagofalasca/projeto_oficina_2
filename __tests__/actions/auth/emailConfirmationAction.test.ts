import { db } from '@/db';
import { emailConfirmation } from '@/lib/actions/auth/emailConfirmationAction';
import { getVerificationTokenByToken } from '@/lib/actions/tokenAction';
import { getUserByEmail } from '@/lib/actions/userActions';
import { expiredToken, validToken } from '@/tests/mocks/mocked-data';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/db', () => ({
  db: {
    transaction: vi.fn(() => ({
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/lib/actions/tokenAction', () => ({
  getVerificationTokenByToken: vi.fn(),
}));

vi.mock('@/lib/actions/userActions', () => ({
  getUserByEmail: vi.fn(),
}));

describe('Email Confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro quando token não existe', async () => {
    vi.mocked(getVerificationTokenByToken).mockResolvedValue(null);

    const result = await emailConfirmation('invalid-token');
    expect(result).toEqual({
      success: false,
      message: 'Token não encontrado!',
    });
  });

  it('deve retornar erro quando token está expirado', async () => {
    vi.mocked(getVerificationTokenByToken).mockResolvedValue(expiredToken);
    const result = await emailConfirmation('valid-token');
    expect(result).toEqual({ success: false, message: 'Token expirado!' });
  });

  it('deve retornar erro quando email não existe', async () => {
    vi.mocked(getVerificationTokenByToken).mockResolvedValue(validToken);
    vi.mocked(getUserByEmail).mockResolvedValue(null);

    const result = await emailConfirmation('valid-token');
    expect(result).toEqual({
      success: false,
      message: 'Email não encontrado!',
    });
  });

  it('deve confirmar email com sucesso', async () => {
    vi.mocked(getVerificationTokenByToken).mockResolvedValue(validToken);
    vi.mocked(getUserByEmail).mockResolvedValue('valid-user' as any);

    const result = await emailConfirmation('valid-token');
    expect(result).toEqual({ success: true });
    expect(db.transaction).toHaveBeenCalled();
  });

  it('deve retornar erro quando falhar ao atualizar', async () => {
    vi.mocked(getVerificationTokenByToken).mockResolvedValue(validToken);
    vi.mocked(getUserByEmail).mockResolvedValue('valid-user' as any);
    vi.spyOn(db, 'transaction').mockImplementation(() => {
      throw new Error('DB Error');
    });

    const result = await emailConfirmation('valid-token');
    expect(result).toEqual({
      success: false,
      message: 'Erro ao verificar email',
    });
  });
});
