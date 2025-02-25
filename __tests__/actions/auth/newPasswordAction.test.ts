import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { getPasswordResetTokenByToken } from '@/lib/actions/tokenAction';
import { getUserByEmail } from '@/lib/actions/userActions';
import { newPasswordAction } from '@/lib/actions/auth/newPasswordAction';
import {
  expiredToken,
  validPasswordData,
  validToken,
} from '@/tests/mocks/mocked-data';

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
  getPasswordResetTokenByToken: vi.fn(),
}));

vi.mock('@/lib/actions/userActions', () => ({
  getUserByEmail: vi.fn(),
}));

describe('New Password Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro quando não há token', async () => {
    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: null,
    });
    expect(result).toEqual({ success: false, message: 'Faltando token' });
  });

  it('deve retornar erro de validação quando senhas não correspondem', async () => {
    const result = await newPasswordAction({
      passwordData: {
        password: 'ValidPass123!',
        confirmPassword: 'DifferentPass123!',
      },
      token: 'valid-token',
    });
    expect(result.success).toBe(false);
    expect(result.validationErrors).toBeDefined();
  });

  it('deve retornar erro quando token é inválido', async () => {
    vi.mocked(getPasswordResetTokenByToken).mockResolvedValueOnce(null);

    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: 'invalid-token',
    });
    expect(result).toEqual({ success: false, message: 'Token inválido' });
  });

  it('deve retornar erro quando token está expirado', async () => {
    vi.mocked(getPasswordResetTokenByToken).mockResolvedValueOnce(expiredToken);

    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: 'expired-token',
    });
    expect(result).toEqual({ success: false, message: 'Token expirado!' });
  });

  it('deve retornar erro quando email não existe', async () => {
    vi.mocked(getPasswordResetTokenByToken).mockResolvedValueOnce(validToken);
    vi.mocked(getUserByEmail).mockResolvedValueOnce(null);

    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: 'valid-token',
    });
    expect(result).toEqual({
      success: false,
      message: 'Email não encontrado!',
    });
  });

  it('deve redefinir senha com sucesso', async () => {
    vi.mocked(getPasswordResetTokenByToken).mockResolvedValueOnce(validToken);
    vi.mocked(getUserByEmail).mockResolvedValueOnce('valid-user' as any);

    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: 'valid-token',
    });
    expect(result).toEqual({ success: true });
    expect(db.transaction).toHaveBeenCalled();
  });

  it('deve retornar erro quando falhar ao atualizar', async () => {
    vi.mocked(getPasswordResetTokenByToken).mockResolvedValueOnce(validToken);
    vi.mocked(getUserByEmail).mockResolvedValueOnce('valid-user' as any);
    vi.spyOn(db, 'transaction').mockImplementationOnce(() => {
      throw new Error('DB Error');
    });

    const result = await newPasswordAction({
      passwordData: validPasswordData,
      token: 'valid-token',
    });
    expect(result).toEqual({
      success: false,
      message: 'Erro ao redefinir senha',
    });
  });
});
