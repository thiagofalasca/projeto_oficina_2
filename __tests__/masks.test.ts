import { describe, it, expect } from 'vitest';
import {
  phoneNumberMask,
  nameMask,
  cpfMask,
  dateMask,
  postalCodeMask,
  raMask,
  emailMask,
} from '@/lib/masks';

describe('Masks', () => {
  describe('phoneNumberMask', () => {
    it('deve retornar string vazia se não houver números', () => {
      expect(phoneNumberMask('abc')).toBe('');
    });

    it('deve formatar corretamente um número completo', () => {
      expect(phoneNumberMask('12345678901')).toBe('(12) 34567-8901');
    });

    it('deve formatar parcialmente se informado menos dígitos', () => {
      expect(phoneNumberMask('12')).toBe('(12');
      expect(phoneNumberMask('12345')).toBe('(12) 345');
    });
  });

  describe('nameMask', () => {
    it('deve formatar a string para ter a primeira letra maiúscula', () => {
      expect(nameMask('joHN doE')).toBe('John Doe');
    });
  });

  describe('cpfMask', () => {
    it('deve retornar string vazia para valor vazio ou sem dígitos', () => {
      expect(cpfMask('abc')).toBe('');
    });

    it('deve formatar corretamente um CPF completo', () => {
      expect(cpfMask('12345678901')).toBe('123.456.789-01');
    });

    it('deve formatar parcialmente conforme a quantidade de dígitos', () => {
      expect(cpfMask('12')).toBe('12');
      expect(cpfMask('1234')).toBe('123.4');
    });
  });

  describe('dateMask', () => {
    it('deve retornar string vazia se não houver dígitos', () => {
      expect(dateMask('ab/cd')).toBe('');
    });

    it('deve formatar corretamente uma data completa', () => {
      expect(dateMask('01022023')).toBe('01/02/2023');
    });

    it('deve formatar parcialmente conforme a quantidade de dígitos', () => {
      expect(dateMask('123')).toBe('12/3');
      expect(dateMask('12')).toBe('12');
    });
  });

  describe('postalCodeMask', () => {
    it('deve retornar string vazia se não houver dígitos', () => {
      expect(postalCodeMask('abc')).toBe('');
    });

    it('deve formatar corretamente o CEP completo', () => {
      expect(postalCodeMask('12345678')).toBe('12345-678');
    });

    it('não deve adicionar hífen se não houver dígitos suficientes', () => {
      expect(postalCodeMask('12345')).toBe('12345');
    });
  });

  describe('raMask', () => {
    it('deve retornar os primeiros 7 dígitos', () => {
      expect(raMask('1234567890')).toBe('1234567');
    });

    it('deve retornar string vazia se não houver dígitos', () => {
      expect(raMask('abc')).toBe('');
    });
  });

  describe('emailMask', () => {
    it('deve retornar o email em letras minúsculas', () => {
      expect(emailMask('Test@Example.COM')).toBe('test@example.com');
    });
  });
});
