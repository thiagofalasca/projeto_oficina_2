import { signInAction } from '@/lib/actions/auth/signInAction';
import { generateVerificationToken } from '@/lib/actions/tokenAction';
import { getUserByEmail } from '@/lib/actions/userActions';
import { sendVerificationEmail } from '@/lib/mail';
import { signInInput } from '@/lib/validations/user';
import { signIn } from '@/tests/mocks/auth';
import { validUser } from '@/tests/mocks/mocked-data';
import { AuthError } from '@/tests/mocks/next-auth';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/actions/userActions', () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock('@/lib/actions/tokenAction', () => ({
  generateVerificationToken: vi.fn(),
}));

vi.mock('@/lib/mail', () => ({
  sendVerificationEmail: vi.fn(),
}));

describe('Sign In Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro de validação quando campos são inválidos', async () => {
    const result = await signInAction({
      email: 'invalid-email',
      password: '123',
    });

    expect(result.success).toBe(false);
    expect(result.validationErrors).toBeDefined();
  });

  it('deve retornar erro quando usuário não existe', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce(null);

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({
      success: false,
      message: 'Credenciais inválidas',
    });
  });

  it('deve retornar erro quando falha ao gerar token de verificação', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: null,
    } as any);

    vi.mocked(generateVerificationToken).mockResolvedValueOnce(null);

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({
      success: false,
      message: 'Erro ao gerar token',
    });
  });

  it('deve retornar erro quando falha ao enviar email de verificação', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: null,
    } as any);

    vi.mocked(generateVerificationToken).mockResolvedValueOnce(
      'valid-token' as any
    );

    vi.mocked(sendVerificationEmail).mockResolvedValueOnce({ success: false });

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({
      success: false,
      message: 'Erro ao enviar email de verificação',
    });
  });

  it('deve enviar email de verificação quando email não está verificado', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: null,
    } as any);

    vi.mocked(generateVerificationToken).mockResolvedValueOnce(
      'valid-token' as any
    );

    vi.mocked(sendVerificationEmail).mockResolvedValueOnce({ success: true });

    const result = await signInAction(validUser as signInInput);
    expect(result).toEqual({
      success: true,
      message: 'Email de confirmação de conta enviado!',
    });
    expect(generateVerificationToken).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalled();
  });

  it('deve retornar sucesso quando login é bem sucedido', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: new Date(),
    } as any);
    vi.mocked(signIn).mockResolvedValueOnce({ ok: true });

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({ success: true });
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: validUser.email,
      password: validUser.password,
      redirectTo: '/workshops',
    });
  });

  it('deve retornar erro quando AuthError é lançado', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: new Date(),
    } as any);

    const authError = new AuthError('Invalid credentials');
    authError.type = 'CredentialsSignin';

    vi.mocked(signIn).mockRejectedValueOnce(authError);

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({
      success: false,
      message: 'Credenciais inválidas',
    });
  });

  it('deve retornar erro genérico quando ocorre exceção não tratada', async () => {
    vi.mocked(getUserByEmail).mockResolvedValueOnce({
      email: validUser.email,
      emailVerified: new Date(),
    } as any);

    vi.mocked(signIn).mockRejectedValueOnce(new AuthError('Generic error'));

    const result = await signInAction(validUser as signInInput);

    expect(result).toEqual({
      success: false,
      message: 'Erro ao realizar login',
    });
  });
});
