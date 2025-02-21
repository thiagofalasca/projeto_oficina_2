import { z } from 'zod';
import { isValidDate, parseDate } from '../utils';
import { workshopStatus } from '../constants';

export const workshopSchema = z
  .object({
    professorId: z
      .string()
      .nullish()
      .transform((val) => (val === null || val === undefined ? '' : val))
      .pipe(z.string().min(1, 'Responsável é obrigatório.')),
    title: z
      .string()
      .min(1, 'Título é obrigatório.')
      .max(50, 'Título pode conter no máximo 50 caracteres.')
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        'Título pode conter apenas letras, números e espaços'
      )
      .trim(),
    description: z
      .string()
      .max(300, 'Descrição pode conter no máximo 300 caracteres.')
      .trim()
      .optional(),
    startDate: z
      .string()
      .min(1, 'Data é obrigatória')
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Campo deve estar no formato DD/MM/YYYY')
      .refine(isValidDate, 'Data inválida'),
    endDate: z
      .string()
      .min(1, 'Data é obrigatória')
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Campo deve estar no formato DD/MM/YYYY')
      .refine(isValidDate, 'Data inválida'),
    status: z.enum(workshopStatus, { message: 'Status inválido' }),
    key: z
      .string()
      .max(10, 'Chave pode conter no máximo 10 caracteres.')
      .regex(/^[a-zA-Z0-9]*$/, 'Chave pode conter apenas letras e números')
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const start = parseDate(data.startDate);
    const end = parseDate(data.endDate);
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Data final deve ser posterior à inicial.',
      });
    }
  });

export type workshopInput = z.infer<typeof workshopSchema>;

export const IdentifierSchema = z.object({
  identifier: z.string().min(1, 'Informe RA ou email').trim(),
});

export type IdentifierInput = z.infer<typeof IdentifierSchema>;

export const KeySchema = z.object({
  key: z.string().trim().optional(),
});

export type KeyInput = z.infer<typeof KeySchema>;
