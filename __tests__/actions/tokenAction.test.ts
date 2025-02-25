import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from '@/lib/actions/tokenAction';

vi.mock('server-only', () => ({}));

const mockToken = {
  email: 'test@example.com',
  token: 'mock-token',
  expires: expect.any(Date),
  identifier: 'existing-identifier',
};

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => ({
          then: vi.fn(() => mockToken),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
    query: {
      verificationTokens: {
        findFirst: vi.fn(),
      },
      PasswordResetTokens: {
        findFirst: vi.fn(),
      },
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Token Actions', () => {
  describe('generateVerificationToken', () => {
    it('deve gerar token de verificação', async () => {
      vi.spyOn(db.query.verificationTokens, 'findFirst').mockResolvedValue(
        undefined
      );
      const token = await generateVerificationToken('test@example.com');
      expect(db.delete).not.toHaveBeenCalled();
      expect(token).toEqual(mockToken);
    });

    it('deve deletar token existente antes de gerar novo', async () => {
      vi.spyOn(db.query.verificationTokens, 'findFirst').mockResolvedValue(
        mockToken
      );
      const token = await generateVerificationToken('test@example.com');
      expect(db.delete).toHaveBeenCalled();
      expect(token).toEqual(mockToken);
    });

    it('deve retornar null em caso de erro', async () => {
      vi.spyOn(db.query.verificationTokens, 'findFirst').mockResolvedValue(
        undefined
      );
      vi.spyOn(db, 'insert').mockRejectedValueOnce(new Error('DB Error'));
      const token = await generateVerificationToken('test@example.com');
      expect(token).toBeNull();
      expect(db.delete).not.toHaveBeenCalled();
    });
  });

  describe('generatePasswordResetToken', () => {
    it('deve gerar token de reset de senha', async () => {
      vi.spyOn(db.query.PasswordResetTokens, 'findFirst').mockResolvedValue(
        undefined
      );
      const token = await generatePasswordResetToken('test@example.com');
      expect(token).toEqual(mockToken);
      expect(db.delete).not.toHaveBeenCalled();
    });

    it('deve deletar token existente antes de gerar novo', async () => {
      vi.spyOn(db.query.PasswordResetTokens, 'findFirst').mockResolvedValue(
        mockToken
      );
      const token = await generatePasswordResetToken('test@example.com');
      expect(db.delete).toHaveBeenCalled();
      expect(token).toEqual(mockToken);
      expect(db.delete).toHaveBeenCalled();
    });

    it('deve retornar null em caso de erro', async () => {
      vi.spyOn(db.query.PasswordResetTokens, 'findFirst').mockResolvedValue(
        undefined
      );
      vi.spyOn(db, 'insert').mockRejectedValueOnce(new Error('DB Error'));
      const token = await generatePasswordResetToken('test@example.com');
      expect(token).toBeNull();
      expect(db.delete).not.toHaveBeenCalled();
    });
  });
});
