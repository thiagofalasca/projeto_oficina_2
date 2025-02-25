import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { expirePath } from 'next/cache';
import { getCurrentUser } from '@/lib/actions/auth/authActions';
import {
  cancelUserEnrollment,
  removeUserEnrollment,
} from '@/lib/actions/enrollment/deleteEnrollmentAction';
import { getStudentByUserId } from '@/lib/actions/studentActions';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  expirePath: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/actions/auth/authActions', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/actions/studentActions', () => ({
  getStudentByUserId: vi.fn(),
}));

describe('Delete Enrollment Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const studentId = 'student-1';
  const workshopId = 'workshop-1';

  describe('removeUserEnrollment ', () => {
    it('deve remover a inscrição e redirecionar com sucesso', async () => {
      await removeUserEnrollment(studentId, workshopId);

      expect(db.delete).toHaveBeenCalled();
      expect(expirePath).toHaveBeenCalledWith(`/workshops/${workshopId}`);
      expect(redirect).toHaveBeenCalledWith(
        `/workshops/${workshopId}?deleted=true`
      );
    });

    it('deve redirecionar para o workshop com erro se ocorrer exceção na remoção', async () => {
      vi.spyOn(db, 'delete').mockImplementationOnce(() => {
        throw new Error('DB Error');
      });

      const consoleMock = vi
        .spyOn(console, 'error')
        .mockImplementationOnce(() => undefined);

      await removeUserEnrollment(studentId, workshopId);

      expect(redirect).toHaveBeenCalledWith(
        `/workshops/${workshopId}?enrollmentError=true`
      );
      expect(consoleMock).toHaveBeenLastCalledWith(
        'Erro ao remover estudante:',
        new Error('DB Error')
      );
    });
  });

  describe('cancelUserEnrollment', () => {
    it('deve redirecionar para sign-out se não houver usuário atual', async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(undefined);
      vi.mocked(redirect).mockImplementationOnce(() => {
        throw new Error('redirect');
      });
      await expect(cancelUserEnrollment(workshopId)).rejects.toThrow(
        'redirect'
      );
      expect(redirect).toHaveBeenCalledWith('/api/auth/sign-out');
    });

    it('deve redirecionar com erro se não houver aluno associado ao usuário', async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce('valid-user' as any);
      vi.mocked(getStudentByUserId).mockResolvedValueOnce(null);
      vi.mocked(redirect).mockImplementationOnce(() => {
        throw new Error('redirect');
      });

      await expect(cancelUserEnrollment(workshopId)).rejects.toThrow(
        'redirect'
      );
      expect(redirect).toHaveBeenCalledWith(
        `/workshops/${workshopId}?enrollmentError=true`
      );
    });

    it('deve cancelar a inscrição e redirecionar com sucesso', async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce('valid-user' as any);
      vi.mocked(getStudentByUserId).mockResolvedValueOnce(
        'valid-student' as any
      );
      await cancelUserEnrollment(workshopId);
      expect(db.delete).toHaveBeenCalled();
      expect(expirePath).toHaveBeenCalledWith(`/workshops`);
      expect(redirect).toHaveBeenCalledWith(`/workshops`);
    });

    it('deve redirecionar para o workshop com erro se ocorrer falha na remoção durante cancelUserEnrollment', async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce('valid-user' as any);
      vi.mocked(getStudentByUserId).mockResolvedValueOnce(
        'valid-student' as any
      );
      vi.spyOn(db, 'delete').mockImplementationOnce(() => {
        throw new Error('DB Error');
      });
      vi.mocked(redirect).mockImplementationOnce(() => {
        throw new Error('redirect');
      });
      const consoleMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      await expect(cancelUserEnrollment(workshopId)).rejects.toThrow(
        'redirect'
      );
      expect(redirect).toHaveBeenCalledWith(
        `/workshops/${workshopId}?enrollmentError=true`
      );
      expect(consoleMock).toHaveBeenCalledOnce();
      expect(consoleMock).toHaveBeenLastCalledWith(
        'Erro ao remover estudante:',
        new Error('DB Error')
      );
    });
  });
});
