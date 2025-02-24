import { z } from 'zod';
import { courses, departmentsName, states } from '@/lib/constants';
import { isValidDate } from '../utils';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Endereço de email inválido');

const requiredString = z.string().trim().min(1, 'Campo obrigatório');

const passwordSchema = requiredString
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/\d/, 'Senha deve conter pelo menos um número')
  .regex(/[\W_]/, 'Senha deve conter pelo menos um caractere especial');

const passwordsMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;

const commonPersonFields = {
  name: requiredString
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome pode ter no máximo 50 caracteres')
    .regex(/^[A-Za-z\s]+$/, 'Nome pode conter apenas letras e espaços'),
  cpf: requiredString.regex(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    'Campo deve estar no formato 111.111.111-11'
  ),
  phoneNumber: requiredString.regex(
    /^\(\d{2}\) \d{5}(?:-\d{4})?$/,
    'O número deve estar no formato (11) 11111-1111'
  ),
  birthDate: requiredString
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Campo deve estar no formato DD/MM/YYYY')
    .refine(isValidDate, 'Data de nascimento inválida'),
  postalCode: requiredString.regex(
    /^\d{5}-\d{3}$/,
    'Campo deve estar no formato 11111-111'
  ),
  state: z.enum(states, { message: 'Estado inválido' }),
  address: requiredString.max(50, 'Endereço pode ter no máximo 50 caracteres'),
};

const commonCredentials = {
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: requiredString,
};

export const signInSchema = z.object({
  email: emailSchema,
  password: requiredString,
});
export type signInInput = z.infer<typeof signInSchema>;

export const userSchema = z
  .object({
    ...commonPersonFields,
    ra: requiredString.regex(/^\d{7}$/, 'RA deve ter 7 dígitos'),
    course: z.string(),
    period: z.string().transform((value) => value.replace('º', '')),
  })
  .merge(z.object(commonCredentials))
  .refine(passwordsMatch, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    const course = courses.find((course) => course.id === data.course);
    if (!course) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['course'],
        message: 'Curso inválido',
      });
      return;
    }

    const period = parseInt(data.period);
    if (isNaN(period) || period < 1 || period > course.totalPeriods) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['period'],
        message: 'Período inválido para o curso selecionado',
      });
    }
  });
export type userInput = z.infer<typeof userSchema>;

export const resetSchema = z.object({
  email: emailSchema,
});
export type resetInput = z.infer<typeof resetSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });
export type newPasswordInput = z.infer<typeof newPasswordSchema>;

export const adminSchema = z
  .object({
    ...commonPersonFields,
    department: z.enum(departmentsName, { message: 'Departamento inválido' }),
  })
  .merge(z.object(commonCredentials))
  .refine(passwordsMatch, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });
export type adminInput = z.infer<typeof adminSchema>;

export const superAdminSchema = z
  .object({
    ...commonPersonFields,
  })
  .merge(z.object(commonCredentials))
  .refine(passwordsMatch, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });
export type superAdminInput = z.infer<typeof superAdminSchema>;
