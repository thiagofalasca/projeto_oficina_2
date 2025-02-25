import { courses, states } from '@/lib/constants';

export const validPasswordData = {
  password: 'ValidPass123!',
  confirmPassword: 'ValidPass123!',
};

const expiredDate = new Date();
expiredDate.setHours(expiredDate.getHours() - 1);

const validDate = new Date();
validDate.setHours(validDate.getHours() + 1);

export const validToken = {
  identifier: '1',
  email: 'test@example.com',
  token: 'valid-token',
  expires: validDate,
};

export const expiredToken = {
  identifier: '1',
  email: 'test@example.com',
  token: 'invalid-token',
  expires: expiredDate,
};

export const validUser = {
  email: 'test@example.com',
  cpf: '12345678900',
  ra: '1234567',
  password: 'ValidPass123!',
};

export const mockUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'ValidPass123!',
  confirmPassword: 'ValidPass123!',
  cpf: '123.456.789-99',
  phoneNumber: '(11) 99999-9999',
  birthDate: '01/01/2000',
  postalCode: '12345-678',
  state: states[0],
  address: 'Test Address',
  ra: '1234567',
  course: courses[0].id,
  period: '1',
};
