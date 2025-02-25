import { vi } from 'vitest';

export class AuthError extends Error {
  type: string;
  constructor(type: string) {
    super(type);
    this.type = type;
  }
}

const NextAuth = () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: {
    GET: vi.fn(),
    POST: vi.fn(),
  },
  AuthError: AuthError,
});

export default NextAuth;
