import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';
import { getUserByEmail } from '@/lib/actions/userActions';
import { generatePasswordResetToken } from '@/lib/actions/tokenAction';
import { sendPasswordResetEmail } from '@/lib/mail';
import { resetAction } from '@/lib/actions/auth/resetAction';
import { validUser } from '@/tests/mocks/mocked-data';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/actions/userActions', () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock('@/lib/actions/tokenAction', () => ({
  generatePasswordResetToken: vi.fn(),
}));

vi.mock('@/lib/mail', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  expirePath: vi.fn(),
}));

describe('Reset Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro de validação quando email é inválido', async () => {
    const result = await resetAction({ email: 'invalid-email' });
    expect(result.success).toBe(false);
    expect(result.validationErrors).toBeDefined();
  });

  it('deve retornar erro quando email não existe', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce(null);
    const result = await resetAction({ email: validUser.email });
    expect(result).toEqual({ success: false, message: 'Email não encontrado' });
  });

  it('deve retornar erro quando falha ao gerar token', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce('valid-user' as any);
    vi.mocked(generatePasswordResetToken).mockResolvedValueOnce(null);
    const result = await resetAction({ email: validUser.email });
    expect(result).toEqual({ success: false, message: 'Erro ao gerar token' });
  });

  it('deve retornar erro quando falha ao enviar email', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce('valid-user' as any);
    vi.mocked(generatePasswordResetToken).mockResolvedValueOnce(
      'valid-token' as any
    );
    vi.mocked(sendPasswordResetEmail).mockResolvedValueOnce({ success: false });

    const result = await resetAction({ email: validUser.email });

    expect(result).toEqual({
      success: false,
      message: 'Erro ao enviar email de redefinição de senha',
    });
  });

  it('deve redirecionar após sucesso no processo completo', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce('valid-user' as any);
    vi.mocked(generatePasswordResetToken).mockResolvedValueOnce(
      'valid-token' as any
    );
    vi.mocked(sendPasswordResetEmail).mockResolvedValueOnce({ success: true });

    await resetAction({ email: validUser.email });

    expect(expirePath).toHaveBeenCalledWith('/auth/reset/mail-sent');
    expect(redirect).toHaveBeenCalledWith('/auth/reset/mail-sent');
  });
});
