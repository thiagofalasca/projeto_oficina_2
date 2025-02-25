import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateToISO,
  parseDate,
  isValidDate,
  getStateOptions,
  getCourseOptions,
  getStatusOptions,
  getPeriodOptions,
  calculateDuration,
  generatePagination,
} from '@/lib/utils';
import { courses, states, workshopStatus } from '@/lib/constants';

describe('Utils', () => {
  describe('formatDate e formatDateToISO', () => {
    it('deve converter de ISO para formato DD/MM/AAAA', () => {
      const input = '2023-10-05';
      expect(formatDate(input)).toBe('05/10/2023');
    });

    it('deve converter de formato DD/MM/AAAA para ISO', () => {
      const input = '05/10/2023';
      expect(formatDateToISO(input)).toBe('2023-10-05');
    });
  });

  describe('parseDate', () => {
    it('deve retornar um objeto Date para uma data válida', () => {
      const input = '05/10/2023';
      const date = parseDate(input);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(9); // mês é zero-indexado, Outubro é 9
      expect(date.getDate()).toBe(5);
    });
  });

  describe('isValidDate', () => {
    it('deve retornar true para uma data válida', () => {
      expect(isValidDate('05/10/2023')).toBe(true);
    });

    it('deve retornar false para uma data inválida', () => {
      expect(isValidDate('31/02/2023')).toBe(false);
    });
  });

  describe('getStateOptions', () => {
    it('deve retornar um array de estados', () => {
      const options = getStateOptions();
      expect(options).toHaveLength(states.length);
      options.forEach((option, index) => {
        expect(option).toHaveProperty('value', states[index]);
        expect(option).toHaveProperty('label', states[index]);
      });
    });
  });

  describe('getCourseOptions', () => {
    it('deve retornar um array de cursos', () => {
      const options = getCourseOptions();
      expect(options.length).toBe(courses.length);
      options.forEach((option, index) => {
        expect(option).toHaveProperty('value', courses[index].id);
        expect(option).toHaveProperty('label', courses[index].name);
      });
    });
  });

  describe('getStatusOptions', () => {
    it('deve retornar um array de workshopStatus', () => {
      const options = getStatusOptions();
      expect(options.length).toBe(workshopStatus.length);
      options.forEach((option, index) => {
        expect(option).toHaveProperty('value', workshopStatus[index]);
        expect(option).toHaveProperty('label', workshopStatus[index]);
      });
    });
  });

  describe('getPeriodOptions', () => {
    it('deve retornar array vazio se selectedCourse for null', () => {
      expect(getPeriodOptions(null)).toEqual([]);
    });

    it('deve retornar opções de períodos baseadas no totalPeriods do curso', () => {
      const dummyCourse = { totalPeriods: 4 } as any;
      const options = getPeriodOptions(dummyCourse);
      expect(options).toHaveLength(4);
      options.forEach((option, index) => {
        expect(option).toEqual({
          value: (index + 1).toString(),
          label: `${index + 1}º Período`,
        });
      });
    });
  });

  describe('calculateDuration', () => {
    it('deve retornar "1 dia" quando a data de início e término forem iguais', () => {
      const start = '2023-10-05';
      const end = '2023-10-05';
      expect(calculateDuration(start, end)).toBe('1 dia');
    });

    it('deve retornar a quantidade correta de dias entre duas datas', () => {
      const start = '2023-10-01';
      const end = '2023-10-03';
      expect(calculateDuration(start, end)).toBe('3 dias');
    });
  });

  describe('generatePagination', () => {
    it('deve retornar paginação completa se totalPages for menor ou igual a 7', () => {
      const pagination = generatePagination(1, 5);
      expect(pagination).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve retornar opção para as primeiras páginas quando currentPage <= 3 e totalPages > 7', () => {
      const pagination = generatePagination(2, 10);
      expect(pagination).toEqual([1, 2, 3, '...', 9, 10]);
    });

    it('deve retornar opção para as últimas páginas quando currentPage >= totalPages - 2', () => {
      const pagination = generatePagination(9, 10);
      expect(pagination).toEqual([1, 2, '...', 8, 9, 10]);
    });

    it('deve retornar paginação intermediária para currentPage entre 3 e totalPages - 2', () => {
      const pagination = generatePagination(5, 10);
      expect(pagination).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });
  });
});
