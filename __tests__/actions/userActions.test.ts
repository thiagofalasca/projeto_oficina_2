import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { validateUser } from '@/lib/actions/userActions';
import { mockUserData, validUser } from '../mocks/mocked-data';

vi.mock('server-only', () => ({}));

vi.mock('@/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
      students: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve retornar sucesso quando não existem dados duplicados', async () => {
      vi.spyOn(db.query.users, 'findFirst').mockResolvedValue(undefined);
      vi.spyOn(db.query.students, 'findFirst').mockResolvedValue(undefined);

      const result = await validateUser(
        validUser.email,
        validUser.cpf,
        validUser.ra
      );
      expect(result).toEqual({ success: true });
    });

    it('deve retornar erro quando email já existe', async () => {
      vi.spyOn(db.query.users, 'findFirst').mockResolvedValue(
        'existing-user' as any
      );

      const result = await validateUser(
        validUser.email,
        validUser.cpf,
        validUser.ra
      );
      expect(result).toEqual({
        success: false,
        message: 'Email já cadastrado',
      });
    });

    it('deve retornar erro quando CPF já existe', async () => {
      vi.spyOn(db.query.users, 'findFirst')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('existing-cpf' as any);

      const result = await validateUser(
        validUser.email,
        validUser.cpf,
        validUser.ra
      );
      expect(result).toEqual({ success: false, message: 'CPF já cadastrado' });
    });

    it('deve retornar erro quando RA já existe', async () => {
      vi.spyOn(db.query.users, 'findFirst').mockResolvedValue(undefined);
      vi.spyOn(db.query.students, 'findFirst').mockResolvedValue(
        'existing-ra' as any
      );

      const result = await validateUser(
        validUser.email,
        validUser.cpf,
        validUser.ra
      );
      expect(result).toEqual({ success: false, message: 'RA já cadastrado' });
    });

    it('deve retornar erro em caso de exceção', async () => {
      vi.spyOn(db.query.users, 'findFirst').mockRejectedValue(
        new Error('DB Error')
      );

      const result = await validateUser(
        validUser.email,
        validUser.cpf,
        validUser.ra
      );
      expect(result).toEqual({
        success: false,
        message: 'Erro ao validar usuário',
      });
    });
  });
});
