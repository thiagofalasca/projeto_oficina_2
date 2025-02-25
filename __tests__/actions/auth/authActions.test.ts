import { getCurrentRole, getCurrentUser } from '@/lib/actions/auth/authActions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '@/auth';

vi.mock('server-only', () => ({}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('deve retornar o usuário atual', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { name: 'Test User' },
      } as any);

      const user = await getCurrentUser();
      expect(user).toEqual({ name: 'Test User' });
    });

    it('deve retornar undefined quando não há usuário', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: undefined,
      } as any);

      const user = await getCurrentUser();
      expect(user).toBeUndefined();
    });
  });

  describe('getCurrentRole', () => {
    it('deve retornar o papel atual', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { role: 'admin' },
      } as any);

      const role = await getCurrentRole();
      expect(role).toBe('admin');
    });

    it('deve retornar undefined quando não há user', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: undefined,
      } as any);

      const role = await getCurrentRole();
      expect(role).toBeUndefined();
    });
  });
});
